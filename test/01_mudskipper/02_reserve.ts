import { ethers, network } from "hardhat";
import { expect } from "chai";
import { deployProxy, deployProxyByFactory } from "../utils/util";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { mine } from "@nomicfoundation/hardhat-network-helpers";
import { Factory, Reserve } from "../../typechain-types";

describe("Reserve", function () {
    let snapshotId: number;
    let initialSnapshotId: number;

    let operator: HardhatEthersSigner;
    let user: HardhatEthersSigner;
    let poolManager: HardhatEthersSigner;
    let txRelayer: HardhatEthersSigner;

    let factory: Factory;
    let reserve: Reserve;

    before(async () => {
        [operator, user, poolManager, txRelayer] = await ethers.getSigners();

        factory = await deployProxy("Factory", ["initialize", []], operator);
        reserve = await deployProxyByFactory(
            factory,
            "Reserve",
            ["initialize", [operator.address]],
            undefined,
            operator,
        );

        const grantRoleTx = await reserve.connect(operator).grantRole(ethers.id("POOL_MANAGER"), poolManager.address);
        await grantRoleTx.wait();

        const grantRoleTx2 = await reserve.connect(operator).grantRole(ethers.id("TX_RELAYER"), txRelayer.address);
        await grantRoleTx2.wait();

        await mine(1000000);

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

    describe("setClaimableQuantity", () => {
        it("Failed : AccessControlUnauthorizedAccount", async () => {
            const tx = reserve.connect(user).setClaimableQuantity(100);
            await expect(tx).to.be.revertedWithCustomError(reserve, "AccessControlUnauthorizedAccount");
        });

        it("Success", async () => {
            const desiredQuantity = 100n;
            const tx = await reserve.connect(poolManager).setClaimableQuantity(desiredQuantity);
            await expect(tx).to.emit(reserve, "ClaimableQuantitySet").withArgs(poolManager.address, desiredQuantity);
            await expect(await reserve.claimableQuantity()).to.be.equal(desiredQuantity);
        });
    });

    describe("setClaimableInterval", () => {
        it("Failed : AccessControlUnauthorizedAccount", async () => {
            const tx = reserve.connect(user).setClaimableInterval(100);
            await expect(tx).to.be.revertedWithCustomError(reserve, "AccessControlUnauthorizedAccount");
        });

        it("Success", async () => {
            const desiredInterval = 100n;
            const tx = await reserve.connect(poolManager).setClaimableInterval(desiredInterval);
            await expect(tx).to.emit(reserve, "ClaimableIntervalSet").withArgs(poolManager.address, desiredInterval);
            await expect(await reserve.claimableInterval()).to.be.equal(desiredInterval);
        });
    });

    describe("claimReserve", () => {
        const claimableQuantity = ethers.parseEther("1");
        const claimableInterval = 100n;
        before(async () => {
            const setClaimableQuantityTx = await reserve.connect(poolManager).setClaimableQuantity(claimableQuantity);
            await setClaimableQuantityTx.wait();

            const setClaimableIntervalTx = await reserve.connect(poolManager).setClaimableInterval(claimableInterval);
            await setClaimableIntervalTx.wait();
        });

        it("Failed : AccessControlUnauthorizedAccount", async () => {
            const tx = reserve.connect(user).claimReserve(txRelayer.address, claimableQuantity);
            await expect(tx).to.be.revertedWithCustomError(reserve, "AccessControlUnauthorizedAccount");
        });

        it("Failed : Too much claim", async () => {
            const tx = reserve.connect(txRelayer).claimReserve(txRelayer.address, claimableQuantity + 1n);
            await expect(tx).to.be.revertedWith("Too much claim");
        });

        it("Failed : Too many claim", async () => {
            const value = claimableQuantity;
            const sendValueTx = await operator.sendTransaction({
                to: reserve.target,
                value,
            });
            await sendValueTx.wait();

            const claimReserveTx = await reserve.connect(txRelayer).claimReserve(txRelayer.address, value);
            await claimReserveTx.wait();

            const tx = reserve.connect(txRelayer).claimReserve(txRelayer.address, value);
            await expect(tx).to.be.revertedWith("Too many claim");
        });

        it("Failed : Failed to transfer", async () => {
            const tx = reserve.connect(txRelayer).claimReserve(txRelayer.address, claimableQuantity);
            await expect(tx).to.be.revertedWith("Failed to transfer");
        });

        it("Success", async () => {
            const sendValueTx = await operator.sendTransaction({
                to: reserve.target,
                value: claimableQuantity * 2n,
            });
            await sendValueTx.wait();

            const beforeUserBalance = await ethers.provider.getBalance(user.address);

            const tx = await reserve.connect(txRelayer).claimReserve(user.address, claimableQuantity);
            await expect(tx).to.emit(reserve, "ReserveClaimed").withArgs(user.address, claimableQuantity);

            const afterUserBalance = await ethers.provider.getBalance(user.address);
            const afterReserveBalance = await ethers.provider.getBalance(reserve.target);

            expect(afterUserBalance).to.equal(beforeUserBalance + claimableQuantity);
            expect(afterReserveBalance).to.equal(claimableQuantity);

            await mine(claimableInterval);

            const secondClaimTx = await reserve.connect(txRelayer).claimReserve(user.address, claimableQuantity);
            await expect(secondClaimTx).to.emit(reserve, "ReserveClaimed").withArgs(user.address, claimableQuantity);

            expect(await ethers.provider.getBalance(user.address)).to.equal(beforeUserBalance + claimableQuantity * 2n);
            expect(await ethers.provider.getBalance(reserve.target)).to.equal(0n);
        });
    });
});
