import { ethers, network } from "hardhat";
import { expect } from "chai";
import { deployProxy, deployContract, signRequestTransfer, deployProxyByFactory, CONSTANT } from "../utils/util";
import {
    Buffer,
    MockToken,
    MockUnaBridge,
    Mudskipper,
    Vault,
    MockOracle,
    MockSwap,
    Factory,
} from "../../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { RequestTicket, Deposit, SwapRequest, ExitERC20, Tx } from "../utils/type";

describe("Mudskipper", function () {
    let snapshotId: number;
    let initialSnapshotId: number;

    let operator: HardhatEthersSigner;
    let ticketPublisher: HardhatEthersSigner;
    let mudskipperManager: HardhatEthersSigner;
    let txRelayer: HardhatEthersSigner;
    let user1: HardhatEthersSigner;
    let user2: HardhatEthersSigner;

    let factory: Factory;
    let mudSkipper: Mudskipper;
    let vault: Vault;
    let buffer: Buffer;
    let mockOracle: MockOracle;
    let mockSwap: MockSwap;
    let mockUnaBridge: MockUnaBridge;
    let tokenA: MockToken;
    let tokenB: MockToken;
    let tokenC: MockToken;

    before(async () => {
        [operator, ticketPublisher, mudskipperManager, txRelayer, user1, user2] = await ethers.getSigners();

        factory = await deployProxy("Factory", ["initialize", []], operator);

        mudSkipper = await deployProxyByFactory(
            factory,
            "Mudskipper",
            ["initialize", [operator.address]],
            undefined,
            operator,
        );
        await mudSkipper.grantRole(ethers.id("TICKET_PUBLISHER"), ticketPublisher.address);
        await mudSkipper.grantRole(ethers.id("MUDSKIPPER_MANAGER"), mudskipperManager.address);
        await mudSkipper.grantRole(ethers.id("TX_RELAYER"), txRelayer.address);

        vault = await deployProxyByFactory(factory, "Vault", ["initialize", [operator.address]], undefined, operator);
        await mudSkipper.connect(mudskipperManager).writeRegistry(ethers.id("MUDSKIPPER_VAULT"), vault.target);

        buffer = await deployProxyByFactory(factory, "Buffer", ["initialize", [operator.address]], undefined, operator);
        await mudSkipper.connect(mudskipperManager).writeRegistry(ethers.id("MUDSKIPPER_BUFFER"), buffer.target);

        mockOracle = await deployProxy("MockOracle", ["initialize", []], operator);
        mockSwap = await deployProxy("MockSwap", ["initialize", [mockOracle.target]], operator);
        mockUnaBridge = await deployProxy("MockUnaBridge", ["initialize", []], operator);
        await mudSkipper.connect(mudskipperManager).writeRegistry(ethers.id("BRIDGE_UNABRIDGE"), mockUnaBridge.target);

        tokenA = await deployContract("MockToken", ["TokenA", "A"], operator);
        tokenB = await deployContract("MockToken", ["TokenB", "B"], operator);
        tokenC = await deployContract("MockToken", ["TokenC", "C"], operator);

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
    });

    describe("writeRegistry", () => {
        it("Failed : AccessControlUnauthorizedAccount", async () => {
            const tx = mudSkipper.connect(user1).writeRegistry(ethers.id("TEST"), user1.address);
            await expect(tx).to.be.revertedWithCustomError(mudSkipper, "AccessControlUnauthorizedAccount");
        });

        it("Success", async () => {
            const tx = await mudSkipper.connect(mudskipperManager).writeRegistry(ethers.id("TEST_1"), user1.address);
            const tx2 = await mudSkipper.connect(mudskipperManager).writeRegistry(ethers.id("TEST_2"), user2.address);
            await tx.wait();
            await tx2.wait();

            const address1 = await mudSkipper.addressRegistry(ethers.id("TEST_1"));
            expect(address1).to.equal(user1.address);
            const address2 = await mudSkipper.addressRegistry(ethers.id("TEST_2"));
            expect(address2).to.equal(user2.address);
        });
    });

    describe("circuitBreaker", () => {
        it("Failed : AccessControlUnauthorizedAccount", async () => {
            const tx = mudSkipper.connect(user1).circuitBreaker(true);
            await expect(tx).to.be.revertedWithCustomError(mudSkipper, "AccessControlUnauthorizedAccount");
        });

        it("Success", async () => {
            const tx = await mudSkipper.connect(txRelayer).circuitBreaker(true);
            await tx.wait();

            const denyRequest = await mudSkipper.denyRequest();
            expect(denyRequest).to.equal(true);
        });
    });

    describe("requestTransfer", () => {
        it("Failed : Service unavailable", async () => {
            const circuitBreakerTx = await mudSkipper.connect(txRelayer).circuitBreaker(true);
            await circuitBreakerTx.wait();

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: ethers.parseEther("1"),
                fee: 1n,
                funding: 1n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const transferRequestSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const tx = mudSkipper.connect(user1).requestTransfer(requestTicket, transferRequestSig);
            await expect(tx).to.be.revertedWith("Service unavailable");
        });

        it("Failed : Invalid signature", async () => {
            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: ethers.parseEther("1"),
                fee: 1n,
                funding: 1n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const transferRequestSig = await signRequestTransfer(requestTicket, user1);
            const tx = mudSkipper.connect(user1).requestTransfer(requestTicket, transferRequestSig);
            await expect(tx).to.be.revertedWith("Invalid signature");
        });

        it("Failed : Invalid ticket", async () => {
            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: ethers.parseEther("1"),
                fee: 1n,
                funding: 1n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const transferRequestSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const tx = mudSkipper.connect(user2).requestTransfer(requestTicket, transferRequestSig);
            await expect(tx).to.be.revertedWith("Invalid ticket");
        });

        it("Failed : Insufficient value", async () => {
            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: ethers.parseEther("1"),
                fee: 1n,
                funding: 1n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const transferRequestSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const tx = mudSkipper.connect(user1).requestTransfer(requestTicket, transferRequestSig);
            await expect(tx).to.be.revertedWith("Insufficient value");
        });

        it("Failed : Failed to transfer asset : Invalid asset", async () => {
            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: user2.address,
                quantity: ethers.parseEther("1"),
                fee: 1n,
                funding: 1n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const transferRequestSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const tx = mudSkipper.connect(user1).requestTransfer(requestTicket, transferRequestSig);
            await expect(tx).to.be.revertedWithoutReason();
        });

        it("Failed : Failed to transfer asset : ERC20InsufficientAllowance", async () => {
            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: tokenA.target,
                quantity: ethers.parseEther("1"),
                fee: 1n,
                funding: 1n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const transferRequestSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const tx = mudSkipper.connect(user1).requestTransfer(requestTicket, transferRequestSig);
            await expect(tx).to.be.revertedWithCustomError(tokenA, "ERC20InsufficientAllowance");
        });

        it("Failed : Failed to transfer asset : ERC20InsufficientBalance", async () => {
            await tokenA.connect(user1).approve(mudSkipper.target, ethers.MaxUint256);

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: tokenA.target,
                quantity: ethers.parseEther("1"),
                fee: 1n,
                funding: 1n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const transferRequestSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const tx = mudSkipper.connect(user1).requestTransfer(requestTicket, transferRequestSig);
            await expect(tx).to.be.revertedWithCustomError(tokenA, "ERC20InsufficientBalance");
        });

        it("Failed : Incorrect fee : Native asset", async () => {
            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: ethers.parseEther("1"),
                fee: 1n,
                funding: 1n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const transferRequestSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const txWithoutFunding = mudSkipper.connect(user1).requestTransfer(requestTicket, transferRequestSig, {
                value: requestTicket.quantity + requestTicket.fee,
            });
            await expect(txWithoutFunding).to.be.revertedWith("Incorrect fee");
            const txWithoutFee = mudSkipper.connect(user1).requestTransfer(requestTicket, transferRequestSig, {
                value: requestTicket.quantity + requestTicket.funding,
            });
            await expect(txWithoutFee).to.be.revertedWith("Incorrect fee");
        });

        it("Failed : Incorrect fee : ERC20 asset", async () => {
            await tokenA.connect(user1).approve(mudSkipper.target, ethers.MaxUint256);
            await tokenA.mint(user1.address, ethers.parseEther("100"));

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: tokenA.target,
                quantity: ethers.parseEther("1"),
                fee: 1n,
                funding: 1n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };

            const transferRequestSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const txWithoutFunding = mudSkipper
                .connect(user1)
                .requestTransfer(requestTicket, transferRequestSig, { value: requestTicket.fee });
            await expect(txWithoutFunding).to.be.revertedWith("Incorrect fee");
            const txWithoutFee = mudSkipper
                .connect(user1)
                .requestTransfer(requestTicket, transferRequestSig, { value: requestTicket.funding });
            await expect(txWithoutFee).to.be.revertedWith("Incorrect fee");
        });

        it("Failed : Outdated ticket", async () => {
            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: ethers.parseEther("1"),
                fee: 1n,
                funding: 1n,
                deadline: CONSTANT.ONE_HOUR_LATER - 3660n, // 1 minute ago
            };
            const transferRequestSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const tx = mudSkipper.connect(user1).requestTransfer(requestTicket, transferRequestSig, {
                value: requestTicket.quantity + requestTicket.fee + requestTicket.funding,
            });
            await expect(tx).to.be.revertedWith("Outdated ticket");
        });

        it("Success : Native asset", async () => {
            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: ethers.parseEther("1"),
                fee: 1n,
                funding: 1n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const transferRequestSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const tx = mudSkipper.connect(user1).requestTransfer(requestTicket, transferRequestSig, {
                value: requestTicket.quantity + requestTicket.fee + requestTicket.funding,
            });
            await expect(tx).to.emit(mudSkipper, "TransferRequested").withArgs(Object.values(requestTicket));
            expect(await ethers.provider.getBalance(mudSkipper.target)).to.be.equal(requestTicket.quantity);
            expect(await ethers.provider.getBalance(vault.target)).to.be.equal(requestTicket.fee);
            expect(await ethers.provider.getBalance(buffer.target)).to.be.equal(requestTicket.funding);
        });

        it("Success : ERC20", async () => {
            await tokenA.connect(user1).approve(mudSkipper.target, ethers.MaxUint256);
            await tokenA.mint(user1.address, ethers.parseEther("100"));

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: tokenA.target,
                quantity: ethers.parseEther("1"),
                fee: 1n,
                funding: 1n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const transferRequestSig = await signRequestTransfer(requestTicket, ticketPublisher);
            const tx = mudSkipper.connect(user1).requestTransfer(requestTicket, transferRequestSig, {
                value: requestTicket.fee + requestTicket.funding,
            });
            await expect(tx).to.emit(mudSkipper, "TransferRequested").withArgs(Object.values(requestTicket));
            expect(await tokenA.balanceOf(mudSkipper.target)).to.be.equal(requestTicket.quantity);
            expect(await ethers.provider.getBalance(vault.target)).to.be.equal(requestTicket.fee);
            expect(await ethers.provider.getBalance(buffer.target)).to.be.equal(requestTicket.funding);
        });
    });

    describe("callArbitary", () => {
        const decimalUnit = 10n ** 18n;
        const tokenAPrice = 10n * decimalUnit;
        const tokenBPrice = 5n * decimalUnit;
        const tokenCPrice = 20n * decimalUnit;

        before(async () => {
            await mockOracle.setPrices(
                [
                    ethers.keccak256(tokenA.target.toString()),
                    ethers.keccak256(tokenB.target.toString()),
                    ethers.keccak256(tokenC.target.toString()),
                ],
                [tokenAPrice, tokenBPrice, tokenCPrice],
            );
        });

        it("Failed : AccessControlUnauthorizedAccount", async () => {
            const txs: Tx[] = [{ to: user2.address, value: 0n, data: "0x" }];
            const tx = mudSkipper.connect(user1).callArbitrary(txs);
            await expect(tx).to.be.revertedWithCustomError(mudSkipper, "AccessControlUnauthorizedAccount");
        });

        it("Failed : Call failed", async () => {
            const txs: Tx[] = [{ to: user2.address, value: ethers.parseEther("1"), data: "0x" }];
            const tx = mudSkipper.connect(txRelayer).callArbitrary(txs);
            await expect(tx).to.be.revertedWithCustomError(mudSkipper, "LowlevelError");
        });

        it("Success : oracleBasedSwap", async () => {
            const tokenAInitialQuantity = ethers.parseEther("1100");
            const tokenASendingQuantity = ethers.parseEther("1000");
            const tokenBSendingQuantity = (tokenASendingQuantity * tokenAPrice) / tokenBPrice;
            const tokenCReceiveQuantity = (tokenBSendingQuantity * tokenBPrice) / tokenCPrice;

            await tokenA.mint(user1.address, tokenAInitialQuantity);
            await tokenA.connect(user1).approve(mudSkipper.target, ethers.MaxUint256);

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: tokenA.target,
                quantity: tokenASendingQuantity,
                fee: 0n,
                funding: 0n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            await mudSkipper.connect(user1).requestTransfer(requestTicket, requestTransferSig);

            const txs: Tx[] = [
                {
                    to: tokenA.target,
                    value: 0n,
                    data: tokenA.interface.encodeFunctionData("approve", [mockSwap.target, ethers.MaxUint256]),
                },
                {
                    to: mockSwap.target,
                    value: 0n,
                    data: mockSwap.interface.encodeFunctionData("oracleBasedSwap", [
                        tokenA.target,
                        tokenB.target,
                        tokenASendingQuantity,
                        mudSkipper.target,
                    ]),
                },
                {
                    to: tokenB.target,
                    value: 0n,
                    data: tokenB.interface.encodeFunctionData("approve", [mockSwap.target, ethers.MaxUint256]),
                },
                {
                    to: mockSwap.target,
                    value: 0n,
                    data: mockSwap.interface.encodeFunctionData("oracleBasedSwap", [
                        tokenB.target,
                        tokenC.target,
                        tokenBSendingQuantity,
                        user1.address,
                    ]),
                },
            ];

            await mudSkipper.connect(txRelayer).callArbitrary(txs);
            expect(await tokenA.balanceOf(user1.address)).to.equal(tokenAInitialQuantity - tokenASendingQuantity);
            expect(await tokenC.balanceOf(user1.address)).to.equal(tokenCReceiveQuantity);
        });
    });

    describe("swap", () => {
        const decimalUnit = 10n ** 18n;
        const nativePrice = 10n * decimalUnit;
        const tokenAPrice = 10n * decimalUnit;
        const tokenBPrice = 5n * decimalUnit;
        const tokenCPrice = 20n * decimalUnit;

        before(async () => {
            await mockOracle.setPrices(
                [
                    ethers.keccak256(ethers.ZeroAddress),
                    ethers.keccak256(tokenA.target.toString()),
                    ethers.keccak256(tokenB.target.toString()),
                    ethers.keccak256(tokenC.target.toString()),
                ],
                [nativePrice, tokenAPrice, tokenBPrice, tokenCPrice],
            );
        });

        it("Failed : AccessControlUnauthorizedAccount", async () => {
            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: mockSwap.target,
                        approveTo: mockSwap.target,
                        fromAsset: tokenA.target,
                        fromQuantity: ethers.parseEther("1"),
                        toAsset: tokenB.target,
                        callData: mockSwap.interface.encodeFunctionData("oracleBasedSwap", [
                            tokenA.target,
                            tokenB.target,
                            ethers.parseEther("1"),
                            mudSkipper.target,
                        ]),
                        requiresDeposit: false,
                    },
                ],
                recipient: mudSkipper.target,
                minOutput: 0n,
            };
            const tx = mudSkipper.connect(user1).swap(swapRequest);
            await expect(tx).to.be.revertedWithCustomError(mudSkipper, "AccessControlUnauthorizedAccount");
        });

        it("Failed : Swap length is zero", async () => {
            const swapRequest: SwapRequest = {
                swapData: [],
                recipient: mudSkipper.target,
                minOutput: 0n,
            };

            const tx = mudSkipper.connect(txRelayer).swap(swapRequest);
            await expect(tx).to.be.revertedWith("Swap length is zero");
        });

        it("Failed : Swap failed", async () => {
            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: mockSwap.target,
                        approveTo: mockSwap.target,
                        fromAsset: tokenA.target,
                        fromQuantity: ethers.parseEther("1"),
                        toAsset: tokenB.target,
                        callData: mockSwap.interface.encodeFunctionData("oracleBasedSwap", [
                            tokenA.target,
                            tokenB.target,
                            ethers.parseEther("1"),
                            user1.address,
                        ]),
                        requiresDeposit: false,
                    },
                ],
                recipient: mudSkipper.target,
                minOutput: 0n,
            };

            const tx = mudSkipper.connect(txRelayer).swap(swapRequest);
            await expect(tx).to.be.revertedWithCustomError(mudSkipper, "SwapFailed");
        });

        it("Failed : Insufficient output", async () => {
            const tokenAInitialQuantity = ethers.parseEther("1100");
            const tokenASendingQuantity = ethers.parseEther("1000");
            const tokenBReceiveQuantity = (tokenASendingQuantity * tokenAPrice) / tokenBPrice;

            await tokenA.mint(user1.address, tokenAInitialQuantity);
            await tokenA.connect(user1).approve(mudSkipper.target, ethers.MaxUint256);

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: tokenA.target,
                quantity: tokenASendingQuantity,
                fee: 0n,
                funding: 0n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            await mudSkipper.connect(user1).requestTransfer(requestTicket, requestTransferSig);

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: mockSwap.target,
                        approveTo: mockSwap.target,
                        fromAsset: tokenA.target,
                        fromQuantity: tokenASendingQuantity,
                        toAsset: tokenB.target,
                        callData: mockSwap.interface.encodeFunctionData("oracleBasedSwap", [
                            tokenA.target,
                            tokenB.target,
                            tokenASendingQuantity,
                            mudSkipper.target,
                        ]),
                        requiresDeposit: false,
                    },
                ],
                recipient: mudSkipper.target,
                minOutput: tokenBReceiveQuantity + ethers.parseEther("1"),
            };

            const tx = mudSkipper.connect(txRelayer).swap(swapRequest);
            await expect(tx).to.be.revertedWith("Insufficient output");
        });

        it("Success : ERC20", async () => {
            const tokenAInitialQuantity = ethers.parseEther("1100");
            const tokenASendingQuantity = ethers.parseEther("1000");
            const tokenBSendingQuantity = (tokenASendingQuantity * tokenAPrice) / tokenBPrice;
            const tokenCReceiveQuantity = (tokenBSendingQuantity * tokenBPrice) / tokenCPrice;

            await tokenA.mint(user1.address, tokenAInitialQuantity);
            await tokenA.connect(user1).approve(mudSkipper.target, ethers.MaxUint256);

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: tokenA.target,
                quantity: tokenASendingQuantity,
                fee: 0n,
                funding: 0n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            await mudSkipper.connect(user1).requestTransfer(requestTicket, requestTransferSig);

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: mockSwap.target,
                        approveTo: mockSwap.target,
                        fromAsset: tokenA.target,
                        fromQuantity: tokenASendingQuantity,
                        toAsset: tokenB.target,
                        callData: mockSwap.interface.encodeFunctionData("oracleBasedSwap", [
                            tokenA.target,
                            tokenB.target,
                            tokenASendingQuantity,
                            mudSkipper.target,
                        ]),
                        requiresDeposit: false,
                    },
                    {
                        callTo: mockSwap.target,
                        approveTo: mockSwap.target,
                        fromAsset: tokenB.target,
                        fromQuantity: tokenBSendingQuantity,
                        toAsset: tokenC.target,
                        callData: mockSwap.interface.encodeFunctionData("oracleBasedSwap", [
                            tokenB.target,
                            tokenC.target,
                            tokenBSendingQuantity,
                            user1.address,
                        ]),
                        requiresDeposit: false,
                    },
                ],
                recipient: user1.address,
                minOutput: 0n,
            };

            const tx = await mudSkipper.connect(txRelayer).swap(swapRequest);
            await expect(tx)
                .to.be.emit(mudSkipper, "SwapExecuted")
                .withArgs(user1.address, tokenC.target, tokenCReceiveQuantity);
            expect(await tokenA.balanceOf(user1.address)).to.equal(tokenAInitialQuantity - tokenASendingQuantity);
            expect(await tokenC.balanceOf(user1.address)).to.equal(tokenCReceiveQuantity);
        });

        it("Success : Native asset", async () => {
            const nativeSendingQuantity = ethers.parseEther("1000");
            const tokenAReceiveQuantity = (nativeSendingQuantity * nativePrice) / tokenAPrice;

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: nativeSendingQuantity,
                fee: 1n,
                funding: 0n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };

            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            await mudSkipper.connect(user1).requestTransfer(requestTicket, requestTransferSig, {
                value: requestTicket.quantity + requestTicket.fee,
            });

            const nativeInitialQuantity = await ethers.provider.getBalance(mudSkipper.target);

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: mockSwap.target,
                        approveTo: mockSwap.target,
                        fromAsset: ethers.ZeroAddress,
                        fromQuantity: nativeSendingQuantity,
                        toAsset: tokenA.target,
                        callData: mockSwap.interface.encodeFunctionData("oracleBasedSwap", [
                            ethers.ZeroAddress,
                            tokenA.target,
                            nativeSendingQuantity,
                            user2.address,
                        ]),
                        requiresDeposit: false,
                    },
                ],
                recipient: user2.address,
                minOutput: 0n,
            };

            const tx = await mudSkipper.connect(txRelayer).swap(swapRequest);
            await expect(tx)
                .to.be.emit(mudSkipper, "SwapExecuted")
                .withArgs(user2.address, tokenA.target, tokenAReceiveQuantity);
            expect(await ethers.provider.getBalance(mudSkipper.target)).to.equal(
                nativeInitialQuantity - nativeSendingQuantity,
            );
            expect(await tokenA.balanceOf(user2.address)).to.equal(tokenAReceiveQuantity);
        });
    });

    describe("bridgeViaUnaBridge", () => {
        it("Failed : AccessControlUnauthorizedAccount", async () => {
            const exitERC20Calldata: ExitERC20 = {
                from: mudSkipper.target,
                dstChain: 1n,
                to: user1.address,
                gasLimit: 0n,
                ccipFeeTokenAmountForCurrChain: {
                    token: ethers.ZeroAddress,
                    amount: 0n,
                },
                ccipFeeTokenAmountForNextChain: {
                    token: ethers.ZeroAddress,
                    amount: 0n,
                },
                totalAmount: ethers.parseEther("1"),
                bridgedAmount: ethers.parseEther("1"),
                srcToken: tokenA.target,
                metaHash: ethers.id("Hash"),
                contractAddress: ethers.ZeroAddress,
                inputs: "0x",
            };
            const tx = mudSkipper.connect(user1).bridgeViaUnaBridge(exitERC20Calldata);
            await expect(tx).to.be.revertedWithCustomError(mudSkipper, "AccessControlUnauthorizedAccount");
        });

        it("Success", async () => {
            const bridgeQuantity = ethers.parseEther("1000");

            await tokenA.mint(user1.address, bridgeQuantity);
            await tokenA.connect(user1).approve(mudSkipper.target, ethers.MaxUint256);

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: tokenA.target,
                quantity: bridgeQuantity,
                fee: 0n,
                funding: 0n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            await mudSkipper.connect(user1).requestTransfer(requestTicket, requestTransferSig);

            const exitERC20Calldata: ExitERC20 = {
                from: mudSkipper.target,
                dstChain: 1n,
                to: user1.address,
                gasLimit: 0n,
                ccipFeeTokenAmountForCurrChain: {
                    token: ethers.ZeroAddress,
                    amount: 0n,
                },
                ccipFeeTokenAmountForNextChain: {
                    token: ethers.ZeroAddress,
                    amount: 0n,
                },
                totalAmount: bridgeQuantity,
                bridgedAmount: bridgeQuantity,
                srcToken: tokenA.target,
                metaHash: ethers.id("Hash"),
                contractAddress: ethers.ZeroAddress,
                inputs: "0x",
            };
            const tx = await mudSkipper.connect(txRelayer).bridgeViaUnaBridge(exitERC20Calldata);
            await expect(tx).to.emit(mockUnaBridge, "ExitERC20");
            expect(await tokenA.balanceOf(mockUnaBridge.target)).to.be.equal(bridgeQuantity);
        });
    });

    describe("swapAndUnaBridge", () => {
        const decimalUnit = 10n ** 18n;
        const tokenAPrice = 10n * decimalUnit;
        const tokenBPrice = 5n * decimalUnit;
        before(async () => {
            await mockOracle.setPrices(
                [ethers.id(tokenA.target.toString()), ethers.id(tokenB.target.toString())],
                [tokenAPrice, tokenBPrice],
            );
        });

        it("Failed : AccessControlUnauthorizedAccount", async () => {
            const tokenASendingQuantity = ethers.parseEther("1000");
            const tokenBReceiveQuantity = (tokenASendingQuantity * tokenAPrice) / tokenBPrice;

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: mockSwap.target,
                        approveTo: mockSwap.target,
                        fromAsset: tokenA.target,
                        fromQuantity: tokenASendingQuantity,
                        toAsset: tokenB.target,
                        callData: mockSwap.interface.encodeFunctionData("oracleBasedSwap", [
                            tokenA.target,
                            tokenB.target,
                            tokenASendingQuantity,
                            mudSkipper.target,
                        ]),
                        requiresDeposit: false,
                    },
                ],
                recipient: mudSkipper.target,
                minOutput: 0n,
            };

            const exitERC20Calldata: ExitERC20 = {
                from: mudSkipper.target,
                dstChain: 1n,
                to: user1.address,
                gasLimit: 0n,
                ccipFeeTokenAmountForCurrChain: {
                    token: ethers.ZeroAddress,
                    amount: 0n,
                },
                ccipFeeTokenAmountForNextChain: {
                    token: ethers.ZeroAddress,
                    amount: 0n,
                },
                totalAmount: tokenBReceiveQuantity,
                bridgedAmount: tokenBReceiveQuantity,
                srcToken: tokenB.target,
                metaHash: ethers.id("Hash"),
                contractAddress: ethers.ZeroAddress,
                inputs: "0x",
            };

            const tx = mudSkipper.connect(user1).swapAndUnaBridge(swapRequest, exitERC20Calldata);
            await expect(tx).to.be.revertedWithCustomError(mudSkipper, "AccessControlUnauthorizedAccount");
        });

        it("Failed : Swap length is zero", async () => {
            const tokenBReceiveQuantity = ethers.parseEther("2000");

            const swapRequest: SwapRequest = {
                swapData: [],
                recipient: mudSkipper.target,
                minOutput: 0n,
            };

            const exitERC20Calldata: ExitERC20 = {
                from: mudSkipper.target,
                dstChain: 1n,
                to: user1.address,
                gasLimit: 0n,
                ccipFeeTokenAmountForCurrChain: {
                    token: ethers.ZeroAddress,
                    amount: 0n,
                },
                ccipFeeTokenAmountForNextChain: {
                    token: ethers.ZeroAddress,
                    amount: 0n,
                },
                totalAmount: tokenBReceiveQuantity,
                bridgedAmount: tokenBReceiveQuantity,
                srcToken: tokenB.target,
                metaHash: ethers.id("Hash"),
                contractAddress: ethers.ZeroAddress,
                inputs: "0x",
            };

            const tx = mudSkipper.connect(txRelayer).swapAndUnaBridge(swapRequest, exitERC20Calldata);
            await expect(tx).to.be.revertedWith("Swap length is zero");
        });

        it("Failed : Swap failed", async () => {
            const tokenASendingQuantity = ethers.parseEther("1000");
            const tokenBReceiveQuantity = (tokenASendingQuantity * tokenAPrice) / tokenBPrice;

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: mockSwap.target,
                        approveTo: mockSwap.target,
                        fromAsset: tokenA.target,
                        fromQuantity: tokenASendingQuantity,
                        toAsset: tokenB.target,
                        callData: mockSwap.interface.encodeFunctionData("oracleBasedSwap", [
                            tokenA.target,
                            tokenB.target,
                            tokenASendingQuantity,
                            mudSkipper.target,
                        ]),
                        requiresDeposit: false,
                    },
                ],
                recipient: mudSkipper.target,
                minOutput: 0n,
            };

            const exitERC20Calldata: ExitERC20 = {
                from: mudSkipper.target,
                dstChain: 1n,
                to: user1.address,
                gasLimit: 0n,
                ccipFeeTokenAmountForCurrChain: {
                    token: ethers.ZeroAddress,
                    amount: 0n,
                },
                ccipFeeTokenAmountForNextChain: {
                    token: ethers.ZeroAddress,
                    amount: 0n,
                },
                totalAmount: tokenBReceiveQuantity,
                bridgedAmount: tokenBReceiveQuantity,
                srcToken: tokenB.target,
                metaHash: ethers.id("Hash"),
                contractAddress: ethers.ZeroAddress,
                inputs: "0x",
            };

            const tx = mudSkipper.connect(txRelayer).swapAndUnaBridge(swapRequest, exitERC20Calldata);
            await expect(tx).to.be.revertedWithCustomError(mudSkipper, "SwapFailed");
        });

        it("Failed : Insufficient output", async () => {
            const tokenASendingQuantity = ethers.parseEther("1000");
            const tokenBReceiveQuantity = (tokenASendingQuantity * tokenAPrice) / tokenBPrice;

            await tokenA.mint(user1.address, tokenASendingQuantity);
            await tokenA.connect(user1).approve(mudSkipper.target, ethers.MaxUint256);

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: tokenA.target,
                quantity: tokenASendingQuantity,
                fee: 0n,
                funding: 0n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            await mudSkipper.connect(user1).requestTransfer(requestTicket, requestTransferSig);

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: mockSwap.target,
                        approveTo: mockSwap.target,
                        fromAsset: tokenA.target,
                        fromQuantity: tokenASendingQuantity,
                        toAsset: tokenB.target,
                        callData: mockSwap.interface.encodeFunctionData("oracleBasedSwap", [
                            tokenA.target,
                            tokenB.target,
                            tokenASendingQuantity,
                            mudSkipper.target,
                        ]),
                        requiresDeposit: false,
                    },
                ],
                recipient: mudSkipper.target,
                minOutput: tokenBReceiveQuantity + ethers.parseEther("1"),
            };

            const exitERC20Calldata: ExitERC20 = {
                from: mudSkipper.target,
                dstChain: 1n,
                to: user1.address,
                gasLimit: 0n,
                ccipFeeTokenAmountForCurrChain: {
                    token: ethers.ZeroAddress,
                    amount: 0n,
                },
                ccipFeeTokenAmountForNextChain: {
                    token: ethers.ZeroAddress,
                    amount: 0n,
                },
                totalAmount: tokenBReceiveQuantity,
                bridgedAmount: tokenBReceiveQuantity,
                srcToken: tokenB.target,
                metaHash: ethers.id("Hash"),
                contractAddress: ethers.ZeroAddress,
                inputs: "0x",
            };

            const tx = mudSkipper.connect(txRelayer).swapAndUnaBridge(swapRequest, exitERC20Calldata);
            await expect(tx).to.be.revertedWith("Insufficient output");
        });

        it("Success", async () => {
            const tokenASendingQuantity = ethers.parseEther("1000");
            const tokenBReceiveQuantity = (tokenASendingQuantity * tokenAPrice) / tokenBPrice;

            await tokenA.mint(user1.address, tokenASendingQuantity);
            await tokenA.connect(user1).approve(mudSkipper.target, ethers.MaxUint256);

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: tokenA.target,
                quantity: tokenASendingQuantity,
                fee: 0n,
                funding: 0n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            await mudSkipper.connect(user1).requestTransfer(requestTicket, requestTransferSig);

            const swapRequest: SwapRequest = {
                swapData: [
                    {
                        callTo: mockSwap.target,
                        approveTo: mockSwap.target,
                        fromAsset: tokenA.target,
                        fromQuantity: tokenASendingQuantity,
                        toAsset: tokenB.target,
                        callData: mockSwap.interface.encodeFunctionData("oracleBasedSwap", [
                            tokenA.target,
                            tokenB.target,
                            tokenASendingQuantity,
                            mudSkipper.target,
                        ]),
                        requiresDeposit: false,
                    },
                ],
                recipient: mudSkipper.target,
                minOutput: 0n,
            };

            const exitERC20Calldata: ExitERC20 = {
                from: mudSkipper.target,
                dstChain: 1n,
                to: user1.address,
                gasLimit: 0n,
                ccipFeeTokenAmountForCurrChain: {
                    token: ethers.ZeroAddress,
                    amount: 0n,
                },
                ccipFeeTokenAmountForNextChain: {
                    token: ethers.ZeroAddress,
                    amount: 0n,
                },
                totalAmount: tokenBReceiveQuantity,
                bridgedAmount: tokenBReceiveQuantity,
                srcToken: tokenB.target,
                metaHash: ethers.id("Hash"),
                contractAddress: ethers.ZeroAddress,
                inputs: "0x",
            };

            const tx = await mudSkipper.connect(txRelayer).swapAndUnaBridge(swapRequest, exitERC20Calldata);
            expect(tx).to.emit(mockUnaBridge, "ExitERC20");
            expect(await tokenB.balanceOf(mockUnaBridge)).to.equal(tokenBReceiveQuantity);
        });
    });

    describe("rejectTransfer", () => {
        it("Failed : AccessControlUnauthorizedAccount", async () => {
            const deposit: Deposit = {
                requester: user1.address,
                asset: tokenA.target,
                quantity: ethers.parseEther("1"),
                collectedFee: 10n,
                revertFee: 10n,
            };

            const tx = mudSkipper.connect(user1).rejectTransfer(1n, deposit);
            await expect(tx).to.be.revertedWithCustomError(mudSkipper, "AccessControlUnauthorizedAccount");
        });

        it("Failed : Failed to transfer asset : ERC20InsufficientBalance", async () => {
            const tokenASendingQuantity = ethers.parseEther("1000");

            await tokenA.mint(user1.address, tokenASendingQuantity);
            await tokenA.connect(user1).approve(mudSkipper.target, ethers.MaxUint256);

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: tokenA.target,
                quantity: tokenASendingQuantity,
                fee: 0n,
                funding: 0n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            await mudSkipper.connect(user1).requestTransfer(requestTicket, requestTransferSig);

            const deposit: Deposit = {
                requester: user1.address,
                asset: tokenA.target,
                quantity: tokenASendingQuantity + ethers.parseEther("1"),
                collectedFee: 0n,
                revertFee: 0n,
            };
            const tx = mudSkipper.connect(txRelayer).rejectTransfer(1n, deposit);
            await expect(tx).to.be.revertedWithCustomError(tokenA, "ERC20InsufficientBalance");
        });

        it("Success : Native asset", async () => {
            const sendingQuantity = ethers.parseEther("1000");

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: ethers.ZeroAddress,
                quantity: sendingQuantity,
                fee: 1n,
                funding: 0n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            await mudSkipper.connect(user1).requestTransfer(requestTicket, requestTransferSig, {
                value: requestTicket.quantity + requestTicket.fee,
            });

            const beforeBalance = await ethers.provider.getBalance(user1.address);

            const deposit: Deposit = {
                requester: user1.address,
                asset: ethers.ZeroAddress,
                quantity: sendingQuantity,
                collectedFee: 0n,
                revertFee: 0n,
            };
            const tx = await mudSkipper.connect(txRelayer).rejectTransfer(1n, deposit);
            expect(tx)
                .to.be.emit(mudSkipper, "TransferRejected")
                .withArgs(1n, deposit.revertFee, Object.values(deposit));
            const afterBalance = await ethers.provider.getBalance(user1.address);
            expect(afterBalance).to.be.equal(beforeBalance + sendingQuantity);
        });

        it("Success : ERC20", async () => {
            const sendingQuantity = ethers.parseEther("1000");

            await tokenA.mint(user1.address, sendingQuantity);
            await tokenA.connect(user1).approve(mudSkipper.target, ethers.MaxUint256);

            const requestTicket: RequestTicket = {
                id: 1n,
                sender: user1.address,
                asset: tokenA.target,
                quantity: sendingQuantity,
                fee: 0n,
                funding: 0n,
                deadline: CONSTANT.ONE_HOUR_LATER,
            };
            const requestTransferSig = await signRequestTransfer(requestTicket, ticketPublisher);
            await mudSkipper.connect(user1).requestTransfer(requestTicket, requestTransferSig);

            const beforeBalance = await tokenA.balanceOf(user1.address);

            const deposit: Deposit = {
                requester: user1.address,
                asset: tokenA.target,
                quantity: sendingQuantity,
                collectedFee: 0n,
                revertFee: 0n,
            };
            const tx = await mudSkipper.connect(txRelayer).rejectTransfer(1n, deposit);
            expect(tx)
                .to.be.emit(mudSkipper, "TransferRejected")
                .withArgs(1n, deposit.revertFee, Object.values(deposit));
            const afterBalance = await tokenA.balanceOf(user1.address);
            expect(afterBalance).to.be.equal(beforeBalance + sendingQuantity);
        });
    });
});
