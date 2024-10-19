import { AddressLike } from "ethers";

export interface RequestTicket {
    id: bigint;
    sender: AddressLike;
    asset: AddressLike;
    quantity: bigint;
    fee: bigint;
    funding: bigint;
    deadline : bigint;
}

export interface Tx {
    to: AddressLike;
    value: bigint;
    data: string;
}

export interface SwapData {
    callTo: AddressLike;
    approveTo: AddressLike;
    fromAsset: AddressLike;
    fromQuantity: bigint;
    toAsset: AddressLike;
    callData: string;
    requiresDeposit: boolean;
}

export interface SwapRequest {
    swapData: SwapData[];
    recipient: AddressLike;
    minOutput: bigint;
}

export interface EVMTokenAmount {
    token: AddressLike;
    amount: bigint;
}

export interface ExitERC20 {
    from: AddressLike;
    dstChain: bigint;
    to: AddressLike;
    gasLimit: bigint;
    ccipFeeTokenAmountForCurrChain: EVMTokenAmount;
    ccipFeeTokenAmountForNextChain: EVMTokenAmount;
    totalAmount: bigint;
    bridgedAmount: bigint;
    srcToken: AddressLike;
    metaHash: string;
    contractAddress: AddressLike;
    inputs: string;
}

export interface Deposit {
    requester: AddressLike;
    asset: AddressLike;
    quantity: bigint;
    collectedFee: bigint;
    revertFee: bigint;
}

export interface ExactInputSingleParams {
    tokenIn: AddressLike;
    tokenOut: AddressLike;
    fee: bigint;
    recipient: AddressLike;
    amountIn: bigint;
    amountOutMinimum: bigint;
    sqrtPriceLimitX96: bigint;
}

export interface QuickSwapExactInputSingleParams {
    tokenIn: AddressLike;
    tokenOut: AddressLike;
    recipient: AddressLike;
    deadline: bigint;
    amountIn: bigint;
    amountOutMinimum: bigint;
    limitSqrtPrice: bigint;
}
