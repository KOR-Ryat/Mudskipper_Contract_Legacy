// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

interface IReserve {
    function setClaimableQuantity (uint256 quantity) external;
    function setClaimableInterval (uint256 interval) external;
    function claimReserve (address to, uint256 quantity) external returns (bool success);

    event ClaimableQuantitySet (address setter, uint256 quantity);
    event ClaimableIntervalSet (address setter, uint256 interval);
    event ReserveClaimed (address claimer, uint256 quantity);

    error TooManyClaim (uint256 claimableBlock);
    error TooMuchClaim (uint256 claimableQuantity);
}

contract Reserve is IReserve, UUPSUpgradeable, AccessControlUpgradeable {
    bytes32 constant public TX_RELAYER = keccak256("TX_RELAYER");
    bytes32 constant public POOL_MANAGER = keccak256("POOL_MANAGER");

    mapping (address => uint256) public claimedBlock;
    uint256 public claimableQuantity;
    uint256 public claimableInterval;

    function setClaimableQuantity (uint256 quantity) external onlyRole(POOL_MANAGER) {
        claimableQuantity = quantity;
        emit ClaimableQuantitySet(msg.sender, quantity);
    }

    function setClaimableInterval (uint256 interval) external onlyRole(POOL_MANAGER) {
        claimableInterval = interval;
        emit ClaimableIntervalSet(msg.sender, interval);
    }

    // remove to address?
    function claimReserve (address to, uint256 quantity) external onlyRole(TX_RELAYER) returns (bool success) {
        require(to != address(0), "ZeroAddress is given");
        require(quantity <= claimableQuantity, "Too much claim");
        require(claimedBlock[msg.sender] + claimableInterval <= block.number, "Too many claim");

        claimedBlock[msg.sender] = block.number;

        (success, ) = to.call{value : quantity}("");
        require(success, "Failed to transfer");
        emit ReserveClaimed(to, quantity);
    }

    function intervalPassed () external view returns (bool) {
        return claimedBlock[msg.sender] + claimableInterval <= block.number;
    }

    receive () external payable {}
 
    constructor () {
        _disableInitializers();
    }

    function initialize(address owner) public initializer {
        _grantRole(DEFAULT_ADMIN_ROLE, owner);
    }

    function _authorizeUpgrade (address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}