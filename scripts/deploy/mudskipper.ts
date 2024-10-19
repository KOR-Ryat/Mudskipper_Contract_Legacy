import { ethers, network } from "hardhat";
import { deployProxy, deployProxyByFactory, logger } from "../../test/utils/util";
import * as type from "@typechains";

const TESTER_ADDRESS = "0x1c46a3febe569d23a77EF01A1D128C836637a3Af"
const OWNER_ADDRESS = "0x6559b74109f5c7F77A9741C63FB3fF17909fF4Ae"

const TX_DELAY = 5000 // 5s
const sleep = async ms => new Promise(res => setTimeout(res, ms))

let Mudskipper: type.Mudskipper;
let Reserve :type.Reserve;
let Buffer: type.Buffer;
let Vault :type.Vault;
let Factory : type.Factory;

async function main() {
  /* fork test */
  const [operator, publisher, deployer] = await ethers.getSigners();

  const TESTER_ADDRESS = publisher
  const OWNER_ADDRESS = operator

  // await network.provider.send("hardhat_impersonateAccount", [TESTER_ADDRESS]);
  // const deployer = await ethers.getSigner(TESTER_ADDRESS);
  // await network.provider.send("hardhat_impersonateAccount", [OWNER_ADDRESS]);
  // const publisher = await ethers.getSigner(OWNER_ADDRESS);


  console.log(Number(await network.provider.send("eth_blockNumber", [])))

  console.log(`Current Deployer : ${deployer.address}`)
  console.log(`Current Owner : ${OWNER_ADDRESS.address}`)
  console.log(`Current Tester : ${TESTER_ADDRESS.address}`)

  await sleep(5000)

  console.log("---")
  
  logger.state = true;

  Factory = await deployProxy("Factory", ["initialize", []], deployer)

  const SALT = ethers.id("MUDSKIPPER_DEFAULTSALT")
  
  Mudskipper = await deployProxyByFactory(Factory, "Mudskipper", ["initialize", [operator.address]], SALT, deployer, operator)
  Buffer = await deployProxyByFactory(Factory, "Buffer", ["initialize", [operator.address]], SALT, deployer, operator)
  Vault = await deployProxyByFactory(Factory, "Vault", ["initialize", [operator.address]], SALT, deployer, operator)
  Reserve = await deployProxyByFactory(Factory, "Reserve", ["initialize", [operator.address]], SALT, deployer, operator)

  console.log("---")
  console.log("Contract deployed")

  // await Factory.succeedOwnership(Mudskipper.target, OWNER_ADDRESS)
  // await sleep(TX_DELAY);
  // await Factory.succeedOwnership(Buffer.target, OWNER_ADDRESS)
  // await sleep(TX_DELAY);
  // await Factory.succeedOwnership(Vault.target, OWNER_ADDRESS)
  // await sleep(TX_DELAY);
  // await Factory.succeedOwnership(Reserve.target, OWNER_ADDRESS)
  // await sleep(TX_DELAY);

  // console.log("Ownership gained")

  await (await Mudskipper.grantRole(ethers.id("TICKET_PUBLISHER"), TESTER_ADDRESS)).wait()
  await (await Mudskipper.grantRole(ethers.id("MUDSKIPPER_MANAGER"), OWNER_ADDRESS)).wait()
  await (await Mudskipper.grantRole(ethers.id("TX_RELAYER"), TESTER_ADDRESS)).wait()

  await (await Buffer.grantRole(ethers.id("POOL_MANAGER"), OWNER_ADDRESS)).wait()

  await (await Vault.grantRole(ethers.id("VAULT_MANAGER"), OWNER_ADDRESS)).wait()

  await (await Reserve.grantRole(ethers.id("POOL_MANAGER"), OWNER_ADDRESS)).wait()
  await (await Reserve.grantRole(ethers.id("TX_RELAYER"), TESTER_ADDRESS)).wait()

  console.log("Role granted")

  await (await Mudskipper.writeRegistry(ethers.id("MUDSKIPPER_BUFFER"), Buffer.target)).wait()
  await (await Mudskipper.writeRegistry(ethers.id("MUDSKIPPER_VAULT"), Vault.target)).wait()
  await (await Mudskipper.writeRegistry(ethers.id("MUDSKIPPER_RESERVE"), Reserve.target)).wait()

  console.log("Registry set")

  await (await Reserve.setClaimableInterval(60 * 5)).wait()
  await (await Reserve.setClaimableQuantity(10n ** 18n)).wait()

  console.log("Reserve configured")

  console.log(Number(await network.provider.send("eth_blockNumber", [])))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});