import { ethers, network } from "hardhat";
import { expect } from "chai";
import { deployProxy, signRequestTransfer, CONSTANT, logger } from "../utils/util";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Buffer, ERC20, Mudskipper, Reserve, Vault } from "../../typechain-types";
import { Contract } from "ethers";
import { UnaBridgeABI, UnaBridgeStorageABI } from "../utils/abi";
import { ExitERC20, RequestTicket, SwapRequest } from "../utils/type";

const RPC_URL = "https://api.wemix.com";

const ChainSelector = {
    Ethereum: 5009297550715157269n,
    Polygon: 4051577828743386545n,
    Avalanche: 6433500567565415381n,
    BNB: 11344663589394136015n,
    Arbitrum: 4949039107694359620n,
    Optimism: 3734403246176062136n,
};

const ContractAddress = {
    UnaBridge: "0x26e07c47ef5925dafbcb9eb2525e013b1e5ec85d",
    UnaBridgeStorage: "0xf7669c99900469c70dd1b628bc1279dbca581f37",
    UnaPPPSwap: "0x398d227685614aaeb2e4711b048626b0551bc0ee",
    WEMIXFi: "0x49246a1f5b5127b57c15dc185da071398576145b",
    unaWEMIX: "0xf500208d9ab68fea3cc41bd107811e809c0b6b83",
    unaUSDC: "0xcdf764933b9a9ebb2c5da904b9715f3cf981572a",
    stWEMIX: "0x9B377bd7Db130E8bD2f3641E0E161cB613DA93De",
    reflect: "0xBd11F630B0ba8D944dAb0d1feD6ad4fc41a619aa",
    mUSDC: "0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D",
    // mKLEVA: "0xe6801928061CDbE32AC5AD0634427E140EFd05F9",
    // mUSDT: "0xA649325Aa7C5093d12D6F98EB4378deAe68CE23F",
    WEMIX$: "0x8E81fCc2d4A3bAa0eE9044E0D7E36F59C9BbA9c1",
    WCD: "0x2ec6Fc5c495aF0C439E17268d595286d5f897dD0",
    oUSDC: "0xE4c2b5db9de5da0A17ED7ec7176602ad99E52624",
    TIPO: "0x70f1F317697337d297F5338d3dD72a6C4C51BDE1",
    WDR: "0x0D01107F773A0754a3A4125D7B98E2fF707d7289",
    FRC: "0x58083B54013631BaCc0bbB6d4efa543Fee1D9cE0",
};

