import { ethers } from "hardhat";
import { ChainRPC } from "../type";

interface RegistryAddress {
    [key: string]: {
        BRIDGE_UNABRIDGE: string;
    };
}

const TestnetRPC: ChainRPC = {
    WEMIX: {
        RPC_URL: "https://api.test.wemix.com",
    },
    BNB: {
        RPC_URL: "https://bsc-testnet-rpc.publicnode.com",
    },
};

const RegistryAddress: RegistryAddress = {
    WEMIX: {
        BRIDGE_UNABRIDGE: "0xcf8521cdfa6ef6c71c4bf7bbb78bb6b4451f5692",
    },
    BNB: {
        BRIDGE_UNABRIDGE: "0x75457e170902a7b2a72bbc3ff2b032a12a675eb8",
    },
};

const MUDSKIPPER_MANAGER_PRIVATE_KEY = "";
const MUDSKIPPER_ADDRESS = "";

async function main() {
    let mudskipperManager = new ethers.Wallet(MUDSKIPPER_MANAGER_PRIVATE_KEY);

    for (const chain in TestnetRPC) {
        const { RPC_URL } = TestnetRPC[chain];
        console.log(`${chain} RPC_URL : ${RPC_URL}, CONTRACT_ADDRESS : ${MUDSKIPPER_ADDRESS}`);

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        mudskipperManager = mudskipperManager.connect(provider);
        const mudskipper = await ethers.getContractAt("Mudskipper", MUDSKIPPER_ADDRESS, mudskipperManager);

        const registries = RegistryAddress[chain];
        for (const [key, value] of Object.entries(registries)) {
            const tx = await mudskipper.writeRegistry(ethers.id(key), value);
            await tx.wait();

            console.log(`Write Registry ${key} : ${value}`);
        }
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
