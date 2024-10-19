import { ethers } from "hardhat";
import { deployProxy, deployProxyByFactory, logger } from "../../test/utils/util";
import { Buffer, Factory, Mudskipper, Reserve, Vault } from "../../typechain-types";
import { MainnetRPC } from "../constant";

const DEPLOYER_PRIVATE_KEY = "";
const TICKET_PUBLISHER_ADDRESS = "";
const TX_RELAYER_ADDRESS = "";

const SALT = ethers.id("MUDSKIPPER_DEFAULTSALT");

async function main() {
    let deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY);

    for (const chain in MainnetRPC) {
        let factory: Factory;
        let mudskipper: Mudskipper;
        let reserve: Reserve;
        let buffer: Buffer;
        let vault: Vault;

        const { RPC_URL } = MainnetRPC[chain];
        console.log(`${chain} RPC_URL : ${RPC_URL}`);

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        console.log(`Block Number : ${await provider.getBlockNumber()}`);

        deployer = deployer.connect(provider);
        console.log(
            `Deployer Address : ${deployer.address} Deployer Balance : ${ethers.formatEther(
                await provider.getBalance(deployer.address),
            )}`,
        );
        logger.state = true;

        console.log("---");
        factory = await deployProxy("Factory", ["initialize", []], deployer);
        mudskipper = await deployProxyByFactory(
            factory,
            "Mudskipper",
            ["initialize", [deployer.address]],
            SALT,
            deployer,
        );
        buffer = await deployProxyByFactory(factory, "Buffer", ["initialize", [deployer.address]], SALT, deployer);
        vault = await deployProxyByFactory(factory, "Vault", ["initialize", [deployer.address]], SALT, deployer);
        reserve = await deployProxyByFactory(factory, "Reserve", ["initialize", [deployer.address]], SALT, deployer);
        console.log("---");
        console.log("Contract deployed");

        await (await mudskipper.grantRole(ethers.id("TICKET_PUBLISHER"), TICKET_PUBLISHER_ADDRESS)).wait();
        await (await mudskipper.grantRole(ethers.id("TX_RELAYER"), TX_RELAYER_ADDRESS)).wait();
        await (await mudskipper.grantRole(ethers.id("MUDSKIPPER_MANAGER"), deployer.address)).wait();

        await (await buffer.grantRole(ethers.id("POOL_MANAGER"), deployer.address)).wait();

        await (await reserve.grantRole(ethers.id("POOL_MANAGER"), deployer.address)).wait();
        await (await reserve.grantRole(ethers.id("TX_RELAYER"), TX_RELAYER_ADDRESS)).wait();
        console.log("Role granted");

        await (await mudskipper.writeRegistry(ethers.id("MUDSKIPPER_BUFFER"), buffer.target)).wait();
        await (await mudskipper.writeRegistry(ethers.id("MUDSKIPPER_VAULT"), vault.target)).wait();
        await (await mudskipper.writeRegistry(ethers.id("MUDSKIPPER_RESERVE"), reserve.target)).wait();
        console.log("Registry set");

        console.log(`Block Number : ${await provider.getBlockNumber()}`);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
