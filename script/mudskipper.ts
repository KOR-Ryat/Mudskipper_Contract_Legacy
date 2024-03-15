import { ethers, network } from "hardhat";
import * as type from "@typechains";

const TESTER_ADDRESS = "0x1c46a3febe569d23a77EF01A1D128C836637a3Af"
const OWNER_ADDRESS = "0x6559b74109f5c7F77A9741C63FB3fF17909fF4Ae"

const TX_DELAY = 5000 // 5s
const sleep = async ms => new Promise(res => setTimeout(res, ms))

let Mudskipper: type.Mudskipper;
let Reserve :type.Reserve;
let Buffer: type.Buffer;
let Vault :type.Vault;

async function main() {
  /* fork test */
  // const [deployer, publisher] = await ethers.getSigners();

  // const TESTER_ADDRESS = publisher
  // const OWNER_ADDRESS = deployer

  // await network.provider.send("hardhat_impersonateAccount", [TESTER_ADDRESS]);
  // const deployer = await ethers.getSigner(TESTER_ADDRESS);
  // await network.provider.send("hardhat_impersonateAccount", [OWNER_ADDRESS]);
  // const publisher = await ethers.getSigner(OWNER_ADDRESS);


  console.log(Number(await network.provider.send("eth_blockNumber", [])))

  Mudskipper = await deployProxy("Mudskipper", ["initialize", []])
  await sleep(TX_DELAY);
  Buffer = await deployProxy("Buffer", ["initialize", []])
  await sleep(TX_DELAY);
  Vault = await deployProxy("Vault", ["initialize", []])
  await sleep(TX_DELAY);
  Reserve = await deployProxy("Reserve", ["initialize", []])
  await sleep(TX_DELAY);

  await Mudskipper.grantRole(ethers.id("TICKET_PUBLISHER"), TESTER_ADDRESS)
  await sleep(TX_DELAY);
  await Mudskipper.grantRole(ethers.id("MUDSKIPPER_MANAGER"), OWNER_ADDRESS)
  await sleep(TX_DELAY);
  await Mudskipper.grantRole(ethers.id("TX_RELAYER"), TESTER_ADDRESS)
  await sleep(TX_DELAY);

  await Buffer.grantRole(ethers.id("POOL_MANAGER"), OWNER_ADDRESS)
  await sleep(TX_DELAY);
  await Vault.grantRole(ethers.id("VAULT_MANAGER"), OWNER_ADDRESS)
  await sleep(TX_DELAY);
  await Reserve.grantRole(ethers.id("POOL_MANAGER"), OWNER_ADDRESS)
  await sleep(TX_DELAY);
  await Reserve.grantRole(ethers.id("TX_RELAYER"), TESTER_ADDRESS)
  await sleep(TX_DELAY);

  console.log("Role granted")

  await Mudskipper.writeRegistry(ethers.id("MUDSKIPPER_BUFFER"), Buffer.target)
  await sleep(TX_DELAY);
  await Mudskipper.writeRegistry(ethers.id("MUDSKIPPER_VAULT"), Vault.target)
  await sleep(TX_DELAY);
  await Mudskipper.writeRegistry(ethers.id("MUDSKIPPER_RESERVE"), Reserve.target)
  await sleep(TX_DELAY);

  console.log("Registry set")

  console.log(Number(await network.provider.send("eth_blockNumber", [])))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function deployProxy (name, init) {
  const imple = await deployContract(name, [])
  await sleep(TX_DELAY)
  const impleInterface = await (await ethers.getContractFactory(name)).interface
  const proxy = await deployContract("DefaultProxy", [imple.target, impleInterface.encodeFunctionData(...init)])
  console.log(`${name} deployed : ${proxy.target}, implementation : ${imple.target}`)
  await sleep(TX_DELAY)
  return await ethers.getContractAt(name, proxy.target)
}

async function deployContract (name, args) {
  const factory = await ethers.getContractFactory(name)
  const result = await factory.deploy(...args)
  return result
}