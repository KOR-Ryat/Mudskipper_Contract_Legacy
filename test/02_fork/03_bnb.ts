import { ethers, network } from "hardhat";
import { expect } from "chai";
import { deployProxy, signRequestTransfer, CONSTANT, logger } from "../utils/util";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Buffer, ERC20, Mudskipper, Reserve, Vault } from "../../typechain-types";
import { Contract } from "ethers";
import { PancakeSwapQuoterABI, PancakeSwapRouterABI, UnaBridgeABI, UnaBridgeStorageABI } from "../utils/abi";
import { ExactInputSingleParams, ExitERC20, RequestTicket, SwapRequest } from "../utils/type";

const RPC_URL = "https://bsc-rpc.publicnode.com";

const WEMIX_CHAIN_SELECTOR = 5142893604156789321n;

const ContractAddress = {
    PancakeSwapRouter: "0x13f4ea83d0bd40e75c8222255bc855a974568dd4",
    PancakeSwapQuoter: "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997",
    UnaBridge: "0xf894ce041b225b1b59c755d4accab3569de35101",
    UnaBridgeStorage: "0x937d5c1c29a4920d04734fc947bcf5662534e8c5",
    WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    unaWEMIX: "0x98169bf9b7a44edad372364063b897e16ebba88e",
};