describe("Wemix", function () {
    let snapshotId: number;
    let initialSnapshotId: number;

    let mudskipper: Mudskipper;
    let reserve: Reserve;
    let buffer: Buffer;
    let vault: Vault;
    let unaBridge: Contract;
    let unaBridgeStorage: Contract;
    let unaWEMIX: ERC20;
    let stWEMIX: ERC20;
    let reflect: ERC20;
    let mUSDC: ERC20;
    let WEMIX$: ERC20;
    let WCD: ERC20;
    let oUSDC: ERC20;
    let TIPO: ERC20;
    let WDR: ERC20;
    let FRC: ERC20;

    let operator: HardhatEthersSigner;
    let ticketPublisher: HardhatEthersSigner;
    let mudskipperManager: HardhatEthersSigner;
    let txRelayer: HardhatEthersSigner;
    let user1: HardhatEthersSigner;
    let user2: HardhatEthersSigner;

    before(async () => {
        // const wemixProvider = new ethers.JsonRpcProvider(RPC_URL);
        // const latestBlock = await wemixProvider.getBlockNumber();
        await network.provider.send("hardhat_reset", [
            {
                forking: {
                    jsonRpcUrl: RPC_URL,
                    blockNumber: 44686515,
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

        unaWEMIX = await ethers.getContractAt("ERC20", ContractAddress.unaWEMIX);
        stWEMIX = await ethers.getContractAt("ERC20", ContractAddress.stWEMIX);
        reflect = await ethers.getContractAt("ERC20", ContractAddress.reflect);
        mUSDC = await ethers.getContractAt("ERC20", ContractAddress.mUSDC);
        WEMIX$ = await ethers.getContractAt("ERC20", ContractAddress.WEMIX$);
        WCD = await ethers.getContractAt("ERC20", ContractAddress.WCD);
        oUSDC = await ethers.getContractAt("ERC20", ContractAddress.oUSDC);
        TIPO = await ethers.getContractAt("ERC20", ContractAddress.TIPO);
        WDR = await ethers.getContractAt("ERC20", ContractAddress.WDR);
        FRC = await ethers.getContractAt("ERC20", ContractAddress.FRC);

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
        it("****** Swap WEMIX to stWEMIX with WEMIX.FI ******", async () => {
            logger.log("****** Swap WEMIX to stWEMIX with WEMIX.FI ******");
            const sendingQuntity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: sendingQuntity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig, { value: sendingQuntity });
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 stWEMIX Balance : ", ethers.formatEther(await stWEMIX.balanceOf(user1.address)));

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: "0x49246a1f5b5127b57c15dc185da071398576145b",
                        approveTo: "0x49246a1f5b5127b57c15dc185da071398576145b",
                        fromAsset: ethers.ZeroAddress,
                        fromQuantity: sendingQuntity,
                        toAsset: stWEMIX.target,
                        callData:
                            "0xc04b8d59000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000015d34aaf54267db7d7c367839aaf71a00a2c6a650000000000000000000000000000000000000000000000000000000065fa9cde0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000c025518aa032bbe000000000000000000000000000000000000000000000000000000000000002b7d72b22a74a216af4a002a1095c8c707d6ec1c5f0000649b377bd7db130e8bd2f3641e0e161cb613da93de000000000000000000000000000000000000000000",
                        requiresDeposit: false,
                    },
                ],
                recipient: user1.address,
                minOutput: 0n,
            };
            const swapTx = await mudskipper.connect(txRelayer).swap(swapRequest);
            await swapTx.wait();

            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 stWEMIX Balance : ", ethers.formatEther(await stWEMIX.balanceOf(user1.address)));
        }).timeout(1000000);

        it("****** Swap WEMIX to REFLECT with WEMIX.FI ******", async () => {
            logger.log("****** Swap WEMIX to REFLECT with WEMIX.FI ******");
            const sendingQuntity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: sendingQuntity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig, { value: sendingQuntity });
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 REFLECT Balance : ", ethers.formatEther(await reflect.balanceOf(user1.address)));

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: "0x80a5a916fb355a8758f0a3e47891dc288dac2665",
                        approveTo: "0x80a5a916fb355a8758f0a3e47891dc288dac2665",
                        fromAsset: ethers.ZeroAddress,
                        fromQuantity: sendingQuntity,
                        toAsset: reflect.target,
                        callData:
                            "0x06fd4ac500000000000000000000000000000000000000000000000006d7829be4c42590000000000000000000000000000000000000000000000000000000000000008000000000000000000000000015d34aaf54267db7d7c367839aaf71a00a2c6a650000000000000000000000000000000000000000000000000000000065fa9c3900000000000000000000000000000000000000000000000000000000000000030000000000000000000000007d72b22a74a216af4a002a1095c8c707d6ec1c5f0000000000000000000000008e81fcc2d4a3baa0ee9044e0d7e36f59c9bba9c1000000000000000000000000bd11f630b0ba8d944dab0d1fed6ad4fc41a619aa",
                        requiresDeposit: false,
                    },
                ],
                recipient: user1.address,
                minOutput: 0n,
            };
            const swapTx = await mudskipper.connect(txRelayer).swap(swapRequest);
            await swapTx.wait();

            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 REFLECT Balance : ", ethers.formatEther(await reflect.balanceOf(user1.address)));
        }).timeout(1000000);

        it("****** Swap WEMIX to mUSDC with WEMIX.FI ******", async () => {
            logger.log("****** Swap WEMIX to mUSDC with WEMIX.FI ******");
            const sendingQuntity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: sendingQuntity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig, { value: sendingQuntity });
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 mUSDC Balance : ", ethers.formatEther(await mUSDC.balanceOf(user1.address)));

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: "0x80a5a916fb355a8758f0a3e47891dc288dac2665",
                        approveTo: "0x80a5a916fb355a8758f0a3e47891dc288dac2665",
                        fromAsset: ethers.ZeroAddress,
                        fromQuantity: sendingQuntity,
                        toAsset: mUSDC.target,
                        callData:
                            "0x06fd4ac500000000000000000000000000000000000000000000000000000000002976e9000000000000000000000000000000000000000000000000000000000000008000000000000000000000000015d34aaf54267db7d7c367839aaf71a00a2c6a650000000000000000000000000000000000000000000000000000000065fa9c8900000000000000000000000000000000000000000000000000000000000000030000000000000000000000007d72b22a74a216af4a002a1095c8c707d6ec1c5f0000000000000000000000008e81fcc2d4a3baa0ee9044e0d7e36f59c9bba9c1000000000000000000000000e3f5a90f9cb311505cd691a46596599aa1a0ad7d",
                        requiresDeposit: false,
                    },
                ],
                recipient: user1.address,
                minOutput: 0n,
            };
            const swapTx = await mudskipper.connect(txRelayer).swap(swapRequest);
            await swapTx.wait();

            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 mUSDC Balance : ", ethers.formatEther(await mUSDC.balanceOf(user1.address)));
        }).timeout(1000000);

        it("****** Swap WEMIX to WEMIX$ with WEMIX.FI ******", async () => {
            logger.log("****** Swap WEMIX to WEMIX$ with WEMIX.FI ******");
            const sendingQuntity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: sendingQuntity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig, { value: sendingQuntity });
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 WEMIX$ Balance : ", ethers.formatEther(await WEMIX$.balanceOf(user1.address)));

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: "0x49246a1f5b5127b57c15dc185da071398576145b",
                        approveTo: "0x49246a1f5b5127b57c15dc185da071398576145b",
                        fromAsset: ethers.ZeroAddress,
                        fromQuantity: sendingQuntity,
                        toAsset: WEMIX$.target,
                        callData:
                            "0xc04b8d59000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000015d34aaf54267db7d7c367839aaf71a00a2c6a650000000000000000000000000000000000000000000000000000000065fa9e310000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000025f60d7372b28972000000000000000000000000000000000000000000000000000000000000002b7d72b22a74a216af4a002a1095c8c707d6ec1c5f0001f48e81fcc2d4a3baa0ee9044e0d7e36f59c9bba9c1000000000000000000000000000000000000000000",
                        requiresDeposit: false,
                    },
                ],
                recipient: user1.address,
                minOutput: 0n,
            };
            const swapTx = await mudskipper.connect(txRelayer).swap(swapRequest);
            await swapTx.wait();

            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 WEMIX$ Balance : ", ethers.formatEther(await WEMIX$.balanceOf(user1.address)));
        }).timeout(1000000);

        it("****** Swap WEMIX to WCD with WEMIX.FI ******", async () => {
            logger.log("****** Swap WEMIX to WCD with WEMIX.FI ******");
            const sendingQuntity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: sendingQuntity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig, { value: sendingQuntity });
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 WCD Balance : ", ethers.formatEther(await WCD.balanceOf(user1.address)));

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: "0x49246a1f5b5127b57c15dc185da071398576145b",
                        approveTo: "0x49246a1f5b5127b57c15dc185da071398576145b",
                        fromAsset: ethers.ZeroAddress,
                        fromQuantity: sendingQuntity,
                        toAsset: WCD.target,
                        callData:
                            "0xc04b8d59000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000015d34aaf54267db7d7c367839aaf71a00a2c6a650000000000000000000000000000000000000000000000000000000065fa9e860000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000002608f416810997cd000000000000000000000000000000000000000000000000000000000000002b7d72b22a74a216af4a002a1095c8c707d6ec1c5f0001f42ec6fc5c495af0c439e17268d595286d5f897dd0000000000000000000000000000000000000000000",
                        requiresDeposit: false,
                    },
                ],
                recipient: user1.address,
                minOutput: 0n,
            };
            const swapTx = await mudskipper.connect(txRelayer).swap(swapRequest);
            await swapTx.wait();

            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 WCD Balance : ", ethers.formatEther(await WCD.balanceOf(user1.address)));
        }).timeout(1000000);

        it("****** Swap WEMIX to oUSDC with WEMIX.FI ******", async () => {
            logger.log("****** Swap WEMIX to oUSDC with WEMIX.FI ******");
            const sendingQuntity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: sendingQuntity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig, { value: sendingQuntity });
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 oUSDC Balance : ", ethers.formatEther(await oUSDC.balanceOf(user1.address)));

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: "0x49246a1f5b5127b57c15dc185da071398576145b",
                        approveTo: "0x49246a1f5b5127b57c15dc185da071398576145b",
                        fromAsset: ethers.ZeroAddress,
                        fromQuantity: sendingQuntity,
                        toAsset: oUSDC.target,
                        callData:
                            "0xc04b8d59000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000015d34aaf54267db7d7c367839aaf71a00a2c6a650000000000000000000000000000000000000000000000000000000065fa9ee40000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000029b81f00000000000000000000000000000000000000000000000000000000000000427d72b22a74a216af4a002a1095c8c707d6ec1c5f0001f48e81fcc2d4a3baa0ee9044e0d7e36f59c9bba9c1000064e4c2b5db9de5da0a17ed7ec7176602ad99e52624000000000000000000000000000000000000000000000000000000000000",
                        requiresDeposit: false,
                    },
                ],
                recipient: user1.address,
                minOutput: 0n,
            };
            const swapTx = await mudskipper.connect(txRelayer).swap(swapRequest);
            await swapTx.wait();

            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 oUSDC Balance : ", ethers.formatEther(await oUSDC.balanceOf(user1.address)));
        }).timeout(1000000);

        it("****** Swap WEMIX to TIPO with WEMIX.FI ******", async () => {
            logger.log("****** Swap WEMIX to TIPO with WEMIX.FI ******");
            const sendingQuntity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: sendingQuntity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig, { value: sendingQuntity });
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 TIPO Balance : ", ethers.formatEther(await TIPO.balanceOf(user1.address)));

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: "0x80a5a916fb355a8758f0a3e47891dc288dac2665",
                        approveTo: "0x80a5a916fb355a8758f0a3e47891dc288dac2665",
                        fromAsset: ethers.ZeroAddress,
                        fromQuantity: sendingQuntity,
                        toAsset: TIPO.target,
                        callData:
                            "0x06fd4ac5000000000000000000000000000000000000000000000002f36268fc05a0a157000000000000000000000000000000000000000000000000000000000000008000000000000000000000000015d34aaf54267db7d7c367839aaf71a00a2c6a650000000000000000000000000000000000000000000000000000000065fa9f1e00000000000000000000000000000000000000000000000000000000000000030000000000000000000000007d72b22a74a216af4a002a1095c8c707d6ec1c5f0000000000000000000000008e81fcc2d4a3baa0ee9044e0d7e36f59c9bba9c100000000000000000000000070f1f317697337d297f5338d3dd72a6c4c51bde1",
                        requiresDeposit: false,
                    },
                ],
                recipient: user1.address,
                minOutput: 0n,
            };
            const swapTx = await mudskipper.connect(txRelayer).swap(swapRequest);
            await swapTx.wait();

            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 TIPO Balance : ", ethers.formatEther(await TIPO.balanceOf(user1.address)));
        }).timeout(1000000);

        it("****** Swap WEMIX to WDR with WEMIX.FI ******", async () => {
            logger.log("****** Swap WEMIX to WDR with WEMIX.FI ******");
            const sendingQuntity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: sendingQuntity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig, { value: sendingQuntity });
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 WDR Balance : ", ethers.formatEther(await WDR.balanceOf(user1.address)));

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: "0x49246a1f5b5127b57c15dc185da071398576145b",
                        approveTo: "0x49246a1f5b5127b57c15dc185da071398576145b",
                        fromAsset: ethers.ZeroAddress,
                        fromQuantity: sendingQuntity,
                        toAsset: WDR.target,
                        callData:
                            "0xc04b8d59000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000015d34aaf54267db7d7c367839aaf71a00a2c6a650000000000000000000000000000000000000000000000000000000065fa9f890000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000a816808c9e04570000000000000000000000000000000000000000000000000000000000000002b7d72b22a74a216af4a002a1095c8c707d6ec1c5f0000640d01107f773a0754a3a4125d7b98e2ff707d7289000000000000000000000000000000000000000000",
                        requiresDeposit: false,
                    },
                ],
                recipient: user1.address,
                minOutput: 0n,
            };
            const swapTx = await mudskipper.connect(txRelayer).swap(swapRequest);
            await swapTx.wait();

            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 WDR Balance : ", ethers.formatEther(await WDR.balanceOf(user1.address)));
        }).timeout(1000000);

        it("****** Swap WEMIX to FRC with WEMIX.FI ******", async () => {
            logger.log("****** Swap WEMIX to FRC with WEMIX.FI ******");
            const sendingQuntity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: sendingQuntity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig, { value: sendingQuntity });
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 FRC Balance : ", ethers.formatEther(await FRC.balanceOf(user1.address)));

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: "0x80a5a916fb355a8758f0a3e47891dc288dac2665",
                        approveTo: "0x80a5a916fb355a8758f0a3e47891dc288dac2665",
                        fromAsset: ethers.ZeroAddress,
                        fromQuantity: sendingQuntity,
                        toAsset: FRC.target,
                        callData:
                            "0x06fd4ac5000000000000000000000000000000000000000000000006b65b4b105eea908d000000000000000000000000000000000000000000000000000000000000008000000000000000000000000015d34aaf54267db7d7c367839aaf71a00a2c6a650000000000000000000000000000000000000000000000000000000065fa9fba00000000000000000000000000000000000000000000000000000000000000030000000000000000000000007d72b22a74a216af4a002a1095c8c707d6ec1c5f0000000000000000000000008e81fcc2d4a3baa0ee9044e0d7e36f59c9bba9c100000000000000000000000058083b54013631bacc0bbb6d4efa543fee1d9ce0",
                        requiresDeposit: false,
                    },
                ],
                recipient: user1.address,
                minOutput: 0n,
            };
            const swapTx = await mudskipper.connect(txRelayer).swap(swapRequest);
            await swapTx.wait();

            logger.log("Mudskipper WEMIX Balance : ", ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)));
            logger.log("User1 FRC Balance : ", ethers.formatEther(await FRC.balanceOf(user1.address)));
        }).timeout(1000000);
    });

    describe("Bridge", () => {
        before(async () => {
            const unaWemixSwapTx = await user1.sendTransaction({
                data: "0xd97495c9000000000000000000000000000000000000000000000000000000000000002000000000000000000000000015d34aaf54267db7d7c367839aaf71a00a2c6a6500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f500208d9ab68fea3cc41bd107811e809c0b6b83000000000000000000000000000000000000000000000000475f3a7c1964d24900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000065fa60e80000000000000000000000000000000000000000000000056bc75e2d6310000000000000000000000000000000000000000000000000000564d702d38f5e0000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000000020000000000000000000000007d72b22a74a216af4a002a1095c8c707d6ec1c5f000000000000000000000000f500208d9ab68fea3cc41bd107811e809c0b6b830000000000000000000000000000000000000000000000000000000000000000",
                to: ContractAddress.UnaPPPSwap,
                value: ethers.parseEther("100"),
                from: user1.address,
                gasPrice: "0x174876e801",
                gasLimit: "0x0b71b0",
            });
            await unaWemixSwapTx.wait();

            const approveTx = await unaWEMIX.connect(user1).approve(mudskipper.target, ethers.MaxUint256);
            await approveTx.wait();
        });

        it("****** unaWEMIX Bridge to Ethereum with UnaBridge ******", async () => {
            logger.log("****** unaWEMIX Bridge to Ethereum with UnaBridge ******");

            const sendingQuntity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: unaWEMIX.target,
                quantity: sendingQuntity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig);
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log(
                "Mudskipper unaWEMIX Balance : ",
                ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)),
            );

            const chainSelector = ChainSelector.Ethereum;
            const serviceFee: bigint = await unaBridgeStorage.getServiceFee(
                unaWEMIX.target,
                sendingQuntity,
                chainSelector,
            );
            const bridgeAmount: bigint = sendingQuntity - serviceFee;

            const dstReceiver = await unaBridge.getDstReceiver(chainSelector);
            const ccipFee: bigint = await unaBridge.getCcipFee(
                chainSelector,
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
                dstChain: chainSelector,
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
                totalAmount: sendingQuntity,
                bridgedAmount: bridgeAmount,
                srcToken: unaWEMIX.target,
                metaHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                contractAddress: ethers.ZeroAddress,
                inputs: "0x",
            };

            const swapAndBridgeTx = await mudskipper
                .connect(txRelayer)
                .bridgeViaUnaBridge(exitERC20Calldata, { value: ccipFee * 2n });
            await expect(swapAndBridgeTx).to.be.emit(unaBridge, "ExitERC20");

            logger.log(
                "Mudskipper unaWEMIX Balance : ",
                ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)),
            );
        }).timeout(1000000);

        it("****** unaWEMIX Bridge to Polygon with UnaBridge ******", async () => {
            logger.log("****** unaWEMIX Bridge to Polygon with UnaBridge ******");

            const sendingQuntity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: unaWEMIX.target,
                quantity: sendingQuntity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig);
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log(
                "Mudskipper unaWEMIX Balance : ",
                ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)),
            );

            const chainSelector = ChainSelector.Polygon;
            const serviceFee: bigint = await unaBridgeStorage.getServiceFee(
                unaWEMIX.target,
                sendingQuntity,
                chainSelector,
            );
            const bridgeAmount: bigint = sendingQuntity - serviceFee;

            const dstReceiver = await unaBridge.getDstReceiver(chainSelector);
            const ccipFee: bigint = await unaBridge.getCcipFee(
                chainSelector,
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
                dstChain: chainSelector,
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
                totalAmount: sendingQuntity,
                bridgedAmount: bridgeAmount,
                srcToken: unaWEMIX.target,
                metaHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                contractAddress: ethers.ZeroAddress,
                inputs: "0x",
            };

            const swapAndBridgeTx = await mudskipper
                .connect(txRelayer)
                .bridgeViaUnaBridge(exitERC20Calldata, { value: ccipFee * 2n });
            await expect(swapAndBridgeTx).to.be.emit(unaBridge, "ExitERC20");

            logger.log(
                "Mudskipper unaWEMIX Balance : ",
                ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)),
            );
        }).timeout(1000000);

        it("****** unaWEMIX Bridge to Avalanche with UnaBridge ******", async () => {
            logger.log("****** unaWEMIX Bridge to Avalanche with UnaBridge ******");

            const sendingQuntity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: unaWEMIX.target,
                quantity: sendingQuntity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig);
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log(
                "Mudskipper unaWEMIX Balance : ",
                ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)),
            );

            const chainSelector = ChainSelector.Avalanche;
            const serviceFee: bigint = await unaBridgeStorage.getServiceFee(
                unaWEMIX.target,
                sendingQuntity,
                chainSelector,
            );
            const bridgeAmount: bigint = sendingQuntity - serviceFee;

            const dstReceiver = await unaBridge.getDstReceiver(chainSelector);
            const ccipFee: bigint = await unaBridge.getCcipFee(
                chainSelector,
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
                dstChain: chainSelector,
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
                totalAmount: sendingQuntity,
                bridgedAmount: bridgeAmount,
                srcToken: unaWEMIX.target,
                metaHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                contractAddress: ethers.ZeroAddress,
                inputs: "0x",
            };

            const swapAndBridgeTx = await mudskipper
                .connect(txRelayer)
                .bridgeViaUnaBridge(exitERC20Calldata, { value: ccipFee * 2n });
            await expect(swapAndBridgeTx).to.be.emit(unaBridge, "ExitERC20");

            logger.log(
                "Mudskipper unaWEMIX Balance : ",
                ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)),
            );
        }).timeout(1000000);

        it("****** unaWEMIX Bridge to BNB with UnaBridge ******", async () => {
            logger.log("****** unaWEMIX Bridge to BNB with UnaBridge ******");

            const sendingQuntity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: unaWEMIX.target,
                quantity: sendingQuntity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig);
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log(
                "Mudskipper unaWEMIX Balance : ",
                ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)),
            );

            const chainSelector = ChainSelector.BNB;
            const serviceFee: bigint = await unaBridgeStorage.getServiceFee(
                unaWEMIX.target,
                sendingQuntity,
                chainSelector,
            );
            const bridgeAmount: bigint = sendingQuntity - serviceFee;

            const dstReceiver = await unaBridge.getDstReceiver(chainSelector);
            const ccipFee: bigint = await unaBridge.getCcipFee(
                chainSelector,
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
                dstChain: chainSelector,
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
                totalAmount: sendingQuntity,
                bridgedAmount: bridgeAmount,
                srcToken: unaWEMIX.target,
                metaHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                contractAddress: ethers.ZeroAddress,
                inputs: "0x",
            };

            const swapAndBridgeTx = await mudskipper
                .connect(txRelayer)
                .bridgeViaUnaBridge(exitERC20Calldata, { value: ccipFee * 2n });
            await expect(swapAndBridgeTx).to.be.emit(unaBridge, "ExitERC20");

            logger.log(
                "Mudskipper unaWEMIX Balance : ",
                ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)),
            );
        }).timeout(1000000);

        it("****** unaWEMIX Bridge to Arbitrum with UnaBridge ******", async () => {
            logger.log("****** unaWEMIX Bridge to Arbitrum with UnaBridge ******");

            const sendingQuntity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: unaWEMIX.target,
                quantity: sendingQuntity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig);
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log(
                "Mudskipper unaWEMIX Balance : ",
                ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)),
            );

            const chainSelector = ChainSelector.Arbitrum;
            const serviceFee: bigint = await unaBridgeStorage.getServiceFee(
                unaWEMIX.target,
                sendingQuntity,
                chainSelector,
            );
            const bridgeAmount: bigint = sendingQuntity - serviceFee;

            const dstReceiver = await unaBridge.getDstReceiver(chainSelector);
            const ccipFee: bigint = await unaBridge.getCcipFee(
                chainSelector,
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
                dstChain: chainSelector,
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
                totalAmount: sendingQuntity,
                bridgedAmount: bridgeAmount,
                srcToken: unaWEMIX.target,
                metaHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                contractAddress: ethers.ZeroAddress,
                inputs: "0x",
            };

            const swapAndBridgeTx = await mudskipper
                .connect(txRelayer)
                .bridgeViaUnaBridge(exitERC20Calldata, { value: ccipFee * 2n });
            await expect(swapAndBridgeTx).to.be.emit(unaBridge, "ExitERC20");

            logger.log(
                "Mudskipper unaWEMIX Balance : ",
                ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)),
            );
        }).timeout(1000000);

        it("****** unaWEMIX Bridge to Optimism with UnaBridge ******", async () => {
            logger.log("****** unaWEMIX Bridge to Optimism with UnaBridge ******");

            const sendingQuntity = ethers.parseEther("1");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: unaWEMIX.target,
                quantity: sendingQuntity,
                fee: 0n,
                funding: 0n,
                deadline : CONSTANT.ONE_HOUR_LATER
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const requestTransferTx = await mudskipper
                .connect(user1)
                .requestTransfer(requestTicket, requestTransferSig);
            await requestTransferTx.wait();
            logger.log("Success : requestTransfer");
            logger.log(
                "Mudskipper unaWEMIX Balance : ",
                ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)),
            );

            const chainSelector = ChainSelector.Optimism;
            const serviceFee: bigint = await unaBridgeStorage.getServiceFee(
                unaWEMIX.target,
                sendingQuntity,
                chainSelector,
            );
            const bridgeAmount: bigint = sendingQuntity - serviceFee;

            const dstReceiver = await unaBridge.getDstReceiver(chainSelector);
            const ccipFee: bigint = await unaBridge.getCcipFee(
                chainSelector,
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
                dstChain: chainSelector,
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
                totalAmount: sendingQuntity,
                bridgedAmount: bridgeAmount,
                srcToken: unaWEMIX.target,
                metaHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                contractAddress: ethers.ZeroAddress,
                inputs: "0x",
            };

            const swapAndBridgeTx = await mudskipper
                .connect(txRelayer)
                .bridgeViaUnaBridge(exitERC20Calldata, { value: ccipFee * 2n });
            await expect(swapAndBridgeTx).to.be.emit(unaBridge, "ExitERC20");

            logger.log(
                "Mudskipper unaWEMIX Balance : ",
                ethers.formatEther(await unaWEMIX.balanceOf(mudskipper.target)),
            );
        }).timeout(1000000);
    });
});
