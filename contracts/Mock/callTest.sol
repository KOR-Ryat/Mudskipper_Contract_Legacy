// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

contract CallTest {
    bool public lastAnswer;
    event called ();

    function call1 (address addr, bytes memory data) external {
        (lastAnswer, ) = addr.call(data);
        emit called();
    }

    function call2 (address addr, bytes memory data) external {
        (lastAnswer, ) = addr.call{value:1}(data);
        emit called();
    }

    function call3 (address addr, bytes memory data) external {
        addr.call{value:1}(data);
        emit called();
    }

    receive () external payable {}
}

contract CallTest_N {
    function a () external {}
}

contract CallTest_PN {
    function a () external payable {}
}

contract CallTest_R {
    receive () external payable {}
}

contract CallTest_F {
    fallback () external {}
}

contract CallTest_PF {
    fallback () external payable {}
}

contract CallTest_NR {
    function a () external {
        revert();
    }
}

contract CallTest_PNR {
    function a () external payable {
        revert();
    }
}

contract CallTest_RR {
    receive () external payable {
        revert();
    }
}

contract CallTest_FR {
    fallback () external {
        revert();
    }
}

contract CallTest_PFR {
    fallback () external payable {
        revert();
    }
}