describe("BNB", function () {
    let snapshotId: number;
    let initialSnapshotId: number;

    let mudskipper: Mudskipper;
    let reserve: Reserve;
    let buffer: Buffer;
    let vault: Vault;
    let unaBridge: Contract;
    let unaBridgeStorage: Contract;
    let swapRouter: Contract;
    let swapQuoter: Contract;
    let WBNB: ERC20;
    let unaWEMIX: ERC20;

    let operator: HardhatEthersSigner;
    let ticketPublisher: HardhatEthersSigner;
    let mudskipperManager: HardhatEthersSigner;
    let txRelayer: HardhatEthersSigner;
    let user1: HardhatEthersSigner;
    let user2: HardhatEthersSigner;

    before(async () => {
        const bnbProvider = new ethers.JsonRpcProvider(RPC_URL);
        const latestBlock = await bnbProvider.getBlockNumber();
        await network.provider.send("hardhat_reset", [
            {
                forking: {
                    jsonRpcUrl: RPC_URL,
                    // blockNumber: latestBlock,
                },
            },
        ]);

        [operator, ticketPublisher, mudskipperManager, txRelayer, user1, user2] = await ethers.getSigners();

        mudskipper = await deployProxy("Mudskipper", ["initialize", [operator.address]], operator);
        const grantRoleTx1 = await mudskipper.grantRole(ethers.id("TICKET_PUBLISHER"), ticketPublisher.address);
        await grantRoleTx1.wait();
        const grantRoleTx2 = await mudskipper.grantRole(ethers.id("MUDSKIPPER_MANAGER"), mudskipperManager.address);
        await grantRoleTx2.wait();
        const grantRoleTx3 = await mudskipper.grantRole(ethers.id("TX_RELAYER"), txRelayer.address);
        await grantRoleTx3.wait();

        vault = await deployProxy("Vault", ["initialize", [operator.address]], operator);
        const writeRegistryTx1 = await mudskipper
            .connect(mudskipperManager)
            .writeRegistry(ethers.id("MUDSKIPPER_VAULT"), vault.target);
        await writeRegistryTx1.wait();

        buffer = await deployProxy("Buffer", ["initialize", [operator.address]], operator);
        const writeRegistryTx2 = await mudskipper
            .connect(mudskipperManager)
            .writeRegistry(ethers.id("MUDSKIPPER_BUFFER"), buffer.target);
        await writeRegistryTx2.wait();

        unaBridge = new ethers.Contract(ContractAddress.UnaBridge, UnaBridgeABI, operator);
        const writeRegistryTx3 = await mudskipper
            .connect(mudskipperManager)
            .writeRegistry(ethers.id("BRIDGE_UNABRIDGE"), unaBridge.target);
        await writeRegistryTx3.wait();
        unaBridgeStorage = new ethers.Contract(ContractAddress.UnaBridgeStorage, UnaBridgeStorageABI, operator);
        swapRouter = new ethers.Contract(ContractAddress.PancakeSwapRouter, PancakeSwapRouterABI, operator);
        swapQuoter = new ethers.Contract(ContractAddress.PancakeSwapQuoter, PancakeSwapQuoterABI, operator);

        WBNB = await ethers.getContractAt("ERC20", ContractAddress.WBNB);
        unaWEMIX = await ethers.getContractAt("ERC20", ContractAddress.unaWEMIX);

        initialSnapshotId = await network.provider.send("evm_snapshot");
    });

    beforeEach(async () => {
        snapshotId = await network.provider.send("evm_snapshot");
    });

    afterEach(async () => {
        await network.provider.send("evm_revert", [snapshotId]);
    });

    after(async () => {
        await network.provider.send("evm_revert", [initialSnapshotId]);
        await network.provider.send("hardhat_reset", [
            {
                forking: {
                    jsonRpcUrl: "https://api.test.wemix.com",
                },
            },
        ]);
    });

    describe("Swap", () => {
        it("Swap BNB to unaWEMIX with Pancake Swap", async () => {
            logger.log("Swap BNB to unaWEMIX with Pancake Swap");

            const bnbSendingQunatity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: bnbSendingQunatity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig, {
                    value: requestTicket.quantity,
                });
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log(
                "Mudskipper BNB Balance : ",
                ethers.formatEther(await ethers.provider.getBalance(mudskipper.target)),
            );

            const exactInputSingleParam: ExactInputSingleParams = {
                tokenIn: WBNB.target,
                tokenOut: unaWEMIX.target,
                fee: 100n,
                recipient: user1.address,
                amountIn: bnbSendingQunatity,
                amountOutMinimum: 0n,
                sqrtPriceLimitX96: 0n,
            };

            const approveTx = await mudskipper
                .connect(txRelayer)
                .approveMax(WBNB.target, swapRouter.target, bnbSendingQunatity);
            await approveTx.wait();

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: swapRouter.target,
                        approveTo: swapRouter.target,
                        fromAsset: ethers.ZeroAddress,
                        fromQuantity: bnbSendingQunatity,
                        toAsset: unaWEMIX.target,
                        callData: swapRouter.interface.encodeFunctionData("exactInputSingle", [exactInputSingleParam]),
                        requiresDeposit: false,
                    },
                ],
                recipient: user1.address,
                minOutput: 0n,
            };
            const swapTx = await mudskipper.connect(txRelayer).swap(swapRequest);
            await swapTx.wait();

            logger.log(
                "Mudskipper BNB Balance : ",
                ethers.formatEther(await ethers.provider.getBalance(mudskipper.target)),
            );
            logger.log("Recipient unaWEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(user1.address)));
        }).timeout(1000000);
    });

    describe("Bridge", () => {
        it("Swap BNB to unaWEMIX with Pancake Swap And Bridge WEMIX3.0 with UnaBridge", async () => {
            logger.log("Swap BNB to unaWEMIX with Pancake Swap And Bridge WEMIX3.0 with UnaBridge");

            const bnbSendingQunatity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: bnbSendingQunatity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig, {
                    value: requestTicket.quantity,
                });
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log(
                "Mudskipper BNB Balance : ",
                ethers.formatEther(await ethers.provider.getBalance(mudskipper.target)),
            );

            const approveTx = await mudskipper
                .connect(txRelayer)
                .approveMax(WBNB.target, swapRouter.target, bnbSendingQunatity);
            await approveTx.wait();

            const quote = await swapQuoter.quoteExactInputSingle.staticCall({
                tokenIn: WBNB.target,
                tokenOut: unaWEMIX.target,
                amountIn: bnbSendingQunatity,
                fee: 100,
                sqrtPriceLimitX96: 0,
            });

            const exactInputSingleParam: ExactInputSingleParams = {
                tokenIn: WBNB.target,
                tokenOut: unaWEMIX.target,
                fee: 100n,
                recipient: mudskipper.target,
                amountIn: bnbSendingQunatity,
                amountOutMinimum: quote.amountOut,
                sqrtPriceLimitX96: 0n,
            };

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: swapRouter.target,
                        approveTo: swapRouter.target,
                        fromAsset: ethers.ZeroAddress,
                        fromQuantity: bnbSendingQunatity,
                        toAsset: unaWEMIX.target,
                        callData: swapRouter.interface.encodeFunctionData("exactInputSingle", [exactInputSingleParam]),
                        requiresDeposit: false,
                    },
                ],
                recipient: mudskipper.target,
                minOutput: 0n,
            };

            const serviceFee: bigint = await unaBridgeStorage.getServiceFee(
                unaWEMIX.target,
                quote.amountOut,
                WEMIX_CHAIN_SELECTOR,
            );
            const bridgeAmount: bigint = quote.amountOut - serviceFee;

            const dstReceiver = await unaBridge.getDstReceiver(WEMIX_CHAIN_SELECTOR);
            const ccipFee: bigint = await unaBridge.getCcipFee(
                WEMIX_CHAIN_SELECTOR,
                dstReceiver,
                "0x",
                700000n,
                ethers.ZeroAddress,
                [
                    {
                        token: unaWEMIX.target,
                        amount: bridgeAmount,
                    },
                ],
            );

            const exitERC20Calldata: ExitERC20 = {
                from: txRelayer.address,
                dstChain: WEMIX_CHAIN_SELECTOR,
                to: mudskipper.target,
                gasLimit: 700000n,
                ccipFeeTokenAmountForCurrChain: {
                    token: ethers.ZeroAddress,
                    amount: ccipFee * 2n,
                },
                ccipFeeTokenAmountForNextChain: {
                    token: ethers.ZeroAddress,
                    amount: 0n,
                },
                totalAmount: quote.amountOut,
                bridgedAmount: bridgeAmount,
                srcToken: unaWEMIX.target,
                metaHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                contractAddress: ethers.ZeroAddress,
                inputs: "0x",
            };

            const swapAndBridgeTx = await mudskipper
                .connect(txRelayer)
                .swapAndUnaBridge(swapRequest, exitERC20Calldata, { value: ccipFee * 2n });
            await expect(swapAndBridgeTx).to.be.emit(unaBridge, "ExitERC20");

            logger.log(
                "Mudskipper BNB Balance : ",
                ethers.formatEther(await ethers.provider.getBalance(mudskipper.target)),
            );
            logger.log(
                "Mudskipper unaWEMIX Balance : ",
                ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)),
            );
        }).timeout(1000000);
    });
});
