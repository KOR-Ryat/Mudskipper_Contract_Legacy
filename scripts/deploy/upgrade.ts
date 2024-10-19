import { ethers, network } from "hardhat";
import { deployContract, deployProxy, deployProxyByFactory, logger } from "../../test/utils/util";
import * as type from "@typechains";

const TARGET_CONTRACT = "Mudskipper"
const CURRENT_ADDRESS = "0x8ddDa94d8E9e5d51F2bEEa4B1c081f74FfD67FBA"
const UPGRADE_CALLDATA = "0x"

const sleep = async (ms :number) => new Promise(res => setTimeout(res, ms))

let Proxy : type.DefaultProxy;

async function main() {
  console.log(Number(await network.provider.send("eth_blockNumber", [])))

  const [operator, publisher, deployer] = await ethers.getSigners();

  // /* fork test */
  // const OWNER_ADDRESS = "0x6559b74109f5c7F77A9741C63FB3fF17909fF4Ae"
  // await network.provider.send("hardhat_impersonateAccount", [OWNER_ADDRESS]);
  // const operator = await ethers.getSigner(OWNER_ADDRESS);
  // /* til here */

  console.log(`Current Operator : ${operator.address}`)
  await sleep(5000)

  console.log("---")

  Proxy = await ethers.getContractAt("DefaultProxy", CURRENT_ADDRESS)

  console.log(await Proxy.owner())
  const imple = await deployContract(TARGET_CONTRACT, [], operator);
  console.log(`New implementation deployed : ${imple.target}`)

  await Proxy.connect(operator).upgradeToAndCall(imple.target, UPGRADE_CALLDATA);
  console.log(`${TARGET_CONTRACT} (${CURRENT_ADDRESS}) upgraded`)

  await sleep(5000)

  console.log(await (await ethers.getContractAt("Mudskipper", CURRENT_ADDRESS)).newFunction())

  console.log(Number(await network.provider.send("eth_blockNumber", [])))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});