// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

contract TestV1 {
    function version () external view returns (uint256) {
        return 1;
    }
}

contract TestV2 {
    function version () external view returns (uint256) {
        return 2;
    }

    function version (uint256 check) external view returns (bool) {
        return check == 2;
    }
}