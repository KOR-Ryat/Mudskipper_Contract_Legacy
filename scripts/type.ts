export interface ChainRPC {
    [key: string]: {
        RPC_URL: string;
    };
}

export interface ReserveClaimable {
    [key: string]: {
        CLAIMABLE_QUANTITY: bigint;
        CLAIMABLE_INTERVAL: bigint;
    };
}
