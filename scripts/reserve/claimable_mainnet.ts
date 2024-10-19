import { ethers } from "hardhat";
import { MainnetContractAddress, MainnetRPC } from "../constant";
import { ReserveClaimable } from "../type";

const ReserveClaimable: ReserveClaimable = {
    WEMIX: {
        CLAIMABLE_QUANTITY: 1n,
        CLAIMABLE_INTERVAL: 1n,
    },
    Kroma: {
        CLAIMABLE_QUANTITY: 1n,
        CLAIMABLE_INTERVAL: 1n,
    },
    Ethereum: {
        CLAIMABLE_QUANTITY: 1n,
        CLAIMABLE_INTERVAL: 1n,
    },
    Polygon: {
        CLAIMABLE_QUANTITY: 1n,
        CLAIMABLE_INTERVAL: 1n,
    },
    Avalanche: {
        CLAIMABLE_QUANTITY: 1n,
        CLAIMABLE_INTERVAL: 1n,
    },
    BNB: {
        CLAIMABLE_QUANTITY: 1n,
        CLAIMABLE_INTERVAL: 1n,
    },
    Arbitrum: {
        CLAIMABLE_QUANTITY: 1n,
        CLAIMABLE_INTERVAL: 1n,
    },
    Optimism: {
        CLAIMABLE_QUANTITY: 1n,
        CLAIMABLE_INTERVAL: 1n,
    },
};

const POOL_MANAGER_PRIVATE_KEY = "";

async function main() {
    let poolManager = new ethers.Wallet(POOL_MANAGER_PRIVATE_KEY);

    for (const chain in MainnetRPC) {
        const { RPC_URL } = MainnetRPC[chain];
        console.log(`${chain} RPC_URL : ${RPC_URL}, CONTRACT_ADDRESS : ${MainnetContractAddress.Reserve}`);

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        poolManager = poolManager.connect(provider);
        const reserve = await ethers.getContractAt("Reserve", MainnetContractAddress.Reserve, poolManager);

        const setClaimableQuantityTx = await reserve.setClaimableQuantity(ReserveClaimable[chain].CLAIMABLE_QUANTITY);
        await setClaimableQuantityTx.wait();
        console.log("Set Claimable Quantity");

        const setClaimableIntervalTx = await reserve.setClaimableInterval(ReserveClaimable[chain].CLAIMABLE_INTERVAL);
        await setClaimableIntervalTx.wait();
        console.log("Set Claimable Interval");
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
