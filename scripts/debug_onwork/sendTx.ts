import { ethers, network } from "hardhat";
import fs from "fs";

const ABI_PATH = "./scripts/debug/abi.json"
const FUNCTION_NAME = "exactInputSingle"
const FUNCTION_ARGS = [
  [
    '0xB07fb272Ea921C98A233B599472F0afFd2D8507B',
    '0x770D9D14C4AE2f78dCa810958C1D9b7Ea4620289',
    0n,
    '0xF500208d9aB68FeA3cc41bd107811e809C0B6B83',
    5142893604156789321n,
    [ '0x0000000000000000000000000000000000000000', 0n ],
    [ '0x0000000000000000000000000000000000000000', 0n ],
    2710486214n,
    13418889183018678280n,
    8086350298138211867n,
    [
      '0x770D9D14C4AE2f78dCa810958C1D9b7Ea4620289',
      '0x8E81fCc2d4A3bAa0eE9044E0D7E36F59C9BbA9c1',
      '0x2ec6Fc5c495aF0C439E17268d595286d5f897dD0',
      '0x7D72b22a74A216Af4a002a1095C8C707d6eC1C5f',
      '0xF500208d9aB68FeA3cc41bd107811e809C0B6B83'
    ],
    '0x0000000000000000000000000000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000',
    '0x'
  ]
]
// use it to directly set the tx data
const INPUT_DATA = "0x414bf389000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c00000000000000000000000098169bf9b7a44edad372364063b897e16ebba88e0000000000000000000000000000000000000000000000000000000000000064000000000000000000000000d511aeaabab12ac5e1818a9044744996746ad7a80000000000000000000000000000000000000000000000000000000065f2b53900000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000002a6e982bad413af0000000000000000000000000000000000000000000000000000000000000000"

async function main() {
  const contractABI = JSON.parse((await fs.readFileSync(ABI_PATH)).toString());
  
  const contractInterface = new ethers.Interface(contractABI);

  const functionSig = INPUT_DATA.substr(0, 10)
  const functionFrag = contractInterface.getFunction(functionSig)
  if(!functionFrag){
    return console.log("Unknown function sig!")
  }
  console.log(`# ${functionFrag.name} (${functionSig})`)
  console.log(await contractInterface.decodeFunctionData(functionFrag, INPUT_DATA))

    // console.log(contractInterface.getError("0x26ea953d"))
  // const [operator, publisher] = await ethers.getSigners();
  await network.provider.send("hardhat_impersonateAccount", ["0xB07fb272Ea921C98A233B599472F0afFd2D8507B"]);
  const publisher = await ethers.getSigner("0xB07fb272Ea921C98A233B599472F0afFd2D8507B");
  const unaWEMIX = await ethers.getContractAt("MockToken", "0xf500208d9ab68fea3cc41bd107811e809c0b6b83")  
  const CROW = await ethers.getContractAt("MockToken", "0x770d9d14c4ae2f78dca810958c1d9b7ea4620289")  
  const WWEMIX = await ethers.getContractAt("MockToken", "0x7D72b22a74A216Af4a002a1095C8C707d6eC1C5f")  
  console.log(await unaWEMIX.balanceOf(publisher.address))
  console.log(await CROW.balanceOf(publisher.address))
  const tx = await publisher.sendTransaction({
    "data": contractInterface.encodeFunctionData("swapIn", [
      [
        '0xB07fb272Ea921C98A233B599472F0afFd2D8507B',
        '0x770D9D14C4AE2f78dCa810958C1D9b7Ea4620289',
        0n,
        '0xF500208d9aB68FeA3cc41bd107811e809C0B6B83',
        5142893604156789321n,
        [ '0x0000000000000000000000000000000000000000', 0n ],
        [ '0x0000000000000000000000000000000000000000', 0n ],
        2710486214n,
        13418889183018678280n,
        8086350298138211867n,
        [
          '0x770D9D14C4AE2f78dCa810958C1D9b7Ea4620289',
          '0x8E81fCc2d4A3bAa0eE9044E0D7E36F59C9BbA9c1',
          '0x2ec6Fc5c495aF0C439E17268d595286d5f897dD0',
          '0x7D72b22a74A216Af4a002a1095C8C707d6eC1C5f',
          '0xF500208d9aB68FeA3cc41bd107811e809C0B6B83'
        ],
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x'
      ]
    ]),
    "to": "0x398d227685614aaeb2e4711b048626b0551bc0ee",
    "value": 0,
    "from": "0xB07fb272Ea921C98A233B599472F0afFd2D8507B",
    "gasPrice": "0x174876e801",
    "gasLimit": 740000n
  })
  console.log(await tx.wait())
    console.log(await unaWEMIX.balanceOf(publisher.address))
    console.log(await CROW.balanceOf(publisher.address))

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

