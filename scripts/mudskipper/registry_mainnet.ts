import { ethers } from "hardhat";
import { MainnetContractAddress, MainnetRPC } from "../constant";

interface RegistryAddress {
    [key: string]: {
        BRIDGE_UNABRIDGE: string;
        AGGREGATOR_LIFI: string;
    };
}

const RegistryAddress: RegistryAddress = {
    WEMIX: {
        BRIDGE_UNABRIDGE: "0x26e07c47ef5925dafbcb9eb2525e013b1e5ec85d",
        AGGREGATOR_LIFI: "",
    },
    Kroma: {
        BRIDGE_UNABRIDGE: "0x0694bacb17a941c17d05499bb08441d98498e48f",
        AGGREGATOR_LIFI: "",
    },
    Ethereum: {
        BRIDGE_UNABRIDGE: "0xf0a5cebdadf87d1a412617437047b96302f400fc",
        AGGREGATOR_LIFI: "",
    },
    Polygon: {
        BRIDGE_UNABRIDGE: "0x2f1c4ddd1670991642932aafeee97bf737d4e309",
        AGGREGATOR_LIFI: "",
    },
    Avalanche: {
        BRIDGE_UNABRIDGE: "0xd3a0fa0991bc59fc682e7757223649196de4e0bc",
        AGGREGATOR_LIFI: "",
    },
    BNB: {
        BRIDGE_UNABRIDGE: "0xf894ce041b225b1b59c755d4accab3569de35101",
        AGGREGATOR_LIFI: "",
    },
    Arbitrum: {
        BRIDGE_UNABRIDGE: "0x0d5f1fda2a146f27b84dca619fe831ee366e99a9",
        AGGREGATOR_LIFI: "",
    },
    Optimism: {
        BRIDGE_UNABRIDGE: "0x951e959eec08a73a26dcce644ffdc3b253e98fa1",
        AGGREGATOR_LIFI: "",
    },
};

const MUDSKIPPER_MANAGER_PRIVATE_KEY = "";

async function main() {
    let mudskipperManager = new ethers.Wallet(MUDSKIPPER_MANAGER_PRIVATE_KEY);

    for (const chain in MainnetRPC) {
        const { RPC_URL } = MainnetRPC[chain];
        console.log(`${chain} RPC_URL : ${RPC_URL}, CONTRACT_ADDRESS : ${MainnetContractAddress.Mudskipper}`);

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        mudskipperManager = mudskipperManager.connect(provider);
        const mudskipper = await ethers.getContractAt(
            "Mudskipper",
            MainnetContractAddress.Mudskipper,
            mudskipperManager,
        );

        const registries = RegistryAddress[chain];
        for (const [key, value] of Object.entries(registries)) {
            if (value) {
                const tx = await mudskipper.writeRegistry(ethers.id(key), value);
                await tx.wait();

                console.log(`Write Registry ${key} : ${value}`);
            }
        }
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
