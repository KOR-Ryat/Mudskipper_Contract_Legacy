// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

interface IOracle {
    function setPrices (bytes32[] calldata topics, uint256[] calldata values) external;
    function getPrices (bytes32[] calldata topics) external view returns (uint256[] memory results);
}

interface IMockToken is IERC20 {
    function mint (address to, uint256 quantity) external;
}

interface ISwap {
    function setSwapRatio (address baseCurrency, address quoteCurrency, uint256 price) external;
    function fixedRatioSwap (address fromAsset, address toAsset, uint256 quantity, address recipient) external payable returns (uint256 output);
    function oracleBasedSwap (address fromAsset, address toAsset, uint256 quantity, address recipient) external payable returns (uint256 output);
}

contract MockSwap is UUPSUpgradeable, Initializable, ISwap {
    address public oracle;
    mapping(address => mapping (address => uint256)) public prices;

    function setSwapRatio (address baseCurrency, address quoteCurrency, uint256 price) external {
        require(baseCurrency != quoteCurrency, "Same currency");

        prices[baseCurrency][quoteCurrency] = 1e36 / price;
        prices[quoteCurrency][baseCurrency] = price;
    }

    function fixedRatioSwap (address fromAsset, address toAsset, uint256 quantity, address recipient) external payable returns (uint256 output) {
        require(prices[toAsset][fromAsset] > 0, "Swap ratio undefined");

        if(fromAsset == address(0)){
            require(quantity == msg.value);
        }else{
            IERC20(fromAsset).transferFrom(msg.sender, address(this), quantity);
        }

        output = prices[toAsset][fromAsset] * quantity / 1e18;
        uint256 balance = IERC20(toAsset).balanceOf(address(this));
        if(output > balance){
            IMockToken(toAsset).mint(address(this), output - balance);
        }

        bool success;
        if(toAsset == address(0)){
            (success, ) = recipient.call{value : output}("");
        }else{
            success = IERC20(toAsset).transfer(recipient, output);
        }
    }

    function oracleBasedSwap (address fromAsset, address toAsset, uint256 quantity, address recipient) external payable returns (uint256 output) {
        bytes32[] memory topics = new bytes32[](2);
        topics[0] = keccak256(abi.encodePacked(fromAsset));
        topics[1] = keccak256(abi.encodePacked(toAsset));
        uint256[] memory oraclePrices = IOracle(oracle).getPrices(topics);

        require(oraclePrices[0] > 0 && oraclePrices[1] > 0, "Swap ratio undefined");

        if(fromAsset == address(0)){
            require(quantity == msg.value);
        }else{
            IERC20(fromAsset).transferFrom(msg.sender, address(this), quantity);
        }

        output = oraclePrices[0] * quantity / oraclePrices[1];
        uint256 balance = IERC20(toAsset).balanceOf(address(this));
        if(output > balance){
            IMockToken(toAsset).mint(address(this), output - balance);
        }

        bool success;
        if(toAsset == address(0)){
            (success, ) = recipient.call{value : output}("");
        }else{
            success = IERC20(toAsset).transfer(recipient, output);
        }
    }

    function initialize (address oracle_) public initializer {
        oracle = oracle_;
    }

    constructor () {
        _disableInitializers();
    }

    function _authorizeUpgrade (address newImplementation) internal override {}
}