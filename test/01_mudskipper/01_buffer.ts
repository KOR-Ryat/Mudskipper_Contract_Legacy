import { ethers, network } from "hardhat";
import { expect } from "chai";
import { deployProxy, deployProxyByFactory } from "../02_utils/util";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Factory, Buffer, Reserve } from "../../typechain-types";

describe("Buffer", function () {
    let snapshotId: number;
    let initialSnapshotId: number;

    let operator: HardhatEthersSigner;
    let user: HardhatEthersSigner;
    let poolManager: HardhatEthersSigner;

    let factory: Factory;
    let buffer: Buffer;
    let reserve: Reserve;

    before(async () => {
        [operator, user, poolManager] = await ethers.getSigners();

        factory = await deployProxy("Factory", ["initialize", []], operator);
        reserve = await deployProxyByFactory(
            factory,
            "Reserve",
            ["initialize", [operator.address]],
            undefined,
            operator,
        );
        buffer = await deployProxyByFactory(factory, "Buffer", ["initialize", [operator.address]], undefined, operator);

        const grantRoleTx = await buffer.connect(operator).grantRole(ethers.id("POOL_MANAGER"), poolManager.address);
        await grantRoleTx.wait();

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

    describe("setReserve", () => {
        it("Failed : AccessControlUnauthorizedAccount", async () => {
            const tx = buffer.connect(user).setReserve(reserve.target);
            await expect(tx).to.be.revertedWithCustomError(buffer, "AccessControlUnauthorizedAccount");
        });

        it("Success", async () => {
            const tx = await buffer.connect(poolManager).setReserve(reserve.target);
            await expect(tx).to.emit(buffer, "ReserveSet").withArgs(poolManager.address, reserve.target);
            await expect(await buffer.reserve()).to.be.equal(reserve.target);
        });
    });

    describe("transferBuffer", () => {
        before(async () => {
            const tx = await buffer.connect(poolManager).setReserve(reserve.target);
            await tx.wait();
        });

        it("Failed : AccessControlUnauthorizedAccount", async () => {
            const tx = buffer.connect(user).transferBuffer(ethers.parseEther("1"));
            await expect(tx).to.be.revertedWithCustomError(buffer, "AccessControlUnauthorizedAccount");
        });

        it("Failed : Insufficient balance", async () => {
            const tx = buffer.connect(poolManager).transferBuffer(ethers.parseEther("1"));
            await expect(tx).to.be.revertedWith("Insufficient balance");
        });

        it("Success", async () => {
            const value = ethers.parseEther("1");
            const remainder = ethers.parseEther("0.1");

            const sendValueTx = await operator.sendTransaction({
                to: buffer.target,
                value: value + remainder,
            });
            await sendValueTx.wait();

            const beforeReserveBalance = await ethers.provider.getBalance(reserve.target);

            const tx = await buffer.connect(poolManager).transferBuffer(value);
            await expect(tx).to.emit(buffer, "BufferWithdrawn").withArgs(reserve.target, value);

            const afterReserveBalance = await ethers.provider.getBalance(reserve.target);
            const afterBufferBalance = await ethers.provider.getBalance(buffer.target);

            expect(afterReserveBalance).to.equal(beforeReserveBalance + value);
            expect(afterBufferBalance).to.equal(remainder);
        });
    });

    describe("withdrawToRebalance", () => {
        it("Failed : AccessControlUnauthorizedAccount", async () => {
            const tx = buffer.connect(user).withdrawToRebalance(user.address, ethers.parseEther("1"));
            await expect(tx).to.be.revertedWithCustomError(buffer, "AccessControlUnauthorizedAccount");
        });

        it("Failed : Insufficient balance", async () => {
            const tx = buffer.connect(poolManager).withdrawToRebalance(user.address, ethers.parseEther("1"));
            await expect(tx).to.be.revertedWith("Insufficient balance");
        });

        it("Success", async () => {
            const value = ethers.parseEther("1");
            const remainder = ethers.parseEther("0.1");

            const sendValueTx = await operator.sendTransaction({
                to: buffer.target,
                value: value + remainder,
            });
            await sendValueTx.wait();

            const beforeUserBalance = await ethers.provider.getBalance(user.address);

            const tx = await buffer.connect(poolManager).withdrawToRebalance(user.address, value);
            await expect(tx).to.emit(buffer, "BufferWithdrawn").withArgs(user.address, value);

            const afterUserBalance = await ethers.provider.getBalance(user.address);
            const afterBufferBalance = await ethers.provider.getBalance(buffer.target);

            expect(afterUserBalance).to.equal(beforeUserBalance + value);
            expect(afterBufferBalance).to.equal(remainder);
        });
    });
});
