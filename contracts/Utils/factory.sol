pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

interface IDefaultProxy {
    function transferOwnership(address newOwner) external;
}

contract Factory is UUPSUpgradeable, AccessControlUpgradeable {
    event Deployed(address deployed);

    constructor () {
        _disableInitializers();
    }

    function initialize () public initializer {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function deploy (bytes32 salt, bytes memory bytecode) external onlyRole(DEFAULT_ADMIN_ROLE) {
        address deployed = Create2.deploy(0, salt, bytecode);

        emit Deployed(deployed);
    }

    function computeAddress(bytes32 salt, bytes32 bytecodeHash) external view returns (address) {
        return Create2.computeAddress(salt, bytecodeHash, address(this));
    }

    function _authorizeUpgrade (address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
