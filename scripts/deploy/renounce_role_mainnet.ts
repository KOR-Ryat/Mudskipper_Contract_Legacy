import { ethers } from "hardhat";
import { MainnetContractAddress, MainnetRPC } from "../constant";
import { DefaultProxy } from "../../typechain-types";

const DEPLOYER_PRIVATE_KEY = "";
const OWNER_ADDRESS = "";
const MANAGER_ADDRESS = "";

async function main() {
    let deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY);

    let proxy: DefaultProxy;
    const factory = await ethers.getContractAt("Factory", MainnetContractAddress.Factory);
    const mudskipper = await ethers.getContractAt("Mudskipper", MainnetContractAddress.Mudskipper);
    const reserve = await ethers.getContractAt("Reserve", MainnetContractAddress.Reserve);
    const buffer = await ethers.getContractAt("Buffer", MainnetContractAddress.Buffer);
    const vault = await ethers.getContractAt("Vault", MainnetContractAddress.Vault);

    for (const chain in MainnetRPC) {
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

        await (await factory.connect(deployer).grantRole(ethers.ZeroHash, OWNER_ADDRESS)).wait();
        await (await factory.connect(deployer).renounceRole(ethers.ZeroHash, deployer.address)).wait();
        proxy = await ethers.getContractAt("DefaultProxy", factory.target, deployer);
        await (await proxy.transferOwnership(OWNER_ADDRESS)).wait();
        console.log("Factory Role granted");

        await (await mudskipper.connect(deployer).grantRole(ethers.ZeroHash, OWNER_ADDRESS)).wait();
        await (await mudskipper.connect(deployer).grantRole(ethers.id("MUDSKIPPER_MANAGER"), MANAGER_ADDRESS)).wait();
        await (
            await mudskipper.connect(deployer).renounceRole(ethers.id("MUDSKIPPER_MANAGER"), deployer.address)
        ).wait();
        await (await mudskipper.connect(deployer).renounceRole(ethers.ZeroHash, deployer.address)).wait();
        proxy = await ethers.getContractAt("DefaultProxy", mudskipper.target, deployer);
        await (await proxy.transferOwnership(OWNER_ADDRESS)).wait();
        console.log("Mudskipper Role granted");

        await (await buffer.connect(deployer).grantRole(ethers.ZeroHash, OWNER_ADDRESS)).wait();
        await (await buffer.connect(deployer).grantRole(ethers.id("POOL_MANAGER"), MANAGER_ADDRESS)).wait();
        await (await buffer.connect(deployer).renounceRole(ethers.id("POOL_MANAGER"), deployer.address)).wait();
        await (await buffer.connect(deployer).renounceRole(ethers.ZeroHash, deployer.address)).wait();
        proxy = await ethers.getContractAt("DefaultProxy", buffer.target, deployer);
        await (await proxy.transferOwnership(OWNER_ADDRESS)).wait();
        console.log("Buffer Role granted");

        await (await reserve.connect(deployer).grantRole(ethers.ZeroHash, OWNER_ADDRESS)).wait();
        await (await reserve.connect(deployer).grantRole(ethers.id("POOL_MANAGER"), MANAGER_ADDRESS)).wait();
        await (await reserve.connect(deployer).renounceRole(ethers.id("POOL_MANAGER"), deployer.address)).wait();
        await (await reserve.connect(deployer).renounceRole(ethers.ZeroHash, deployer.address)).wait();
        proxy = await ethers.getContractAt("DefaultProxy", reserve.target, deployer);
        await (await proxy.transferOwnership(OWNER_ADDRESS)).wait();
        console.log("Reserve Role granted");

        await (await vault.connect(deployer).grantRole(ethers.ZeroHash, OWNER_ADDRESS)).wait();
        await (await vault.connect(deployer).grantRole(ethers.id("VAULT_MANAGER"), MANAGER_ADDRESS)).wait();
        await (await vault.connect(deployer).renounceRole(ethers.ZeroHash, deployer.address)).wait();
        proxy = await ethers.getContractAt("DefaultProxy", vault.target, deployer);
        await (await proxy.transferOwnership(OWNER_ADDRESS)).wait();
        console.log("Vault Role granted");

        console.log(`Block Number : ${await provider.getBlockNumber()}`);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
