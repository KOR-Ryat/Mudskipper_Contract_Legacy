// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

interface IVault {
    function setRecipients (address[] calldata newRecipients, uint256[] calldata shares) external;

    event RecipientSet (address recipient, uint256 lastShare, uint256 newShare);
    event ReserveSet (address setter, address newReserve);
    event VaultWithdrawn (address to, uint256 quantity);

    error InsufficientBalance (uint256 transferableBalance);
}

contract Vault is IVault, UUPSUpgradeable, AccessControlUpgradeable {
    bytes32 constant public VAULT_MANAGER = keccak256("VAULT_MANAGER");

    address[] public recipients;
    mapping(address => uint256) public shareRatio;
    uint256 public totalShare;

    function countRecipients () external view returns (uint256) {
        return recipients.length;
    }

    function setRecipients (address[] calldata newRecipients, uint256[] calldata shares) external onlyRole(VAULT_MANAGER) {
        for(uint i=0; i<newRecipients.length; i++){
            _setRecipient(newRecipients[i], shares[i]);
        }
    }

    function _setRecipient (address recipient, uint256 newShare) internal {
        uint256 lastShare = 0;
        if(_isRecipient(recipient)){
            lastShare = shareRatio[recipient];
        }else{
            recipients.push(recipient);
        }
        shareRatio[recipient] = newShare;
        totalShare = totalShare + newShare - lastShare;
        emit RecipientSet(recipient, lastShare, newShare);
    }

    function _isRecipient (address addr) internal view returns (bool) {
        for(uint i=0; i<recipients.length; i++){
            if(recipients[i] == addr){return true;}
        }
        return false;
    }

    function finalizeRevenue (uint256 quantity) external onlyRole(VAULT_MANAGER) returns (bool success) {
        require(quantity <= address(this).balance, "Insufficient balance");

        uint256 totalSent = 0;
        for(uint i=0; i<recipients.length; i++){
            uint256 amount = 
                i == recipients.length - 1 
                ? quantity - totalSent 
                : quantity * shareRatio[recipients[i]] / totalShare;

            (success, ) = recipients[i].call{value : amount}("");
            totalSent += amount;
            
            require(success, "Failed to transfer");
            emit VaultWithdrawn(recipients[i], amount);
        }
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