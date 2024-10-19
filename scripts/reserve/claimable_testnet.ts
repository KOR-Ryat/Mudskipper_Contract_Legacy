import { ethers } from "hardhat";
import { ChainRPC, ReserveClaimable } from "../type";

const TestnetRPC: ChainRPC = {
    WEMIX: {
        RPC_URL: "https://api.test.wemix.com",
    },
    BNB: {
        RPC_URL: "https://bsc-testnet-rpc.publicnode.com",
    },
};

const ReserveClaimable: ReserveClaimable = {
    WEMIX: {
        CLAIMABLE_QUANTITY: 1n,
        CLAIMABLE_INTERVAL: 1n,
    },
    BNB: {
        CLAIMABLE_QUANTITY: 1n,
        CLAIMABLE_INTERVAL: 1n,
    },
};

const POOL_MANAGER_PRIVATE_KEY = "";
const RESERVE_ADDRESS = "";

async function main() {
    let poolManager = new ethers.Wallet(POOL_MANAGER_PRIVATE_KEY);

    for (const chain in TestnetRPC) {
        const { RPC_URL } = TestnetRPC[chain];
        console.log(`${chain} RPC_URL : ${RPC_URL}, CONTRACT_ADDRESS : ${RESERVE_ADDRESS}`);

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        poolManager = poolManager.connect(provider);
        const reserve = await ethers.getContractAt("Reserve", RESERVE_ADDRESS, poolManager);

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
