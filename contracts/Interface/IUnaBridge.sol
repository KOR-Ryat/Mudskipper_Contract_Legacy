// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

interface UnaTypes {
    struct ExitERC20 {
        address from;
        uint64 dstChain;
        address to;
        uint64 gasLimit;
        Client.EVMTokenAmount ccipFeeTokenAmountForCurrChain;
        Client.EVMTokenAmount ccipFeeTokenAmountForNextChain;
        uint256 totalAmount;
        uint256 bridgedAmount;
        address srcToken;
        bytes32 metaHash;
        address contractAddress;
        bytes inputs;
    }
}

interface Client {
    struct EVMTokenAmount {
        address token;
        uint256 amount;
    }
}

interface IUnaBridge {
    function exitERC20(UnaTypes.ExitERC20 calldata args) external payable;
}