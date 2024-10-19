import { ethers, network } from "hardhat";
import { expect } from "chai";
import { deployProxy, signRequestTransfer, CONSTANT, logger } from "../utils/util";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Buffer, ERC20, Mudskipper, Reserve, Vault } from "../../typechain-types";
import { Contract } from "ethers";
import { QuickSwapQuoterABI, QuickSwapRouterABI, UnaBridgeABI, UnaBridgeStorageABI } from "../utils/abi";
import { ExitERC20, QuickSwapExactInputSingleParams, RequestTicket, SwapRequest } from "../utils/type";

const RPC_URL = "https://polygon-mainnet.infura.io/v3/0f0594731ab14200bc3e2dafdaa56d4a";

const WEMIX_CHAIN_SELECTOR = 5142893604156789321n;

const ContractAddress = {
    QuickSwapRouter: "0xf5b509bB0909a69B1c207E495f687a596C168E12",
    QuickSwapQuoter: "0xa15F0D7377B2A0C0c10db057f641beD21028FC89",
    UnaBridge: "0x2f1c4ddd1670991642932aafeee97bf737d4e309",
    UnaBridgeStorage: "0x2293c086be282f4f2ee52622162d1b2453edb012",
    WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    unaWEMIX: "0x186d65ced0693382713437e34ef8723fd6aa9a1e",
};

describe("Polygon", function () {
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
    let WMATIC: ERC20;
    let unaWEMIX: ERC20;

    let operator: HardhatEthersSigner;
    let ticketPublisher: HardhatEthersSigner;
    let mudskipperManager: HardhatEthersSigner;
    let txRelayer: HardhatEthersSigner;
    let user1: HardhatEthersSigner;
    let user2: HardhatEthersSigner;

    before(async () => {
        // const polygonProvider = new ethers.JsonRpcProvider(RPC_URL);
        // const latestBlock = await polygonProvider.getBlockNumber();
        await network.provider.send("hardhat_reset", [
            {
                forking: {
                    jsonRpcUrl: RPC_URL,
                    blockNumber: 54832950,
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
        swapRouter = new ethers.Contract(ContractAddress.QuickSwapRouter, QuickSwapRouterABI, operator);
        swapQuoter = new ethers.Contract(ContractAddress.QuickSwapQuoter, QuickSwapQuoterABI, operator);

        WMATIC = await ethers.getContractAt("ERC20", ContractAddress.WMATIC);
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
        it("Swap MATIC to unaWEMIX with Quick Swap", async () => {
            logger.log("Swap MATIC to unaWEMIX with Quick Swap");

            const maticSendingQunatity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: maticSendingQunatity,
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
                "Mudskipper MATIC Balance : ",
                ethers.formatEther(await ethers.provider.getBalance(mudskipper.target)),
            );

            const exactInputSingleParam: QuickSwapExactInputSingleParams = {
                tokenIn: WMATIC.target,
                tokenOut: unaWEMIX.target,
                recipient: user1.address,
                deadline: ethers.MaxUint256,
                amountIn: maticSendingQunatity,
                amountOutMinimum: 0n,
                limitSqrtPrice: 0n,
            };

            const approveTx = await mudskipper
                .connect(txRelayer)
                .approveMax(WMATIC.target, swapRouter.target, maticSendingQunatity);
            await approveTx.wait();

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: swapRouter.target,
                        approveTo: swapRouter.target,
                        fromAsset: ethers.ZeroAddress,
                        fromQuantity: maticSendingQunatity,
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
                "Mudskipper MATIC Balance : ",
                ethers.formatEther(await ethers.provider.getBalance(mudskipper.target)),
            );
            logger.log("Recipient unaWEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(user1.address)));
        }).timeout(1000000);
    });

    describe("Bridge", () => {
        it("Swap MATIC to unaWEMIX with Quick Swap And Bridge WEMIX3.0 with UnaBridge", async () => {
            logger.log("Swap MATIC to unaWEMIX with Quick Swap And Bridge WEMIX3.0 with UnaBridge");

            const maticSendingQunatity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: maticSendingQunatity,
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
                "Mudskipper MATIC Balance : ",
                ethers.formatEther(await ethers.provider.getBalance(mudskipper.target)),
            );

            const approveTx = await mudskipper
                .connect(txRelayer)
                .approveMax(WMATIC.target, swapRouter.target, maticSendingQunatity);
            await approveTx.wait();

            const quote = await swapQuoter.quoteExactInputSingle.staticCall(
                WMATIC.target,
                unaWEMIX.target,
                maticSendingQunatity,
                0n,
            );
            const amountOut = quote[0];

            const exactInputSingleParam: QuickSwapExactInputSingleParams = {
                tokenIn: WMATIC.target,
                tokenOut: unaWEMIX.target,
                recipient: mudskipper.target,
                deadline: ethers.MaxUint256,
                amountIn: maticSendingQunatity,
                amountOutMinimum: amountOut,
                limitSqrtPrice: 0n,
            };

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: swapRouter.target,
                        approveTo: swapRouter.target,
                        fromAsset: ethers.ZeroAddress,
                        fromQuantity: maticSendingQunatity,
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
                amountOut,
                WEMIX_CHAIN_SELECTOR,
            );
            const bridgeAmount: bigint = amountOut - serviceFee;

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
                totalAmount: amountOut,
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
                "Mudskipper MATIC Balance : ",
                ethers.formatEther(await ethers.provider.getBalance(mudskipper.target)),
            );
            logger.log(
                "Mudskipper unaWEMIX Balance : ",
                ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)),
            );
        }).timeout(1000000);
    });
});
