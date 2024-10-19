import { Contract } from "ethers";
import { ethers } from "hardhat";
import { DefaultProxy, Factory } from "../../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { RequestTicket } from "./type";

export async function deployProxy<Type>(name: string, initData: any[], deployer:HardhatEthersSigner): Promise<Type> {
    if(!deployer){[deployer, ] = await ethers.getSigners()}
    const imple = (await deployContract(name, [], deployer)) as Contract;
    const impleInterface = (await ethers.getContractFactory(name)).interface;
    const proxy: DefaultProxy = await deployContract("DefaultProxy", [
        imple.target,
        // @ts-ignore
        impleInterface.encodeFunctionData(...initData),
        deployer.address
    ], deployer);
    logger.log(`${name} deployed : ${proxy.target}, implementation : ${imple.target}`)
    await proxy.waitForDeployment()
    return imple.attach(proxy.target) as Type;
}

export async function deployContract<Type>(name: string, args: any[], deployer?:HardhatEthersSigner): Promise<Type> {
    if(!deployer){[deployer, ] = await ethers.getSigners()}
    const factory = await ethers.getContractFactory(name);
    return (await (await factory.connect(deployer).deploy(...args)).waitForDeployment()) as Type;
}

export async function deployContractByFactory(factory: Factory, name :string, args :any[], salt ?:any, deployer ?:HardhatEthersSigner) {
    if(!salt){salt = ethers.id("MUDSKIPPER_DEFAULTSALT")}
    if(!deployer){[deployer, ] = await ethers.getSigners()}
    const factoryInstance = await ethers.getContractFactory(name);
    const byteCode = `${factoryInstance.bytecode}${factoryInstance.interface.encodeDeploy([...args]).substring(2)}`
    const addr = await factory.computeAddress(salt, ethers.keccak256(byteCode))
    await (await factory.connect(deployer).deploy(salt, byteCode)).wait()
    return await ethers.getContractAt(name, addr)
}

export async function deployProxyByFactory<Type>(factory :Factory, name: string, initData: any[], salt :any, deployer ?:HardhatEthersSigner, owner ?:HardhatEthersSigner): Promise<Type> {
    if(!salt){salt = ethers.id("MUDSKIPPER_DEFAULTSALT")}
    if(!deployer){[deployer, ] = await ethers.getSigners()}
    const imple = (await deployContractByFactory(factory, name, [], salt, deployer)) as Contract;
    const impleInterface = (await ethers.getContractFactory(name)).interface;
    const proxy = await deployContractByFactory(factory, "DefaultProxy", [
        imple.target,
        // @ts-ignore
        impleInterface.encodeFunctionData(...initData),
        owner ? owner.address : deployer.address
    ], salt, deployer);
    logger.log(`${name} deployed : ${proxy.target}, implementation : ${imple.target}`)
    await proxy.waitForDeployment()
    return imple.attach(proxy.target) as Type;
}

export const signRequestTransfer = async (requestTicket: RequestTicket, signer: HardhatEthersSigner) => {
    const packedMessage = ethers.solidityPackedKeccak256(
        ["uint256", "address", "address", "uint256", "uint256", "uint256", "uint256"],
        Object.values(requestTicket),
    );
    return await signer.signMessage(ethers.toBeArray(packedMessage));
};

export const logger = {
    state : false,
    log : (...x:any[]) => logger.state ? console.log(...x) : ""
}

export const CONSTANT = {
    ONE_HOUR_LATER : BigInt(+new Date())/1000n + 3600n
}