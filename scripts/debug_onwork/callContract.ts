import { ethers, network } from "hardhat";
import fs from "fs";

const ABI_PATH = "./scripts/debug/abi.json"

async function main() {
  // const contractABI = JSON.parse((await fs.readFileSync(ABI_PATH)).toString());
  // const contractInterface = new ethers.Interface(contractABI);

  const mudskipper = await ethers.getContractAt("Mudskipper", "0xce7c6d0804dfE3408090Fa67B8c2dA5fE8c1D775")
  // console.log(await mudskipper.grantRole(ethers.id("MUDSKIPPER_MANAGER"), "0x1c46a3febe569d23a77ef01a1d128c836637a3af"))

  console.log(await mudskipper.hasRole(ethers.id("TICKET_PUBLISHER"), "0x1c46a3febe569d23a77ef01a1d128c836637a3af"))
  console.log(await mudskipper.hasRole(ethers.id("MUDSKIPPER_MANAGER"), "0x6559b74109f5c7F77A9741C63FB3fF17909fF4Ae"))
  console.log(await mudskipper.hasRole(ethers.id("MUDSKIPPER_MANAGER"), "0x1c46a3febe569d23a77ef01a1d128c836637a3af"))

  // const token = await ethers.getContractAt("MockToken", "0x1eB91A51e622239031A15EbA898Df03F5019f063")
  // console.log(await token.balanceOf("0x1c46a3febe569d23a77ef01a1d128c836637a3af"))
  // console.log(await token.allowance("0x1c46a3febe569d23a77ef01a1d128c836637a3af", "0xac6351f78e8f5b3fde89b21dc96f4a610a9bedd7"))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function deployProxy (name, init) {
  const imple = await deployContract(name, [])
  const impleInterface = await (await ethers.getContractFactory(name)).interface
  const proxy = await deployContract("DefaultProxy", [imple.target, impleInterface.encodeFunctionData(...init)])
  return await ethers.getContractAt(name, proxy.target)
}

async function deployContract (name, args) {
  const factory = await ethers.getContractFactory(name)
  return await factory.deploy(...args)
}

