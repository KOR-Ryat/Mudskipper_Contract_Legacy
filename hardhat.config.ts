import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-tracer"
// import "hardhat-gas-reporter"
// import "hardhat-contract-sizer";

const config: HardhatUserConfig = {
  tracer: {
    tasks: ["run"],
  },
  solidity: {
    compilers : [
      {
        
    version : "0.8.20",
      },
      {
        
    version : "0.8.11",
      }
    ]
    // version : "0.8.20",
    // settings: {
    //   optimizer: {
    //     enabled: true,
    //     runs: 10,
    //   },
    //   evmVersion: "paris",
    // },
  },
  // gasReporter : {
  //   enabled : true,
  //   // outputFile : "gasReport.ss"
  // },
  networks: {
      hardhat: {
          //chainId: 1337,
          forking: {
                    // url: "https://api.test.wemix.com", // Wemix Testnet

                    url: "https://api.wemix.com", // Wemix Mainnet

                    // url: "https://avalanche.public-rpc.com", // Avalanche Mainnet
                    // blockNumber: 42098790
                },
          // accounts:[
          // ]
      },
  },
  // contractSizer: {
  //     alphaSort: true,
  //     disambiguatePaths: false,
  //     runOnCompile: true,
  //     strict: true,
  // },
};

export default config;
