// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

import "../Interface/IUnaBridge.sol";

contract MockUnaBridge is Initializable, UUPSUpgradeable {
    event ExitERC20(
        bytes32 indexed messageId,
        address indexed from,
        address indexed to,
        uint64 dstChain,
        uint64 gasLimit,
        Client.EVMTokenAmount ccipFeeTokenAmountForCurrChain,
        Client.EVMTokenAmount ccipFeeTokenAmountForNextChain,
        Client.EVMTokenAmount ccipFeeTokenAmount,
        uint256 serviceFeeAmount,
        address srcToken,
        uint256 amount,
        bytes32 metaHash
    );

    uint256 public nonce;

    function exitERC20(UnaTypes.ExitERC20 calldata args) external {
        IERC20(args.srcToken).transferFrom(msg.sender, address(this), args.totalAmount);

        emit ExitERC20(
            keccak256(abi.encodePacked(nonce++)),
            args.from, 
            args.to, 
            args.dstChain, 
            args.gasLimit, 
            args.ccipFeeTokenAmountForCurrChain, 
            args.ccipFeeTokenAmountForNextChain, 
            args.ccipFeeTokenAmountForCurrChain, 
            0, 
            args.srcToken, 
            args.totalAmount, 
            args.metaHash
        );
    }

    function initialize () public initializer {
        nonce = 1;
    }

    constructor () {
        _disableInitializers();
    }

    function _authorizeUpgrade (address newImplementation) internal override {}
}

// exitERC20(UnaTypes.ExitERC20 calldata args) external payable override whenNotPaused nonReentrant
// enterERC20(UnaTypes.EnterERC20 calldata args) external override nonReentrant onlyReceiver

// struct EnterERC20 {
//     bytes32 metaHash;
//     bytes32 messageId;
//     uint64 srcChain;
//     address from;
//     address to;
//     address dstToken;
//     uint256 amount;
// }
// struct ExitERC20 {
//     address from;
//     uint64 dstChain;
//     address to;
//     uint64 gasLimit;
//     Client.EVMTokenAmount ccipFeeTokenAmountForCurrChain;
//     Client.EVMTokenAmount ccipFeeTokenAmountForNextChain;
//     uint256 totalAmount;
//     uint256 bridgedAmount;
//     address srcToken;
//     bytes32 metaHash;
//     address contractAddress;
//     bytes inputs;
// }
// struct EVMTokenAmount {
//     address token; // 토큰 주소
//     uint256 amount; // 토큰의 양
// }
// ExitERC20(
//         bytes32 indexed messageId,
//         address indexed from,
//         address indexed to,
//         uint64 dstChain,
//         uint64 gasLimit,
//         Client.EVMTokenAmount ccipFeeTokenAmountForCurrChain,
//         Client.EVMTokenAmount ccipFeeTokenAmountForNextChain,
//         Client.EVMTokenAmount ccipFeeTokenAmount,
//         uint256 serviceFeeAmount,
//         address srcToken,
//         uint256 amount,
//         bytes32 metaHash
// )
// EnterERC20(
//         bytes32 indexed messageId,
//         address indexed from,
//         address indexed to,
//         uint64 srcChain,
//         address dstToken,
//         uint256 amount,
//         bytes32 metaHash
// );