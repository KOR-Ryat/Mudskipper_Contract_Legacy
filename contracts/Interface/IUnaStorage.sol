// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

interface UnaBridgeConfigs {
    struct TokenConfig {
        address dstToken; // -----┐
        AssetType asset; //       |
        bytes4 exitSelector; // --┘
        LockType lock; // ---------┐
        bytes4 enterSelector; //   |
        uint16 serviceFeeRel; // --┘
        uint256 serviceFeeAbs;
    }

    enum AssetType {
            COIN,
            ERC20,
            ERC721,
            ERC20_MINT_FROM_CCIP
    }

    enum LockType {
            UNLOCK,
            LOCK
    }
}

interface IUnaStorage {
    function getTokenConfig(address srcToken, uint64 dstChain) external view returns (UnaBridgeConfigs.TokenConfig memory);
    function getServiceFee(address token, uint256 totalAmount, uint64 dstChain) external view returns (uint256);
}