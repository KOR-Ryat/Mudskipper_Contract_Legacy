import { ethers, network } from "hardhat";
import { expect } from "chai";
import { deployContract, deployContractByFactory, deployProxy } from "../utils/util";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { DefaultProxy, Factory, Reserve, TestV1, TestV2 } from "../../typechain-types";

describe("Proxy", function () {
    let snapshotId: number;
    let initialSnapshotId: number;

    let owner: HardhatEthersSigner;
    let owner2: HardhatEthersSigner;
    let notOwner: HardhatEthersSigner;

    let factory: Factory;
    let proxy: DefaultProxy;
    let testV1: TestV1;
    let testV2: TestV2;

    before(async () => {
        [owner, owner2, notOwner] = await ethers.getSigners();

        factory = await deployProxy("Factory", ["initialize", []], owner);
        testV1 = await deployContract("TestV1", [], owner);
        testV2 = await deployContract("TestV2", [], owner);
        proxy = await deployContractByFactory(
            factory,
            "DefaultProxy",
            [testV1.target, "0x", owner.address],
            undefined,
            owner,
        );

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

    describe("Owner", () => {
        it("Success", async () => {
            expect(await proxy.owner()).to.be.equal(owner.address);
        });
    });

    describe("upgradeToAndCall", () => {
        it("Failed : UNAUTHORIZED", async () => {
            const tx = proxy.connect(notOwner).upgradeToAndCall(testV2.target, "0x");
            await expect(tx).to.be.revertedWith("UNAUTHORIZED");
        });

        it("Failed : ERC1967InvalidImplementation", async () => {
            const tx = proxy.connect(owner).upgradeToAndCall(owner.address, "0x");
            await expect(tx).to.be.revertedWithCustomError(proxy, "ERC1967InvalidImplementation");
        });

        it("Success", async () => {
            const v1 = testV1.attach(proxy.target) as TestV1;
            const beforeVersion = await v1.version();
            const beforeImple = await proxy.getImplementation();

            const tx = await proxy.connect(owner).upgradeToAndCall(testV2.target, "0x");
            await expect(tx).to.be.emit(proxy, "Upgraded").withArgs(testV2.target);

            const v2 = testV2.attach(proxy.target) as TestV2;
            const afterVersion = await v2.version();
            const afterImple = await proxy.getImplementation();
            expect(beforeVersion).to.be.equal(1);
            expect(afterVersion).to.be.equal(2);
            expect(beforeImple).to.be.equal(testV1.target);
            expect(afterImple).to.be.equal(testV2.target);
        });
    });

    describe("transferOwnership", () => {
        it("Failed : UNAUTHORIZED", async () => {
            const tx = proxy.connect(notOwner).transferOwnership(owner2.address);
            await expect(tx).to.be.revertedWith("UNAUTHORIZED");
        });

        it("Failed : ERC1967InvalidAdmin", async () => {
            const tx = proxy.connect(owner).transferOwnership(ethers.ZeroAddress);
            await expect(tx).to.be.revertedWithCustomError(proxy, "ERC1967InvalidAdmin");
        });

        it("Success", async () => {
            const tx = await proxy.connect(owner).transferOwnership(owner2.address);
            await expect(tx).to.be.emit(proxy, "AdminChanged").withArgs(owner.address, owner2.address);

            const upgradeBeforeOwner = proxy.connect(owner).upgradeToAndCall(testV2.target, "0x");
            await expect(upgradeBeforeOwner).to.be.revertedWith("UNAUTHORIZED");

            const upgradeCurrentOwner = await proxy.connect(owner2).upgradeToAndCall(testV2.target, "0x");
            await expect(upgradeCurrentOwner).to.be.emit(proxy, "Upgraded").withArgs(testV2.target);
        });
    });
});
