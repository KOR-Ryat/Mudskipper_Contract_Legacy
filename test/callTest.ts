const { ethers, network } = require("hardhat")
const { expect } = require("chai");
import * as type from "@typechains";

describe("develop", function () {
  let snapshotId: number;
  let initialSnapshotId: number;

  let operator :SignerWithAddress;
  let user :SignerWithAddress;

  let token :type.MockToken;

  before(async () => {
    [operator, user] = await ethers.getSigners()

    token = await deployContract("MockToken", ["a" , "b"])

    initialSnapshotId = await network.provider.send("evm_snapshot");
  })
  
  beforeEach(async () => {
      snapshotId = await network.provider.send("evm_snapshot");
  });

  afterEach(async () => {
      await network.provider.send("evm_revert", [snapshotId]);
  });

  after(async () => {
      await network.provider.send("evm_revert", [initialSnapshotId]);
  });

  describe("t", () => {
    it("t", async () => {
      console.log(await token.symbol())
    })
  })
})

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