import hre from "hardhat"
import { ethers, network, tracer } from "hardhat";
import fs from "fs";
import { wrapHardhatProvider } from "hardhat-tracer/dist/src/wrapper";

wrapHardhatProvider(hre) 

const ABI_PATH = "./scripts/debug_onwork/abi.json"
const INPUT_DATA = "0x085b21d100000000000000000000000000000000000000000000000000000000000000200000000000000000000000004fa954cdc6ac9233948d548f70b8f1cba0aefac4000000000000000000000000000000000000000000000000b8159170038f96fb0000000000000000000000004fa954cdc6ac9233948d548f70b8f1cba0aefac400000000000000000000000000000000000000000000000000000000000c350000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001a055690d9db800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000001630ee686da40000000000000000000000000001eb91a51e622239031a15eba898df03f5019f0630000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000000"

async function parseSubTx (abiPath, data) {  
  const contractABI = JSON.parse((await fs.readFileSync(abiPath)).toString());
  const contractInterface = new ethers.Interface(contractABI);
  console.log(contractInterface.getError("0xf9b5d12d"))
  
  const functionSig = data.substr(0, 10)
  const functionFrag = contractInterface.getFunction(functionSig)
  if(!functionFrag){return console.log("Unknown function sig!")}
  console.log(`# ${functionFrag.name} (${functionSig})`)
  console.log(await contractInterface.decodeFunctionData(functionFrag, data))

    return contractInterface
}

async function main() {
  // const subTxInterface = await parseSubTx(ABI_PATH, "0xd97495c90000000000000000000000000000000000000000000000000000000000000020000000000000000000000000ac6351f78e8f5b3fde89b21dc96f4a610a9bedd70000000000000000000000001eb91a51e622239031a15eba898df03f5019f06300000000000000000000000000000000000000000000000000000000000000000000000000000000000000003c2a14d0a0aee8a86f1a7dcf674eb39d2afae9c000000000000000000000000000000000000000000000000080d9a45f8eaddf5b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000065f9477a000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000000187e965bec347000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000028000000000000000000000000000000000000000000000000000000000000000030000000000000000000000001eb91a51e622239031a15eba898df03f5019f063000000000000000000000000244c72ab61f11dd44bfa4aaf11e2efd89ca789fe0000000000000000000000003c2a14d0a0aee8a86f1a7dcf674eb39d2afae9c00000000000000000000000000000000000000000000000000000000000000000")

  const contractInterface = (await ethers.getContractFactory("Mudskipper")).interface

  const functionSig = INPUT_DATA.substr(0, 10)
  const functionFrag = contractInterface.getFunction(functionSig)
  if(!functionFrag){return console.log("Unknown function sig!")}
  console.log(`# ${functionFrag.name} (${functionSig})`)
  console.log(await contractInterface.decodeFunctionData(functionFrag, INPUT_DATA))
  console.log((await contractInterface.decodeFunctionData(functionFrag, INPUT_DATA))[0])

  // await network.provider.send("hardhat_impersonateAccount", ["0x1c46a3febe569d23a77ef01a1d128c836637a3af"]);
  // const publisher = await ethers.getSigner("0x1c46a3febe569d23a77ef01a1d128c836637a3af");

  // const [operator, publisher] = await ethers.getSigners()
  const publisher = new ethers.Wallet("1807fbb4789123fb3937cfacc56ddb62706f86cd4656678d464ebe486434076f", ethers.provider)

  const ticketData = [
    '43',
    '0x1c46a3febe569d23a77ef01a1d128c836637a3af',
    '0x1eb91a51e622239031a15eba898df03f5019f063',
    '1000000000000000000',
    '1017500000001600000',
    '1017500000001600000'
  ]
     
  const packedMessage = ethers.solidityPackedKeccak256(["uint256", "address", "address", "uint256", "uint256", "uint256"], Object.values(ticketData));
  // const packedMessage = ethers.id(ethers.solidityPacked(["uint256", "address", "address", "uint256", "uint256", "uint256"], Object.values(ticketData)));
  // console.log("BE", ethers.solidityPacked(["uint256", "address", "address", "uint256", "uint256", "uint256"], Object.values(ticketData)))
  console.log("BE", packedMessage)
  console.log("BE", await publisher.signMessage(ethers.toBeArray(packedMessage)))

  // const mudskipper = await ethers.getContractAt("Mudskipper", "0xc611b6A8C5Ec6E882b224398BD8636ef52c84890")
  // console.log("Contract", await mudskipper.validateSignature___(ethers.solidityPackedKeccak256(["uint256", "address", "address", "uint256", "uint256", "uint256"], Object.values(ticketData))))
  // console.log("Contract", await mudskipper.serializeTicket(ticketData))

  // const newImple = await deployContract("Mudskipper", []);
  // await network.provider.send("hardhat_setCode", [
  //   "0xaC6351F78e8f5b3fDe89B21dC96F4A610A9beDD7",
  //   await network.provider.send("eth_getCode", [newImple.target])
  // ])
  // const mudskipper = await ethers.getContractAt("Mudskipper", "0xaC6351F78e8f5b3fDe89B21dC96F4A610A9beDD7")

  // tracer.printNext=true
  // tracer.enabled=true
  const tx = publisher.sendTransaction({
    data : INPUT_DATA,
    // data : contractInterface.encodeFunctionData("swap", [
    //   [
    //     [
    //       [
    //         '0x44fc6A2ABA89705f7230ACEF47E41640d5e9CFbC',
    //         '0x44fc6A2ABA89705f7230ACEF47E41640d5e9CFbC',
    //         '0x1eB91A51e622239031A15EbA898Df03F5019f063',
    //         100000000000000000n,
    //         '0x3C2a14d0a0aEe8A86F1A7dCF674eB39d2AFaE9c0',
    //         subTxInterface.encodeFunctionData("swapIn", [
    //           [
    //             publisher.address,
    //             '0x1eB91A51e622239031A15EbA898Df03F5019f063',
    //             0n,
    //             '0x3C2a14d0a0aEe8A86F1A7dCF674eB39d2AFaE9c0',
    //             9284632837123596123n,
    //             [ '0x0000000000000000000000000000000000000000', 0n ],
    //             [ '0x0000000000000000000000000000000000000000', 0n ],
    //             1710835578n,
    //             100000000000000000n,
    //             430911480841031n,
    //             [
    //               '0x1eB91A51e622239031A15EbA898Df03F5019f063',
    //               '0x244c72AB61f11dD44Bfa4AaF11e2EFD89ca789fe',
    //               '0x3C2a14d0a0aEe8A86F1A7dCF674eB39d2AFaE9c0'
    //             ],
    //             '0x0000000000000000000000000000000000000000000000000000000000000000',
    //             '0x0000000000000000000000000000000000000000',
    //             '0x'
    //           ]
    //         ]),
    //         false
    //       ]
    //     ],
    //     '0x1c46a3febe569d23a77EF01A1D128C836637a3Af',
    //     433076865166866n
    //   ]
    // ]),
    to : "0x4fa954CDC6AC9233948D548F70B8F1CbA0AEFac4",
    value : 0 //ethers.parseEther("2.0350000000032")
  })
  console.log(await tx)
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

