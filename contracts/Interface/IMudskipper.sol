// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./IUnaBridge.sol";

interface IMudskipper {
    struct SwapData {
        address callTo;
        address approveTo;
        address fromAsset;
        uint256 fromQuantity;
        address toAsset;
        bytes callData;
        bool requiresDeposit;
    }

    struct SwapRequest {
        SwapData[] swapData;
        address recipient;
        uint256 minOutput;
    }

    struct RequestTicket {
        uint256 id;
        address sender;
        address asset;
        uint256 quantity;
        uint256 fee;
        uint256 funding;
        uint256 deadline;
    }

    struct Deposit {
        address requester;
        address asset;
        uint256 quantity;
        uint256 collectedFee;
        uint256 revertFee;
    }

    struct Tx {
        address to;
        uint256 value;
        bytes data;
    }

    function requestTransfer (RequestTicket calldata ticket, bytes calldata signature) external payable returns (bool success);
    function rejectTransfer (uint256 ticketID, Deposit calldata deposit) external payable returns (bool success); // onlyRole(TX_RELAYER)

    function callArbitrary (Tx[] calldata txs) external returns (bool success); // onlyRole(TX_RELAYER)
    function swap (SwapRequest calldata swapRequest) external returns (bool success); // onlyRole(TX_RELAYER)
    function approveMax (address token, address to, uint256 min) external; // onlyRole(TX_RELAYER)

    function bridgeViaLiFi (uint256 value, bytes memory data) external payable returns (bool success); // onlyRole(TX_RELAYER)
    function bridgeViaUnaBridge (UnaTypes.ExitERC20 memory unaBridgeCalldata) external payable returns (bool success); // onlyRole(TX_RELAYER)
    function swapAndUnaBridge (SwapRequest calldata swapRequest, UnaTypes.ExitERC20 memory unaBridgeCalldata) external payable returns (bool success); // onlyRole(TX_RELAYER)
    
    function circuitBreaker (bool _break) external; // onlyRole(TX_RELAYER)

    function writeRegistry (bytes32 key, address addr) external; // onlyRole(MUDSKIPPER_MANAGER)

    event TransferRequested (RequestTicket ticket);
    event TransferRejected (uint256 indexed ticketID, uint256 revertFee, Deposit returnedDeposit);
    event SwapExecuted (address recipient, address finalAsset, uint256 outputQuantity);

    error LowlevelError (bytes reason);
    error LiFiFailed (bytes reason);
    error SwapFailed (uint256 failedIndex, bytes reason);
}