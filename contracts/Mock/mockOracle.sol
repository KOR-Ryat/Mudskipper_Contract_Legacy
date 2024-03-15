// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

interface IOracle {
    function setPrices (bytes32[] calldata topics, uint256[] calldata values) external;
    function getPrices (bytes32[] calldata topics) external view returns (uint256[] memory results);
}

contract MockOracle is UUPSUpgradeable, Initializable {
    mapping (bytes32 => uint256) public prices;

    function setPrices (bytes32[] calldata topics, uint256[] calldata values) external {
        for(uint8 i=0; i<topics.length; i++){
            prices[topics[i]] = values[i];
        }
    }

    function getPrices (bytes32[] calldata topics) external view returns (uint256[] memory results) {
        results = new uint256[](topics.length);
        for(uint8 i=0; i<topics.length; i++){
            results[i] = prices[topics[i]];
        }
    }
    
    function initialize () public initializer {
    }

    constructor () {
        _disableInitializers();
    }

    function _authorizeUpgrade (address newImplementation) internal override {}
}