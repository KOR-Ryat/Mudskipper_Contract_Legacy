// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

interface IBuffer {
    function setReserve (address newReserve) external;
    function transferBuffer (uint256 quantity) external returns (bool success);
    function withdrawToRebalance (address to, uint256 quantity) external returns (bool success);

    event ReserveSet (address setter, address newReserve);
    event BufferWithdrawn (address to, uint256 quantity);

    error InsufficientBalance (uint256 transferableBalance);
}

contract Buffer is IBuffer, UUPSUpgradeable, AccessControlUpgradeable {
    bytes32 constant public POOL_MANAGER = keccak256("POOL_MANAGER");

    address public reserve;

    function setReserve (address newReserve) external onlyRole(POOL_MANAGER) {
        reserve = newReserve;
        emit ReserveSet(msg.sender, newReserve);
    }

    function transferBuffer (uint256 quantity) external onlyRole(POOL_MANAGER) returns (bool success) {
        return _withdraw(reserve, quantity);
    }

    function withdrawToRebalance (address to, uint256 quantity) external onlyRole(POOL_MANAGER) returns (bool success) {
        return _withdraw(to, quantity);
    }

    function _withdraw (address to, uint256 quantity) internal returns (bool success) {
        require(quantity <= address(this).balance, "Insufficient balance");

        (success, ) = reserve.call{value : quantity}("");
        require(success, "Failed to transfer");
        emit BufferWithdrawn(to, quantity);
    }

    receive () external payable {}
 
    constructor () {
        _disableInitializers();
    }

    function initialize () public initializer {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function _authorizeUpgrade (address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}