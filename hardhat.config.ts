import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// import "hardhat-tracer"

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      evmVersion: "paris"
    }
  },
  networks: {
    hardhat: {
      live: false,
      tags: ["hardhat", "test"],
      chainId: 1337,
      // forking: {
      //   // TODO once PR merged : network: process.env.HARDHAT_FORK
      //   url: "https://api.test.wemix.com",
      //   blockNumber: undefined
      // }
    }
  }
};

export default config;
