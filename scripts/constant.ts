import { ChainRPC } from "./type";

export const MainnetRPC: ChainRPC = {
    WEMIX: {
        RPC_URL: "https://api.wemix.com",
    },
    Kroma: {
        RPC_URL: "https://1rpc.io/kroma",
    },
    Ethereum: {
        RPC_URL: "https://mainnet.infura.io/v3/7d20064b909a4c56aa5a9469fe363b1e",
    },
    Polygon: {
        RPC_URL: "https://polygon-mainnet.infura.io/v3/7d20064b909a4c56aa5a9469fe363b1e",
    },
    Avalanche: {
        RPC_URL: "https://avalanche-mainnet.infura.io/v3/7d20064b909a4c56aa5a9469fe363b1e",
    },
    BNB: {
        RPC_URL: "https://bsc.drpc.org",
    },
    Arbitrum: {
        RPC_URL: "https://arbitrum-mainnet.infura.io/v3/7d20064b909a4c56aa5a9469fe363b1e",
    },
    Optimism: {
        RPC_URL: "https://optimism-mainnet.infura.io/v3/7d20064b909a4c56aa5a9469fe363b1e",
    },
};

export const MainnetContractAddress = {
    Mudskipper: "",
    Buffer: "",
    Reserve: "",
    Vault: "",
    Factory: "",
};
