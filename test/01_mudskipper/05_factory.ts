import { ethers, network } from "hardhat";
import { expect } from "chai";
import { DefaultProxy, Factory, MockToken } from "../../typechain-types";
import { logger } from "../utils/util";

const SALT = ethers.id("Mudskipper");

const RpcUrl = {
    Ethereum: "https://mainnet.infura.io/v3/0f0594731ab14200bc3e2dafdaa56d4a",
    Avalanche: "https://avalanche-mainnet.infura.io/v3/0f0594731ab14200bc3e2dafdaa56d4a",
    BNB: "https://bsc-rpc.publicnode.com",
    Polygon: "https://polygon-mainnet.infura.io/v3/0f0594731ab14200bc3e2dafdaa56d4a",
    Wemix: "https://api.wemix.com",
};

const buildBytecode = (constructorTypes: any[], constructorArgs: any[], contractBytecode: string) => {
    return `${contractBytecode}${ethers.AbiCoder.defaultAbiCoder().encode(constructorTypes, constructorArgs).slice(2)}`;
};

describe("Factory", function () {
    let deployer = ethers.Wallet.createRandom();

    let imple: Factory;
    let proxy: DefaultProxy;
    let factory: Factory;

    let ethDeployedAddress: string;

    describe("Deploy : ERC20", () => {
        it("Deploy Ethereum", async () => {
            await network.provider.send("hardhat_reset", [
                {
                    forking: {
                        jsonRpcUrl: RpcUrl.Ethereum,
                    },
                },
            ]);

            deployer = deployer.connect(ethers.provider);

            await network.provider.send("hardhat_setBalance", [
                deployer.address,
                ethers.toBeHex(ethers.parseEther("1000")),
            ]);

            imple = await (await ethers.getContractFactory("Factory")).connect(deployer).deploy();
            proxy = await (await ethers.getContractFactory("DefaultProxy"))
                .connect(deployer)
                .deploy(imple.target, imple.interface.encodeFunctionData("initialize", []), deployer);
            factory = await ethers.getContractAt("Factory", proxy.target);

            const mockTokenFactory = await ethers.getContractFactory("MockToken");
            const byteCode = buildBytecode(["string", "string"], ["name", "symbol"], mockTokenFactory.bytecode);

            const computeAddress = await factory.computeAddress(SALT, ethers.keccak256(byteCode));
            ethDeployedAddress = computeAddress;

            const deployTx = await factory.connect(deployer).deploy(SALT, byteCode);
            await expect(deployTx).to.be.emit(factory, "Deployed").withArgs(computeAddress);

            const token = mockTokenFactory.attach(computeAddress).connect(deployer) as MockToken;
            expect(await token.name()).to.be.equal("name");
            expect(await token.symbol()).to.be.equal("symbol");

            logger.log("Ethereum Deployed : ", computeAddress);
        });

        it("Deploy Avalanche", async () => {
            await network.provider.send("hardhat_reset", [
                {
                    forking: {
                        jsonRpcUrl: RpcUrl.Avalanche,
                    },
                },
            ]);

            deployer = deployer.connect(ethers.provider);

            await network.provider.send("hardhat_setBalance", [
                deployer.address,
                ethers.toBeHex(ethers.parseEther("1000")),
            ]);

            imple = await (await ethers.getContractFactory("Factory")).connect(deployer).deploy();
            proxy = await (await ethers.getContractFactory("DefaultProxy"))
                .connect(deployer)
                .deploy(imple.target, imple.interface.encodeFunctionData("initialize", []), deployer);
            factory = await ethers.getContractAt("Factory", proxy.target);

            const mockTokenFactory = await ethers.getContractFactory("MockToken");
            const byteCode = buildBytecode(["string", "string"], ["name", "symbol"], mockTokenFactory.bytecode);

            const computeAddress = await factory.computeAddress(SALT, ethers.keccak256(byteCode));
            expect(computeAddress).to.be.equal(ethDeployedAddress);

            const deployTx = await factory.connect(deployer).deploy(SALT, byteCode);
            await expect(deployTx).to.be.emit(factory, "Deployed").withArgs(computeAddress);

            const token = mockTokenFactory.attach(computeAddress).connect(deployer) as MockToken;
            expect(await token.name()).to.be.equal("name");
            expect(await token.symbol()).to.be.equal("symbol");

            logger.log("Avalanche Deployed : ", computeAddress);
        });

        it("Deploy BNB", async () => {
            await network.provider.send("hardhat_reset", [
                {
                    forking: {
                        jsonRpcUrl: RpcUrl.BNB,
                    },
                },
            ]);

            deployer = deployer.connect(ethers.provider);

            await network.provider.send("hardhat_setBalance", [
                deployer.address,
                ethers.toBeHex(ethers.parseEther("1000")),
            ]);

            imple = await (await ethers.getContractFactory("Factory")).connect(deployer).deploy();
            proxy = await (await ethers.getContractFactory("DefaultProxy"))
                .connect(deployer)
                .deploy(imple.target, imple.interface.encodeFunctionData("initialize", []), deployer);
            factory = await ethers.getContractAt("Factory", proxy.target);

            const mockTokenFactory = await ethers.getContractFactory("MockToken");
            const byteCode = buildBytecode(["string", "string"], ["name", "symbol"], mockTokenFactory.bytecode);

            const computeAddress = await factory.computeAddress(SALT, ethers.keccak256(byteCode));
            expect(computeAddress).to.be.equal(ethDeployedAddress);

            const deployTx = await factory.connect(deployer).deploy(SALT, byteCode);
            await expect(deployTx).to.be.emit(factory, "Deployed").withArgs(computeAddress);

            const token = mockTokenFactory.attach(computeAddress).connect(deployer) as MockToken;
            expect(await token.name()).to.be.equal("name");
            expect(await token.symbol()).to.be.equal("symbol");

            logger.log("BNB Deployed : ", computeAddress);
        });

        it("Deploy Polygon", async () => {
            await network.provider.send("hardhat_reset", [
                {
                    forking: {
                        jsonRpcUrl: RpcUrl.Polygon,
                    },
                },
            ]);

            deployer = deployer.connect(ethers.provider);

            await network.provider.send("hardhat_setBalance", [
                deployer.address,
                ethers.toBeHex(ethers.parseEther("1000")),
            ]);

            imple = await (await ethers.getContractFactory("Factory")).connect(deployer).deploy();
            proxy = await (await ethers.getContractFactory("DefaultProxy"))
                .connect(deployer)
                .deploy(imple.target, imple.interface.encodeFunctionData("initialize", []), deployer);
            factory = await ethers.getContractAt("Factory", proxy.target);

            const mockTokenFactory = await ethers.getContractFactory("MockToken");
            const byteCode = buildBytecode(["string", "string"], ["name", "symbol"], mockTokenFactory.bytecode);

            const computeAddress = await factory.computeAddress(SALT, ethers.keccak256(byteCode));
            expect(computeAddress).to.be.equal(ethDeployedAddress);

            const deployTx = await factory.connect(deployer).deploy(SALT, byteCode);
            await expect(deployTx).to.be.emit(factory, "Deployed").withArgs(computeAddress);

            const token = mockTokenFactory.attach(computeAddress).connect(deployer) as MockToken;
            expect(await token.name()).to.be.equal("name");
            expect(await token.symbol()).to.be.equal("symbol");

            logger.log("Polygon Deployed : ", computeAddress);
        });

        it("Deploy Wemix", async () => {
            await network.provider.send("hardhat_reset", [
                {
                    forking: {
                        jsonRpcUrl: RpcUrl.Wemix,
                    },
                },
            ]);

            deployer = deployer.connect(ethers.provider);

            await network.provider.send("hardhat_setBalance", [
                deployer.address,
                ethers.toBeHex(ethers.parseEther("1000")),
            ]);

            imple = await (await ethers.getContractFactory("Factory")).connect(deployer).deploy();
            proxy = await (await ethers.getContractFactory("DefaultProxy"))
                .connect(deployer)
                .deploy(imple.target, imple.interface.encodeFunctionData("initialize", []), deployer);
            factory = await ethers.getContractAt("Factory", proxy.target);

            const mockTokenFactory = await ethers.getContractFactory("MockToken");
            const byteCode = buildBytecode(["string", "string"], ["name", "symbol"], mockTokenFactory.bytecode);

            const computeAddress = await factory.computeAddress(SALT, ethers.keccak256(byteCode));
            expect(computeAddress).to.be.equal(ethDeployedAddress);

            const deployTx = await factory.connect(deployer).deploy(SALT, byteCode);
            await expect(deployTx).to.be.emit(factory, "Deployed").withArgs(computeAddress);

            const token = mockTokenFactory.attach(computeAddress).connect(deployer) as MockToken;
            expect(await token.name()).to.be.equal("name");
            expect(await token.symbol()).to.be.equal("symbol");

            logger.log("Wemix Deployed : ", computeAddress);
        });
    });
});
