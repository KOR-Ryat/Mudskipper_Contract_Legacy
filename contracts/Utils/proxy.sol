pragma solidity 0.8.20;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DefaultProxy is ERC1967Proxy {
    modifier onlyOwner {
        require(ERC1967Utils.getAdmin() == msg.sender, "UNAUTHORIZED");
        _;
    }

    constructor (
        address _logic,
        bytes memory _data
    ) ERC1967Proxy(_logic, _data) {
        ERC1967Utils.changeAdmin(msg.sender);
    }

    function owner () public view returns (address) {
        return ERC1967Utils.getAdmin();
    }
    
    function upgradeToAndCall(address newImplementation, bytes memory data) external onlyOwner {
        ERC1967Utils.upgradeToAndCall(newImplementation, data);
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        ERC1967Utils.changeAdmin(newOwner);
    }

    function getImplementation () external view returns (address) {
        return ERC1967Utils.getImplementation();
    }
}