import { ethers, network } from "hardhat";
import { expect } from "chai";
import { deployProxy, deployProxyByFactory } from "../utils/util";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Factory, Vault } from "../../typechain-types";

describe("Vault", function () {
    let snapshotId: number;
    let initialSnapshotId: number;

    let operator: HardhatEthersSigner;
    let vaultManager: HardhatEthersSigner;
    let recipient1: HardhatEthersSigner;
    let recipient2: HardhatEthersSigner;
    let recipient3: HardhatEthersSigner;

    let factory: Factory;
    let vault: Vault;

    before(async () => {
        [operator, vaultManager, recipient1, recipient2, recipient3] = await ethers.getSigners();

        factory = await deployProxy("Factory", ["initialize", []], operator);
        vault = await deployProxyByFactory(factory, "Vault", ["initialize", [operator.address]], undefined, operator);

        const grantRoleTx = await vault.connect(operator).grantRole(ethers.id("VAULT_MANAGER"), vaultManager.address);
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

    describe("setRecipients", () => {
        it("Failed : AccessControlUnauthorizedAccount", async () => {
            const tx = vault.connect(recipient1).setRecipients([recipient1.address], [100]);
            await expect(tx).to.be.revertedWithCustomError(vault, "AccessControlUnauthorizedAccount");
        });

        it("Success", async () => {
            const initialShareRate = 100n;
            const lastShareRate = 200n;
            const r2ShareRate = 150n;

            const tx = await vault.connect(vaultManager).setRecipients([recipient1.address], [initialShareRate]);
            await expect(tx).to.emit(vault, "RecipientSet").withArgs(recipient1.address, 0, initialShareRate);
            await expect(await vault.shareRatio(recipient1)).to.be.equal(initialShareRate);
            await expect(await vault.totalShare()).to.be.equal(initialShareRate);

            const anotherRecipientTx = await vault
                .connect(vaultManager)
                .setRecipients([recipient2.address], [r2ShareRate]);
            await expect(anotherRecipientTx)
                .to.emit(vault, "RecipientSet")
                .withArgs(recipient2.address, 0, r2ShareRate);
            await expect(await vault.shareRatio(recipient2)).to.be.equal(r2ShareRate);
            await expect(await vault.totalShare()).to.be.equal(initialShareRate + r2ShareRate);

            const changeRateTx = await vault.connect(vaultManager).setRecipients([recipient1.address], [lastShareRate]);
            await expect(changeRateTx)
                .to.emit(vault, "RecipientSet")
                .withArgs(recipient1.address, initialShareRate, lastShareRate);
            await expect(await vault.shareRatio(recipient1)).to.be.equal(lastShareRate);
            await expect(await vault.totalShare()).to.be.equal(lastShareRate + r2ShareRate);
        });
    });

    describe("finalizeRevenue", () => {
        const r1ShareRate = 27n;
        const r2ShareRate = 75n;
        const r3ShareRate = 44n;
        const vaultBalance = 10n ** 18n;

        before(async () => {
            const tx = await vault
                .connect(vaultManager)
                .setRecipients(
                    [recipient1.address, recipient2.address, recipient3.address],
                    [r1ShareRate, r2ShareRate, r3ShareRate],
                );
            await tx.wait();
        });

        it("Failed : AccessControlUnauthorizedAccount", async () => {
            const sendValueTx = await operator.sendTransaction({
                to: vault.target,
                value: vaultBalance,
            });
            await sendValueTx.wait();

            const tx = vault.connect(recipient1).finalizeRevenue(vaultBalance);
            await expect(tx).to.be.revertedWithCustomError(vault, "AccessControlUnauthorizedAccount");
        });

        it("Failed : Insufficient balance", async () => {
            const tx = vault.connect(vaultManager).finalizeRevenue(vaultBalance);
            await expect(tx).to.be.revertedWith("Insufficient balance");
        });

        it("Success", async () => {
            const sendValueTx = await operator.sendTransaction({
                to: vault.target,
                value: vaultBalance,
            });
            await sendValueTx.wait();

            const beforeRecipient1Balance = await ethers.provider.getBalance(recipient1.address);
            const beforeRecipient2Balance = await ethers.provider.getBalance(recipient2.address);
            const beforeRecipient3Balance = await ethers.provider.getBalance(recipient3.address);

            const r1Expectation = (vaultBalance * r1ShareRate) / (r1ShareRate + r2ShareRate + r3ShareRate);
            const r2Expectation = (vaultBalance * r2ShareRate) / (r1ShareRate + r2ShareRate + r3ShareRate);
            const r3Expectation = vaultBalance - r1Expectation - r2Expectation;

            const tx = await vault.connect(vaultManager).finalizeRevenue(vaultBalance);
            await expect(tx).to.emit(vault, "VaultWithdrawn").withArgs(recipient1.address, r1Expectation);
            await expect(tx).to.emit(vault, "VaultWithdrawn").withArgs(recipient2.address, r2Expectation);
            await expect(tx).to.emit(vault, "VaultWithdrawn").withArgs(recipient3.address, r3Expectation);

            const afterRecipient1Balance = await ethers.provider.getBalance(recipient1.address);
            const afterRecipient2Balance = await ethers.provider.getBalance(recipient2.address);
            const afterRecipient3Balance = await ethers.provider.getBalance(recipient3.address);
            const afterVaultBalance = await ethers.provider.getBalance(vault.target);

            expect(afterRecipient1Balance).to.equal(beforeRecipient1Balance + r1Expectation);
            expect(afterRecipient2Balance).to.equal(beforeRecipient2Balance + r2Expectation);
            expect(afterRecipient3Balance).to.equal(beforeRecipient3Balance + r3Expectation);
            expect(r1Expectation + r2Expectation + r3Expectation).to.be.equal(vaultBalance);
            expect(afterVaultBalance).to.equal(0);
        });
    });
});
