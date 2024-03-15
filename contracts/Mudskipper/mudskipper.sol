// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

import "../Interface/IUnaBridge.sol";

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
        uint256 minOutput;
    }

    struct RequestTicket {
        uint256 id;
        address sender;
        address asset;
        uint256 quantity;
        uint256 fee;
        uint256 funding;
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

    error TransactionFailed (uint256 index);

    event TransferRequested (RequestTicket ticket);
    event TransferRejected (uint256 indexed ticketID, uint256 revertFee, Deposit returnedDeposit);
}

contract Mudskipper is IMudskipper, UUPSUpgradeable, AccessControlUpgradeable {
    bytes32 constant public TICKET_PUBLISHER = keccak256("TICKET_PUBLISHER");
    bytes32 constant public MUDSKIPPER_MANAGER = keccak256("MUDSKIPPER_MANAGER");
    bytes32 constant public TX_RELAYER = keccak256("TX_RELAYER");

    bytes32 constant public MUDSKIPPER_RESERVE = keccak256("MUDSKIPPER_RESERVE");
    bytes32 constant public MUDSKIPPER_VAULT = keccak256("MUDSKIPPER_VAULT");
    bytes32 constant public MUDSKIPPER_BUFFER = keccak256("MUDSKIPPER_BUFFER");

    bytes32 constant public BRIDGE_UNABRIDGE = keccak256("BRIDGE_UNABRIDGE");

    bytes32 constant public AGGREGATOR_LIFI = keccak256("AGGREGATOR_LIFI");

    mapping (bytes32 => address) public addressRegistry;

    bool public denyRequest;

    // uint256 public approveUnit;

    constructor () {
        _disableInitializers();
    }

    function initialize () public initializer {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function writeRegistry (bytes32 key, address addr) external onlyRole(MUDSKIPPER_MANAGER) {
        addressRegistry[key] = addr;
    }

    function circuitBreaker (bool _break) external onlyRole(TX_RELAYER) {
        denyRequest = _break;
    }

    // function setApproveUnit (uint256 _approveUnit) external onlyRole(MUDSKIPPER_MANAGER) {
    //     approveUnit = _approveUnit;
    // }

    function _validateSignature(
        bytes32 authority,
        bytes memory message,
        bytes calldata signature
    ) internal view returns (bool) {
        return hasRole(
            authority,
            ECDSA.recover(
                keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(message))),
                signature
            )
        );
    }

    function _serializeTicket (RequestTicket calldata ticket) internal pure returns (bytes memory) {
        return abi.encodePacked(
            ticket.id,
            ticket.sender,
            ticket.asset,
            ticket.quantity,
            ticket.fee,
            ticket.funding
        );
    }

    function requestTransfer (RequestTicket calldata ticket, bytes calldata signature) public payable returns (bool success) {
        require(!denyRequest, "Service unavailable");
        require(_validateSignature(
            TICKET_PUBLISHER,
            _serializeTicket(ticket),
            signature
        ), "Invalid signature");
        require(ticket.sender == msg.sender, "Invalid ticket");

        uint256 feeValue = msg.value;
        if(ticket.asset == address(0)){
            require(ticket.quantity < msg.value, "Insufficient value");
            feeValue -= ticket.quantity;
        }else{
            // todo : consider variant
            uint256 balanceBefore = IERC20(ticket.asset).balanceOf(address(this));
            success = IERC20(ticket.asset).transferFrom(msg.sender, address(this), ticket.quantity);
            require(success, "Failed to transfer asset");
            require(balanceBefore + ticket.quantity == IERC20(ticket.asset).balanceOf(address(this)), "Transfer error");
        }

        require(feeValue == ticket.fee + ticket.funding, "Incorrect fee");

        (success, ) = addressRegistry[MUDSKIPPER_VAULT].call{value : ticket.fee}("");
        require(success, "Failed to save valut");
        (success, ) = addressRegistry[MUDSKIPPER_BUFFER].call{value : ticket.funding}("");
        require(success, "Failed to save buffer");

        emit TransferRequested(ticket);
    }

    function callArbitrary (Tx[] calldata txs) external onlyRole(TX_RELAYER) returns (bool success) {
        for(uint i=0; i<txs.length; i++){
            (success, ) = txs[i].to.call{value : txs[i].value}(txs[i].data);
            require(success, "Call failed");
        }
    }

    function bridgeViaLiFi (uint256 value, bytes memory data) external onlyRole(TX_RELAYER) returns (bool success) {
        (success, ) = addressRegistry[AGGREGATOR_LIFI].call{value : value}(data);
        require(success, "Bridge failed");
    }

    function swapAndUnaBridge (SwapRequest calldata swapRequest, UnaTypes.ExitERC20 memory unaBridgeCalldata) external onlyRole(TX_RELAYER) returns (bool success) {
        require(swapRequest.swapData.length > 0, "Swap length is zero");

        _swap(swapRequest);

        return _bridgeViaUnaBridge(unaBridgeCalldata);
    }

    function _approveMax (address token, address to, uint256 min) internal {
        if(IERC20(token).allowance(address(this), to) < min){
            bool success = IERC20(token).approve(to, type(uint256).max);
            require(success, "Approve failed");
        }
    }

    function approveMax (address token, address to, uint256 min) external onlyRole(TX_RELAYER) {
        _approveMax(token, to, min);
    }

    function _bridgeViaUnaBridge (UnaTypes.ExitERC20 memory unaBridgeCalldata) internal returns (bool success) {
        _approveMax(unaBridgeCalldata.srcToken, addressRegistry[BRIDGE_UNABRIDGE], unaBridgeCalldata.totalAmount);
        IUnaBridge(addressRegistry[BRIDGE_UNABRIDGE]).exitERC20(unaBridgeCalldata);
        return true;
    }
    
    function bridgeViaUnaBridge (UnaTypes.ExitERC20 memory unaBridgeCalldata) external onlyRole(TX_RELAYER) returns (bool success) {
        return _bridgeViaUnaBridge(unaBridgeCalldata);
    }

    function swap (SwapRequest calldata swapRequest) external onlyRole(TX_RELAYER) returns (bool success) {
        require(swapRequest.swapData.length > 0, "Swap length is zero");
        
        _swap(swapRequest);
        return true;
    }

    function _swap (SwapRequest calldata args) internal returns (uint256 lastOutput) {
        address lastAsset = args.swapData[args.swapData.length - 1].toAsset;
        uint256 beforeBalance = _getBalance(lastAsset, address(this));

        for(uint i=0; i<args.swapData.length; i++){
            _approveMax(args.swapData[i].fromAsset, args.swapData[i].approveTo, args.swapData[i].fromQuantity);
            (bool success, bytes memory res) = args.swapData[i].callTo.call{
                value : args.swapData[i].fromAsset == address(0) ? args.swapData[i].fromQuantity : 0
            }(args.swapData[i].callData);

            require(success, "Swap failed");
        }

        lastOutput = _getBalance(lastAsset, address(this)) - beforeBalance;

        require(lastOutput >= args.minOutput, "Insufficient output");
    }

    function _getBalance (address asset, address owner) internal view returns (uint256) {
        return asset == address(0) ? owner.balance : IERC20(asset).balanceOf(owner);
    }

    function rejectTransfer (uint256 ticketID, Deposit calldata deposit) external onlyRole(TX_RELAYER) returns (bool success) {
        uint256 refundNative = deposit.collectedFee - deposit.revertFee;
        if(deposit.asset == address(0)){
            refundNative += deposit.quantity;
        }else{
            success = IERC20(deposit.asset).transfer(deposit.requester, deposit.quantity);
            require(success, "Failed to transfer asset");
        }
        (success, ) = deposit.requester.call{value : refundNative}("");

        emit TransferRejected(ticketID, deposit.revertFee, deposit);
    }

    function _authorizeUpgrade (address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}