import { ethers, network, tracer } from "hardhat";

const ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_unaWEMIX",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "BadSender",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "BadSetter",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "CCIPFeeTokenMismatch",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "FailedToApproveForBridging",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "FailedToApproveForSwap",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "IncorrectMsgValue",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidPath",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidSender",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidUnaWemixStation",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotEnoughAmount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotEnoughCoin",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "serviceFeeAmount",
          "type": "uint256"
        }
      ],
      "name": "NotEnoughTokenAmount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "fromToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "toToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "dstChain",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountOutMin",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "errorMessage",
          "type": "bytes"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "metaHash",
          "type": "bytes32"
        }
      ],
      "name": "SwapInFail",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "fromToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "toToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "dstChain",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountOutMin",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "metaHash",
          "type": "bytes32"
        }
      ],
      "name": "SwapInSucceed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "fromToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "toToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "dstChain",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountInMax",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "errorMessage",
          "type": "bytes"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "metaHash",
          "type": "bytes32"
        }
      ],
      "name": "SwapOutFail",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "fromToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "toToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "dstChain",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountInMax",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "metaHash",
          "type": "bytes32"
        }
      ],
      "name": "SwapOutSucceed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_bytesName",
          "type": "bytes32"
        }
      ],
      "name": "CA",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "contractRegistry",
      "outputs": [
        {
          "internalType": "contract ContractRegistry",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getUnaWEMIX",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isSetter",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "setRegistry",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_unaWEMIX",
          "type": "address"
        }
      ],
      "name": "setUnaWEMIX",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "fromToken",
              "type": "address"
            },
            {
              "internalType": "uint64",
              "name": "gasLimit",
              "type": "uint64"
            },
            {
              "internalType": "address",
              "name": "toToken",
              "type": "address"
            },
            {
              "internalType": "uint64",
              "name": "dstChain",
              "type": "uint64"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "token",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct Client.EVMTokenAmount",
              "name": "ccipFeeTokenAmountForCurrChain",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "token",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct Client.EVMTokenAmount",
              "name": "ccipFeeTokenAmountForNextChain",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountA",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountBOutMin",
              "type": "uint256"
            },
            {
              "internalType": "address[]",
              "name": "path",
              "type": "address[]"
            },
            {
              "internalType": "bytes32",
              "name": "metaHash",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "contractAddress",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "inputs",
              "type": "bytes"
            }
          ],
          "internalType": "struct UnaTypes.SwapIn",
          "name": "args",
          "type": "tuple"
        }
      ],
      "name": "swapIn",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "uint256",
          "name": "amountA",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountBOutMin",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct Client.EVMTokenAmount",
          "name": "ccipFeeTokenAmountForCurrChain",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct Client.EVMTokenAmount",
          "name": "ccipFeeTokenAmountForNextChain",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapInInternal",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "_amountOut",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "fromToken",
              "type": "address"
            },
            {
              "internalType": "uint64",
              "name": "gasLimit",
              "type": "uint64"
            },
            {
              "internalType": "address",
              "name": "toToken",
              "type": "address"
            },
            {
              "internalType": "uint64",
              "name": "dstChain",
              "type": "uint64"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "token",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct Client.EVMTokenAmount",
              "name": "ccipFeeTokenAmountForCurrChain",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "token",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct Client.EVMTokenAmount",
              "name": "ccipFeeTokenAmountForNextChain",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountAInMax",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountB",
              "type": "uint256"
            },
            {
              "internalType": "address[]",
              "name": "path",
              "type": "address[]"
            },
            {
              "internalType": "bytes32",
              "name": "metaHash",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "contractAddress",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "inputs",
              "type": "bytes"
            }
          ],
          "internalType": "struct UnaTypes.SwapOut",
          "name": "args",
          "type": "tuple"
        }
      ],
      "name": "swapOut",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "internalType": "uint256",
          "name": "amountAInMax",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountB",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct Client.EVMTokenAmount",
          "name": "ccipFeeTokenAmountForCurrChain",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "internalType": "struct Client.EVMTokenAmount",
          "name": "ccipFeeTokenAmountForNextChain",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "swapOutInternal",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "_usedAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_amountOut",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]
  

async function main() {
  const contractInterface = new ethers.Interface(ABI);
  console.log(await contractInterface.decodeFunctionData("swapIn", "0xd97495c9000000000000000000000000000000000000000000000000000000000000002000000000000000000000000043c3717c27dc2995c57fd11eba3eaa052056dfd200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bd11f630b0ba8d944dab0d1fed6ad4fc41a619aa000000000000000000000000000000000000000000000000475f3a7c1964d24900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000065e92e3d0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000004cf8170197d8f05000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000028000000000000000000000000000000000000000000000000000000000000000030000000000000000000000007d72b22a74a216af4a002a1095c8c707d6ec1c5f0000000000000000000000008e81fcc2d4a3baa0ee9044e0d7e36f59c9bba9c1000000000000000000000000bd11f630b0ba8d944dab0d1fed6ad4fc41a619aa0000000000000000000000000000000000000000000000000000000000000000"))

    // console.log(contractInterface.getError("0x26ea953d"))
  // const [operator, publisher] = await ethers.getSigners();
  await network.provider.send("hardhat_impersonateAccount", ["0x1c46a3febe569d23a77ef01a1d128c836637a3af"]);
  const publisher = await ethers.getSigner("0x1c46a3febe569d23a77ef01a1d128c836637a3af");
  const unaWEMIX = await ethers.getContractAt("MockToken", "0xf500208d9ab68fea3cc41bd107811e809c0b6b83")  
  const CROW = await ethers.getContractAt("MockToken", "0x770d9d14c4ae2f78dca810958c1d9b7ea4620289")  
  const WWEMIX = await ethers.getContractAt("MockToken", "0x7D72b22a74A216Af4a002a1095C8C707d6eC1C5f")  
  console.log(await unaWEMIX.balanceOf(publisher.address))
  console.log(await CROW.balanceOf(publisher.address))
  tracer.enabled = true;
  const tx = await publisher.sendTransaction({
    "data": contractInterface.encodeFunctionData("swapIn", [
      [
        publisher.address,
        ethers.ZeroAddress,
        0n,
        CROW.target,
        5142893604156789321n,
        [ '0x0000000000000000000000000000000000000000', 0n ],
        [ '0x0000000000000000000000000000000000000000', 0n ],
        1710472121n,
        10000000000000000n,
        0n,
        [
          WWEMIX.target,
          "0x8E81fCc2d4A3bAa0eE9044E0D7E36F59C9BbA9c1",
          CROW.target
        ],
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x'
      ]
    ]),
    "to": "0x398d227685614aaeb2e4711b048626b0551bc0ee",
    "value": 10000000000000000n,
    "from": "0x1c46a3febe569d23a77ef01a1d128c836637a3af",
    "gasPrice": "0x174876e801",
    "gasLimit": "0x0b71b0"
  })
  console.log(await tx.wait())
  tracer.enabled = false;
    console.log(await unaWEMIX.balanceOf(publisher.address))
    console.log(await CROW.balanceOf(publisher.address))
    // console.log(tracer.lastTrace())
    console.log(tracer)
    console.log(Object.keys(tracer))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function deployProxy (name, init) {
  const imple = await deployContract(name, [])
  const impleInterface = await (await ethers.getContractFactory(name)).interface
  const proxy = await deployContract("DefaultProxy", [imple.target, impleInterface.encodeFunctionData(...init)])
  return await ethers.getContractAt(name, proxy.target)
}

async function deployContract (name, args) {
  const factory = await ethers.getContractFactory(name)
  return await factory.deploy(...args)
}

