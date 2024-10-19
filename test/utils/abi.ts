export const UnaBridgeABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "unaWEMIX",
                type: "address",
            },
            {
                internalType: "address",
                name: "bridgeStorage",
                type: "address",
            },
            {
                internalType: "address",
                name: "bridgeFeeVault",
                type: "address",
            },
            {
                internalType: "address",
                name: "wrappedNative",
                type: "address",
            },
            {
                internalType: "address",
                name: "msw",
                type: "address",
            },
            {
                internalType: "uint64",
                name: "sourceChainSelector",
                type: "uint64",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "BadDstChain",
        type: "error",
    },
    {
        inputs: [],
        name: "BadPayload",
        type: "error",
    },
    {
        inputs: [],
        name: "BadReceiver",
        type: "error",
    },
    {
        inputs: [],
        name: "BadRouter",
        type: "error",
    },
    {
        inputs: [],
        name: "BadSelector",
        type: "error",
    },
    {
        inputs: [],
        name: "BadSender",
        type: "error",
    },
    {
        inputs: [],
        name: "BadSetter",
        type: "error",
    },
    {
        inputs: [],
        name: "BadTokenUri",
        type: "error",
    },
    {
        inputs: [],
        name: "BadWallet",
        type: "error",
    },
    {
        inputs: [],
        name: "CCIPFeeTokenMismatch",
        type: "error",
    },
    {
        inputs: [],
        name: "IncorrectMsgValue",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidBridgeFeeVault",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidBridgeStorage",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidChain",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidSourceChainSelector",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidUnaWEMIX",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidWallet",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidWithdrawTokenAddress",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidWrappedNative",
        type: "error",
    },
    {
        inputs: [],
        name: "MultipleTokens",
        type: "error",
    },
    {
        inputs: [],
        name: "NotAllowedContract",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "ccipFeeToRouter",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "ccipFeeAvail",
                type: "uint256",
            },
        ],
        name: "NotEnoughCCIPFee",
        type: "error",
    },
    {
        inputs: [],
        name: "NotEnoughHop",
        type: "error",
    },
    {
        inputs: [],
        name: "NotEnoughWithdrawCoinBalance",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "originalSender",
                type: "address",
            },
        ],
        name: "NotFromUnaBridge",
        type: "error",
    },
    {
        inputs: [],
        name: "NotImplemented",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "serviceFeeAmount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "serviceFeeAmountFromArgs",
                type: "uint256",
            },
        ],
        name: "ServiceFeeAmountMismatch",
        type: "error",
    },
    {
        inputs: [],
        name: "ZeroTokenPrice",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "ccipFeeToken",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "ccipFeeAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "tokenPrice",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "metaHash",
                type: "bytes32",
            },
        ],
        name: "CcipFeeRefunded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint64",
                name: "chainSelector",
                type: "uint64",
            },
        ],
        name: "ChainDisabled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint64",
                name: "chainSelector",
                type: "uint64",
            },
        ],
        name: "ChainEnabled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "messageId",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint64",
                name: "srcChain",
                type: "uint64",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "metaHash",
                type: "bytes32",
            },
        ],
        name: "EnterCoin",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "messageId",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint64",
                name: "srcChain",
                type: "uint64",
            },
            {
                indexed: false,
                internalType: "address",
                name: "dstToken",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "metaHash",
                type: "bytes32",
            },
        ],
        name: "EnterERC20",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "messageId",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint64",
                name: "srcChain",
                type: "uint64",
            },
            {
                indexed: false,
                internalType: "address",
                name: "dstToken",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "string",
                name: "tokenUri",
                type: "string",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "metaHash",
                type: "bytes32",
            },
        ],
        name: "EnterERC721",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "messageId",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
            {
                indexed: false,
                internalType: "uint64",
                name: "gasLimit",
                type: "uint64",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "token",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                ],
                indexed: false,
                internalType: "struct Client.EVMTokenAmount",
                name: "ccipFeeTokenAmountForCurrChain",
                type: "tuple",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "token",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                ],
                indexed: false,
                internalType: "struct Client.EVMTokenAmount",
                name: "ccipFeeTokenAmountForNextChain",
                type: "tuple",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "token",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                ],
                indexed: false,
                internalType: "struct Client.EVMTokenAmount",
                name: "ccipFeeTokenAmount",
                type: "tuple",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "serviceFeeAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "metaHash",
                type: "bytes32",
            },
        ],
        name: "ExitCoin",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "messageId",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
            {
                indexed: false,
                internalType: "uint64",
                name: "gasLimit",
                type: "uint64",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "token",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                ],
                indexed: false,
                internalType: "struct Client.EVMTokenAmount",
                name: "ccipFeeTokenAmountForCurrChain",
                type: "tuple",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "token",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                ],
                indexed: false,
                internalType: "struct Client.EVMTokenAmount",
                name: "ccipFeeTokenAmountForNextChain",
                type: "tuple",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "token",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                ],
                indexed: false,
                internalType: "struct Client.EVMTokenAmount",
                name: "ccipFeeTokenAmount",
                type: "tuple",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "serviceFeeAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "srcToken",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "metaHash",
                type: "bytes32",
            },
        ],
        name: "ExitERC20",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "messageId",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
            {
                indexed: false,
                internalType: "uint64",
                name: "gasLimit",
                type: "uint64",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "token",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                ],
                indexed: false,
                internalType: "struct Client.EVMTokenAmount",
                name: "ccipFeeTokenAmountForCurrChain",
                type: "tuple",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "token",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                ],
                indexed: false,
                internalType: "struct Client.EVMTokenAmount",
                name: "ccipFeeTokenAmountForNextChain",
                type: "tuple",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "token",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                ],
                indexed: false,
                internalType: "struct Client.EVMTokenAmount",
                name: "ccipFeeTokenAmount",
                type: "tuple",
            },
            {
                indexed: false,
                internalType: "address",
                name: "srcToken",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "string",
                name: "tokenUri",
                type: "string",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "metaHash",
                type: "bytes32",
            },
        ],
        name: "ExitERC721",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "messageId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bytes",
                name: "reason",
                type: "bytes",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "metaHash",
                type: "bytes32",
            },
        ],
        name: "MessageFailed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "bytes32",
                name: "messageId",
                type: "bytes32",
            },
        ],
        name: "MessageReceivedSimple",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "messageId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "metaHash",
                type: "bytes32",
            },
        ],
        name: "MessageSucceeded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "Paused",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "messageId",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "user",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint64",
                name: "srcChain",
                type: "uint64",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "metaHash",
                type: "bytes32",
            },
        ],
        name: "ReceivePayload",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "bytes32",
                name: "messageId",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "user",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
            {
                indexed: false,
                internalType: "uint64",
                name: "gasLimit",
                type: "uint64",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "token",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                ],
                indexed: false,
                internalType: "struct Client.EVMTokenAmount",
                name: "ccipFeeTokenAmountForCurrChain",
                type: "tuple",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "token",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                ],
                indexed: false,
                internalType: "struct Client.EVMTokenAmount",
                name: "ccipFeeTokenAmountForNextChain",
                type: "tuple",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "token",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                ],
                indexed: false,
                internalType: "struct Client.EVMTokenAmount",
                name: "ccipFeeTokenAmount",
                type: "tuple",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "metaHash",
                type: "bytes32",
            },
        ],
        name: "SendPayload",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "addedCnt",
                type: "uint256",
            },
        ],
        name: "TokenConfigsAdded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "removedCnt",
                type: "uint256",
            },
        ],
        name: "TokenConfigsRemoved",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "Unpaused",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "_bytesName",
                type: "bytes32",
            },
        ],
        name: "CA",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "srcToken",
                        type: "address",
                    },
                    {
                        internalType: "uint64",
                        name: "dstChain",
                        type: "uint64",
                    },
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "dstToken",
                                type: "address",
                            },
                            {
                                internalType: "enum UnaBridgeConfigs.AssetType",
                                name: "asset",
                                type: "uint8",
                            },
                            {
                                internalType: "bytes4",
                                name: "exitSelector",
                                type: "bytes4",
                            },
                            {
                                internalType: "enum UnaBridgeConfigs.LockType",
                                name: "lock",
                                type: "uint8",
                            },
                            {
                                internalType: "bytes4",
                                name: "enterSelector",
                                type: "bytes4",
                            },
                            {
                                internalType: "uint16",
                                name: "serviceFeeRel",
                                type: "uint16",
                            },
                            {
                                internalType: "uint256",
                                name: "serviceFeeAbs",
                                type: "uint256",
                            },
                        ],
                        internalType: "struct UnaBridgeConfigs.TokenConfig",
                        name: "tokenConfig",
                        type: "tuple",
                    },
                ],
                internalType: "struct UnaBridgeConfigs.TokenConfigAdd[]",
                name: "adds",
                type: "tuple[]",
            },
        ],
        name: "addTokenConfigs",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint64[]",
                name: "removes",
                type: "uint64[]",
            },
            {
                internalType: "uint64[]",
                name: "adds",
                type: "uint64[]",
            },
        ],
        name: "applyChainUpdates",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "bytes32",
                        name: "messageId",
                        type: "bytes32",
                    },
                    {
                        internalType: "uint64",
                        name: "sourceChainSelector",
                        type: "uint64",
                    },
                    {
                        internalType: "bytes",
                        name: "sender",
                        type: "bytes",
                    },
                    {
                        internalType: "bytes",
                        name: "data",
                        type: "bytes",
                    },
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "token",
                                type: "address",
                            },
                            {
                                internalType: "uint256",
                                name: "amount",
                                type: "uint256",
                            },
                        ],
                        internalType: "struct Client.EVMTokenAmount[]",
                        name: "destTokenAmounts",
                        type: "tuple[]",
                    },
                ],
                internalType: "struct Client.Any2EVMMessage",
                name: "message",
                type: "tuple",
            },
        ],
        name: "ccipReceive",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "contractRegistry",
        outputs: [
            {
                internalType: "contract ContractRegistry",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "bytes32",
                        name: "metaHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "bytes32",
                        name: "messageId",
                        type: "bytes32",
                    },
                    {
                        internalType: "uint64",
                        name: "srcChain",
                        type: "uint64",
                    },
                    {
                        internalType: "address",
                        name: "from",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "to",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "dstToken",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                ],
                internalType: "struct UnaTypes.EnterERC20",
                name: "args",
                type: "tuple",
            },
        ],
        name: "enterERC20",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "bytes32",
                        name: "metaHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "bytes32",
                        name: "messageId",
                        type: "bytes32",
                    },
                    {
                        internalType: "uint64",
                        name: "srcChain",
                        type: "uint64",
                    },
                    {
                        internalType: "address",
                        name: "from",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "to",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "dstToken",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "tokenUri",
                        type: "string",
                    },
                ],
                internalType: "struct UnaTypes.EnterERC721",
                name: "args",
                type: "tuple",
            },
        ],
        name: "enterERC721",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "from",
                        type: "address",
                    },
                    {
                        internalType: "uint64",
                        name: "dstChain",
                        type: "uint64",
                    },
                    {
                        internalType: "address",
                        name: "to",
                        type: "address",
                    },
                    {
                        internalType: "uint64",
                        name: "gasLimit",
                        type: "uint64",
                    },
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "token",
                                type: "address",
                            },
                            {
                                internalType: "uint256",
                                name: "amount",
                                type: "uint256",
                            },
                        ],
                        internalType: "struct Client.EVMTokenAmount",
                        name: "ccipFeeTokenAmountForCurrChain",
                        type: "tuple",
                    },
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "token",
                                type: "address",
                            },
                            {
                                internalType: "uint256",
                                name: "amount",
                                type: "uint256",
                            },
                        ],
                        internalType: "struct Client.EVMTokenAmount",
                        name: "ccipFeeTokenAmountForNextChain",
                        type: "tuple",
                    },
                    {
                        internalType: "uint256",
                        name: "totalAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "bridgedAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "srcToken",
                        type: "address",
                    },
                    {
                        internalType: "bytes32",
                        name: "metaHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "address",
                        name: "contractAddress",
                        type: "address",
                    },
                    {
                        internalType: "bytes",
                        name: "inputs",
                        type: "bytes",
                    },
                ],
                internalType: "struct UnaTypes.ExitERC20",
                name: "args",
                type: "tuple",
            },
        ],
        name: "exitERC20",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "from",
                        type: "address",
                    },
                    {
                        internalType: "uint64",
                        name: "dstChain",
                        type: "uint64",
                    },
                    {
                        internalType: "address",
                        name: "to",
                        type: "address",
                    },
                    {
                        internalType: "uint64",
                        name: "gasLimit",
                        type: "uint64",
                    },
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "token",
                                type: "address",
                            },
                            {
                                internalType: "uint256",
                                name: "amount",
                                type: "uint256",
                            },
                        ],
                        internalType: "struct Client.EVMTokenAmount",
                        name: "ccipFeeTokenAmountForCurrChain",
                        type: "tuple",
                    },
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "token",
                                type: "address",
                            },
                            {
                                internalType: "uint256",
                                name: "amount",
                                type: "uint256",
                            },
                        ],
                        internalType: "struct Client.EVMTokenAmount",
                        name: "ccipFeeTokenAmountForNextChain",
                        type: "tuple",
                    },
                    {
                        internalType: "address",
                        name: "srcToken",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "tokenBaseUri",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "tokenUri",
                        type: "string",
                    },
                    {
                        internalType: "bytes32",
                        name: "metaHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "address",
                        name: "contractAddress",
                        type: "address",
                    },
                    {
                        internalType: "bytes",
                        name: "inputs",
                        type: "bytes",
                    },
                ],
                internalType: "struct UnaTypes.ExitERC721",
                name: "args",
                type: "tuple",
            },
        ],
        name: "exitERC721",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "getBridgeFeeVault",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getBridgeStorage",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
            {
                internalType: "address",
                name: "dstReceiver",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "payload",
                type: "bytes",
            },
            {
                internalType: "uint64",
                name: "gasLimit",
                type: "uint64",
            },
            {
                internalType: "address",
                name: "ccipFeeToken",
                type: "address",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "token",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                ],
                internalType: "struct Client.EVMTokenAmount[]",
                name: "tokenAmounts",
                type: "tuple[]",
            },
        ],
        name: "getCcipFee",
        outputs: [
            {
                internalType: "uint256",
                name: "fee",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint64",
                name: "chainSelector",
                type: "uint64",
            },
        ],
        name: "getChainEnabled",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
        ],
        name: "getDstReceiver",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getIsCcipFeeDelegated",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getMsw",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getRouter",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getSourceChainSelector",
        outputs: [
            {
                internalType: "uint64",
                name: "",
                type: "uint64",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
            {
                internalType: "address",
                name: "dstReceiver",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "payload",
                type: "bytes",
            },
            {
                internalType: "uint64",
                name: "gasLimit",
                type: "uint64",
            },
            {
                internalType: "address",
                name: "ccipFeeToken",
                type: "address",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "token",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                ],
                internalType: "struct Client.EVMTokenAmount[]",
                name: "tokenAmounts",
                type: "tuple[]",
            },
        ],
        name: "getTotalFee",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getUnaWEMIX",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getWrappedNative",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "isCcipFeeDelegated",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "isFromCcipRouter",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "isSetter",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint64",
                name: "gasLimit",
                type: "uint64",
            },
        ],
        name: "makeExtraArgs",
        outputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        name: "onERC721Received",
        outputs: [
            {
                internalType: "bytes4",
                name: "",
                type: "bytes4",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "pause",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "paused",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "srcToken",
                        type: "address",
                    },
                    {
                        internalType: "uint64",
                        name: "dstChain",
                        type: "uint64",
                    },
                ],
                internalType: "struct UnaBridgeConfigs.TokenConfigRemove[]",
                name: "removes",
                type: "tuple[]",
            },
        ],
        name: "removeTokenConfigs",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "bridgeFeeVault",
                type: "address",
            },
        ],
        name: "setBridgeFeeVault",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "bridgeStorage",
                type: "address",
            },
        ],
        name: "setBridgeStorage",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
            {
                internalType: "address",
                name: "receiver",
                type: "address",
            },
        ],
        name: "setDstReceiver",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bool",
                name: "isCcipFeeDelegated",
                type: "bool",
            },
        ],
        name: "setIsCcipFeeDelegated",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "msw",
                type: "address",
            },
        ],
        name: "setMsw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_address",
                type: "address",
            },
        ],
        name: "setRegistry",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "unaWEMIX",
                type: "address",
            },
        ],
        name: "setUnaWEMIX",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "wrappedNative",
                type: "address",
            },
        ],
        name: "setWrappedNative",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
            },
        ],
        name: "supportsInterface",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "unpause",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "withdrawCoin",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "withdrawToken",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        stateMutability: "payable",
        type: "receive",
    },
];

export const UnaBridgeStorageABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "msw",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "bridge",
                type: "address",
            },
        ],
        name: "BadBridge",
        type: "error",
    },
    {
        inputs: [],
        name: "BadSetter",
        type: "error",
    },
    {
        inputs: [],
        name: "BadWallet",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "serviceFeeRel",
                type: "uint256",
            },
        ],
        name: "ExccessiveServiceFeeRel",
        type: "error",
    },
    {
        inputs: [],
        name: "InconsistentInternalStates",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "bridge",
                type: "address",
            },
        ],
        name: "InvalidBridge",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "srcToken",
                type: "address",
            },
            {
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
        ],
        name: "InvalidTokenConfig",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidWallet",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidWithdrawTokenAddress",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "serviceFeeAmount",
                type: "uint256",
            },
        ],
        name: "NotEnoughTokenAmount",
        type: "error",
    },
    {
        inputs: [],
        name: "NotEnoughWithdrawCoinBalance",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
        ],
        name: "TokenLocked",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "srcToken",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "dstToken",
                        type: "address",
                    },
                    {
                        internalType: "enum UnaBridgeConfigs.AssetType",
                        name: "asset",
                        type: "uint8",
                    },
                    {
                        internalType: "bytes4",
                        name: "exitSelector",
                        type: "bytes4",
                    },
                    {
                        internalType: "enum UnaBridgeConfigs.LockType",
                        name: "lock",
                        type: "uint8",
                    },
                    {
                        internalType: "bytes4",
                        name: "enterSelector",
                        type: "bytes4",
                    },
                    {
                        internalType: "uint16",
                        name: "serviceFeeRel",
                        type: "uint16",
                    },
                    {
                        internalType: "uint256",
                        name: "serviceFeeAbs",
                        type: "uint256",
                    },
                ],
                indexed: false,
                internalType: "struct UnaBridgeConfigs.TokenConfig",
                name: "config",
                type: "tuple",
            },
        ],
        name: "TokenConfigAdded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "srcToken",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
        ],
        name: "TokenConfigRemoved",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "_bytesName",
                type: "bytes32",
            },
        ],
        name: "CA",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "srcToken",
                        type: "address",
                    },
                    {
                        internalType: "uint64",
                        name: "dstChain",
                        type: "uint64",
                    },
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "dstToken",
                                type: "address",
                            },
                            {
                                internalType: "enum UnaBridgeConfigs.AssetType",
                                name: "asset",
                                type: "uint8",
                            },
                            {
                                internalType: "bytes4",
                                name: "exitSelector",
                                type: "bytes4",
                            },
                            {
                                internalType: "enum UnaBridgeConfigs.LockType",
                                name: "lock",
                                type: "uint8",
                            },
                            {
                                internalType: "bytes4",
                                name: "enterSelector",
                                type: "bytes4",
                            },
                            {
                                internalType: "uint16",
                                name: "serviceFeeRel",
                                type: "uint16",
                            },
                            {
                                internalType: "uint256",
                                name: "serviceFeeAbs",
                                type: "uint256",
                            },
                        ],
                        internalType: "struct UnaBridgeConfigs.TokenConfig",
                        name: "tokenConfig",
                        type: "tuple",
                    },
                ],
                internalType: "struct UnaBridgeConfigs.TokenConfigAdd[]",
                name: "adds",
                type: "tuple[]",
            },
        ],
        name: "addTokenConfigs",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "srcToken",
                type: "address",
            },
            {
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
        ],
        name: "checkTokenUnlocked",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "contractRegistry",
        outputs: [
            {
                internalType: "contract ContractRegistry",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getBridge",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "srcToken",
                type: "address",
            },
        ],
        name: "getDstChainsBySrcToken",
        outputs: [
            {
                internalType: "uint64[]",
                name: "",
                type: "uint64[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getMsw",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "totalAmount",
                type: "uint256",
            },
            {
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
        ],
        name: "getServiceFee",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getSrcTokens",
        outputs: [
            {
                internalType: "address[]",
                name: "",
                type: "address[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
        ],
        name: "getSrcTokensByDstChain",
        outputs: [
            {
                internalType: "address[]",
                name: "",
                type: "address[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "srcToken",
                type: "address",
            },
            {
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
        ],
        name: "getTokenConfig",
        outputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "dstToken",
                        type: "address",
                    },
                    {
                        internalType: "enum UnaBridgeConfigs.AssetType",
                        name: "asset",
                        type: "uint8",
                    },
                    {
                        internalType: "bytes4",
                        name: "exitSelector",
                        type: "bytes4",
                    },
                    {
                        internalType: "enum UnaBridgeConfigs.LockType",
                        name: "lock",
                        type: "uint8",
                    },
                    {
                        internalType: "bytes4",
                        name: "enterSelector",
                        type: "bytes4",
                    },
                    {
                        internalType: "uint16",
                        name: "serviceFeeRel",
                        type: "uint16",
                    },
                    {
                        internalType: "uint256",
                        name: "serviceFeeAbs",
                        type: "uint256",
                    },
                ],
                internalType: "struct UnaBridgeConfigs.TokenConfig",
                name: "tokenConfig",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
        ],
        name: "getUnlockedTokenConfig",
        outputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "dstToken",
                        type: "address",
                    },
                    {
                        internalType: "enum UnaBridgeConfigs.AssetType",
                        name: "asset",
                        type: "uint8",
                    },
                    {
                        internalType: "bytes4",
                        name: "exitSelector",
                        type: "bytes4",
                    },
                    {
                        internalType: "enum UnaBridgeConfigs.LockType",
                        name: "lock",
                        type: "uint8",
                    },
                    {
                        internalType: "bytes4",
                        name: "enterSelector",
                        type: "bytes4",
                    },
                    {
                        internalType: "uint16",
                        name: "serviceFeeRel",
                        type: "uint16",
                    },
                    {
                        internalType: "uint256",
                        name: "serviceFeeAbs",
                        type: "uint256",
                    },
                ],
                internalType: "struct UnaBridgeConfigs.TokenConfig",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "account",
                type: "address",
            },
        ],
        name: "isSetter",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "srcToken",
                        type: "address",
                    },
                    {
                        internalType: "uint64",
                        name: "dstChain",
                        type: "uint64",
                    },
                ],
                internalType: "struct UnaBridgeConfigs.TokenConfigRemove[]",
                name: "removes",
                type: "tuple[]",
            },
        ],
        name: "removeTokenConfigs",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "bridge",
                type: "address",
            },
        ],
        name: "setBridge",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "msw",
                type: "address",
            },
        ],
        name: "setMsw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_address",
                type: "address",
            },
        ],
        name: "setRegistry",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "srcToken",
                type: "address",
            },
            {
                internalType: "uint64",
                name: "dstChain",
                type: "uint64",
            },
        ],
        name: "tokenConfigExists",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "withdrawCoin",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "withdrawToken",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        stateMutability: "payable",
        type: "receive",
    },
];

export const PancakeSwapRouterABI = [
    {
        inputs: [
            { internalType: "address", name: "_factoryV2", type: "address" },
            { internalType: "address", name: "_deployer", type: "address" },
            { internalType: "address", name: "_factoryV3", type: "address" },
            { internalType: "address", name: "_positionManager", type: "address" },
            { internalType: "address", name: "_stableFactory", type: "address" },
            { internalType: "address", name: "_stableInfo", type: "address" },
            { internalType: "address", name: "_WETH9", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "factory",
                type: "address",
            },
            { indexed: true, internalType: "address", name: "info", type: "address" },
        ],
        name: "SetStableSwap",
        type: "event",
    },
    {
        inputs: [],
        name: "WETH9",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "token", type: "address" }],
        name: "approveMax",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "token", type: "address" }],
        name: "approveMaxMinusOne",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "token", type: "address" }],
        name: "approveZeroThenMax",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "token", type: "address" }],
        name: "approveZeroThenMaxMinusOne",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "callPositionManager",
        outputs: [{ internalType: "bytes", name: "result", type: "bytes" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes[]", name: "paths", type: "bytes[]" },
            { internalType: "uint128[]", name: "amounts", type: "uint128[]" },
            { internalType: "uint24", name: "maximumTickDivergence", type: "uint24" },
            { internalType: "uint32", name: "secondsAgo", type: "uint32" },
        ],
        name: "checkOracleSlippage",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "path", type: "bytes" },
            { internalType: "uint24", name: "maximumTickDivergence", type: "uint24" },
            { internalType: "uint32", name: "secondsAgo", type: "uint32" },
        ],
        name: "checkOracleSlippage",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "deployer",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "bytes", name: "path", type: "bytes" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "uint256", name: "amountIn", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "amountOutMinimum",
                        type: "uint256",
                    },
                ],
                internalType: "struct IV3SwapRouter.ExactInputParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactInput",
        outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "tokenIn", type: "address" },
                    { internalType: "address", name: "tokenOut", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "uint256", name: "amountIn", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "amountOutMinimum",
                        type: "uint256",
                    },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IV3SwapRouter.ExactInputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactInputSingle",
        outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address[]", name: "path", type: "address[]" },
            { internalType: "uint256[]", name: "flag", type: "uint256[]" },
            { internalType: "uint256", name: "amountIn", type: "uint256" },
            { internalType: "uint256", name: "amountOutMin", type: "uint256" },
            { internalType: "address", name: "to", type: "address" },
        ],
        name: "exactInputStableSwap",
        outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "bytes", name: "path", type: "bytes" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "uint256", name: "amountOut", type: "uint256" },
                    { internalType: "uint256", name: "amountInMaximum", type: "uint256" },
                ],
                internalType: "struct IV3SwapRouter.ExactOutputParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactOutput",
        outputs: [{ internalType: "uint256", name: "amountIn", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "tokenIn", type: "address" },
                    { internalType: "address", name: "tokenOut", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "uint256", name: "amountOut", type: "uint256" },
                    { internalType: "uint256", name: "amountInMaximum", type: "uint256" },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IV3SwapRouter.ExactOutputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactOutputSingle",
        outputs: [{ internalType: "uint256", name: "amountIn", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address[]", name: "path", type: "address[]" },
            { internalType: "uint256[]", name: "flag", type: "uint256[]" },
            { internalType: "uint256", name: "amountOut", type: "uint256" },
            { internalType: "uint256", name: "amountInMax", type: "uint256" },
            { internalType: "address", name: "to", type: "address" },
        ],
        name: "exactOutputStableSwap",
        outputs: [{ internalType: "uint256", name: "amountIn", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "factory",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "factoryV2",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "getApprovalType",
        outputs: [
            {
                internalType: "enum IApproveAndCall.ApprovalType",
                name: "",
                type: "uint8",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "token0", type: "address" },
                    { internalType: "address", name: "token1", type: "address" },
                    { internalType: "uint256", name: "tokenId", type: "uint256" },
                    { internalType: "uint256", name: "amount0Min", type: "uint256" },
                    { internalType: "uint256", name: "amount1Min", type: "uint256" },
                ],
                internalType: "struct IApproveAndCall.IncreaseLiquidityParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "increaseLiquidity",
        outputs: [{ internalType: "bytes", name: "result", type: "bytes" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "token0", type: "address" },
                    { internalType: "address", name: "token1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "uint256", name: "amount0Min", type: "uint256" },
                    { internalType: "uint256", name: "amount1Min", type: "uint256" },
                    { internalType: "address", name: "recipient", type: "address" },
                ],
                internalType: "struct IApproveAndCall.MintParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "mint",
        outputs: [{ internalType: "bytes", name: "result", type: "bytes" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "previousBlockhash", type: "bytes32" },
            { internalType: "bytes[]", name: "data", type: "bytes[]" },
        ],
        name: "multicall",
        outputs: [{ internalType: "bytes[]", name: "", type: "bytes[]" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "deadline", type: "uint256" },
            { internalType: "bytes[]", name: "data", type: "bytes[]" },
        ],
        name: "multicall",
        outputs: [{ internalType: "bytes[]", name: "", type: "bytes[]" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes[]", name: "data", type: "bytes[]" }],
        name: "multicall",
        outputs: [{ internalType: "bytes[]", name: "results", type: "bytes[]" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "int256", name: "amount0Delta", type: "int256" },
            { internalType: "int256", name: "amount1Delta", type: "int256" },
            { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        name: "pancakeV3SwapCallback",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "positionManager",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "pull",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "refundETH",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "selfPermit",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "nonce", type: "uint256" },
            { internalType: "uint256", name: "expiry", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "selfPermitAllowed",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "nonce", type: "uint256" },
            { internalType: "uint256", name: "expiry", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "selfPermitAllowedIfNecessary",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "selfPermitIfNecessary",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_factory", type: "address" },
            { internalType: "address", name: "_info", type: "address" },
        ],
        name: "setStableSwap",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "stableSwapFactory",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "stableSwapInfo",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "amountIn", type: "uint256" },
            { internalType: "uint256", name: "amountOutMin", type: "uint256" },
            { internalType: "address[]", name: "path", type: "address[]" },
            { internalType: "address", name: "to", type: "address" },
        ],
        name: "swapExactTokensForTokens",
        outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "amountOut", type: "uint256" },
            { internalType: "uint256", name: "amountInMax", type: "uint256" },
            { internalType: "address[]", name: "path", type: "address[]" },
            { internalType: "address", name: "to", type: "address" },
        ],
        name: "swapTokensForExactTokens",
        outputs: [{ internalType: "uint256", name: "amountIn", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
        ],
        name: "sweepToken",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
        ],
        name: "sweepToken",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "uint256", name: "feeBips", type: "uint256" },
            { internalType: "address", name: "feeRecipient", type: "address" },
        ],
        name: "sweepTokenWithFee",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint256", name: "feeBips", type: "uint256" },
            { internalType: "address", name: "feeRecipient", type: "address" },
        ],
        name: "sweepTokenWithFee",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
        ],
        name: "unwrapWETH9",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint256", name: "feeBips", type: "uint256" },
            { internalType: "address", name: "feeRecipient", type: "address" },
        ],
        name: "unwrapWETH9WithFee",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "uint256", name: "feeBips", type: "uint256" },
            { internalType: "address", name: "feeRecipient", type: "address" },
        ],
        name: "unwrapWETH9WithFee",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
        name: "wrapETH",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

export const PancakeSwapQuoterABI = [
    {
        inputs: [
            { internalType: "address", name: "_deployer", type: "address" },
            { internalType: "address", name: "_factory", type: "address" },
            { internalType: "address", name: "_WETH9", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "WETH9",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "deployer",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "factory",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "int256", name: "amount0Delta", type: "int256" },
            { internalType: "int256", name: "amount1Delta", type: "int256" },
            { internalType: "bytes", name: "path", type: "bytes" },
        ],
        name: "pancakeV3SwapCallback",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "path", type: "bytes" },
            { internalType: "uint256", name: "amountIn", type: "uint256" },
        ],
        name: "quoteExactInput",
        outputs: [
            { internalType: "uint256", name: "amountOut", type: "uint256" },
            { internalType: "uint160[]", name: "sqrtPriceX96AfterList", type: "uint160[]" },
            { internalType: "uint32[]", name: "initializedTicksCrossedList", type: "uint32[]" },
            { internalType: "uint256", name: "gasEstimate", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "tokenIn", type: "address" },
                    { internalType: "address", name: "tokenOut", type: "address" },
                    { internalType: "uint256", name: "amountIn", type: "uint256" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "uint160", name: "sqrtPriceLimitX96", type: "uint160" },
                ],
                internalType: "struct IQuoterV2.QuoteExactInputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "quoteExactInputSingle",
        outputs: [
            { internalType: "uint256", name: "amountOut", type: "uint256" },
            { internalType: "uint160", name: "sqrtPriceX96After", type: "uint160" },
            { internalType: "uint32", name: "initializedTicksCrossed", type: "uint32" },
            { internalType: "uint256", name: "gasEstimate", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "path", type: "bytes" },
            { internalType: "uint256", name: "amountOut", type: "uint256" },
        ],
        name: "quoteExactOutput",
        outputs: [
            { internalType: "uint256", name: "amountIn", type: "uint256" },
            { internalType: "uint160[]", name: "sqrtPriceX96AfterList", type: "uint160[]" },
            { internalType: "uint32[]", name: "initializedTicksCrossedList", type: "uint32[]" },
            { internalType: "uint256", name: "gasEstimate", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "tokenIn", type: "address" },
                    { internalType: "address", name: "tokenOut", type: "address" },
                    { internalType: "uint256", name: "amount", type: "uint256" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "uint160", name: "sqrtPriceLimitX96", type: "uint160" },
                ],
                internalType: "struct IQuoterV2.QuoteExactOutputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "quoteExactOutputSingle",
        outputs: [
            { internalType: "uint256", name: "amountIn", type: "uint256" },
            { internalType: "uint160", name: "sqrtPriceX96After", type: "uint160" },
            { internalType: "uint32", name: "initializedTicksCrossed", type: "uint32" },
            { internalType: "uint256", name: "gasEstimate", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
];

export const UniswapRouterABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_factoryV2",
                type: "address",
            },
            {
                internalType: "address",
                name: "factoryV3",
                type: "address",
            },
            {
                internalType: "address",
                name: "_positionManager",
                type: "address",
            },
            {
                internalType: "address",
                name: "_WETH9",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "WETH9",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
        ],
        name: "approveMax",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
        ],
        name: "approveMaxMinusOne",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
        ],
        name: "approveZeroThenMax",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
        ],
        name: "approveZeroThenMaxMinusOne",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "data",
                type: "bytes",
            },
        ],
        name: "callPositionManager",
        outputs: [
            {
                internalType: "bytes",
                name: "result",
                type: "bytes",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes[]",
                name: "paths",
                type: "bytes[]",
            },
            {
                internalType: "uint128[]",
                name: "amounts",
                type: "uint128[]",
            },
            {
                internalType: "uint24",
                name: "maximumTickDivergence",
                type: "uint24",
            },
            {
                internalType: "uint32",
                name: "secondsAgo",
                type: "uint32",
            },
        ],
        name: "checkOracleSlippage",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "path",
                type: "bytes",
            },
            {
                internalType: "uint24",
                name: "maximumTickDivergence",
                type: "uint24",
            },
            {
                internalType: "uint32",
                name: "secondsAgo",
                type: "uint32",
            },
        ],
        name: "checkOracleSlippage",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "bytes",
                        name: "path",
                        type: "bytes",
                    },
                    {
                        internalType: "address",
                        name: "recipient",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amountIn",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "amountOutMinimum",
                        type: "uint256",
                    },
                ],
                internalType: "struct IV3SwapRouter.ExactInputParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactInput",
        outputs: [
            {
                internalType: "uint256",
                name: "amountOut",
                type: "uint256",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "tokenIn",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "tokenOut",
                        type: "address",
                    },
                    {
                        internalType: "uint24",
                        name: "fee",
                        type: "uint24",
                    },
                    {
                        internalType: "address",
                        name: "recipient",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amountIn",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "amountOutMinimum",
                        type: "uint256",
                    },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IV3SwapRouter.ExactInputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactInputSingle",
        outputs: [
            {
                internalType: "uint256",
                name: "amountOut",
                type: "uint256",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "bytes",
                        name: "path",
                        type: "bytes",
                    },
                    {
                        internalType: "address",
                        name: "recipient",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amountOut",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "amountInMaximum",
                        type: "uint256",
                    },
                ],
                internalType: "struct IV3SwapRouter.ExactOutputParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactOutput",
        outputs: [
            {
                internalType: "uint256",
                name: "amountIn",
                type: "uint256",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "tokenIn",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "tokenOut",
                        type: "address",
                    },
                    {
                        internalType: "uint24",
                        name: "fee",
                        type: "uint24",
                    },
                    {
                        internalType: "address",
                        name: "recipient",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amountOut",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "amountInMaximum",
                        type: "uint256",
                    },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IV3SwapRouter.ExactOutputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactOutputSingle",
        outputs: [
            {
                internalType: "uint256",
                name: "amountIn",
                type: "uint256",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "factory",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "factoryV2",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "getApprovalType",
        outputs: [
            {
                internalType: "enum IApproveAndCall.ApprovalType",
                name: "",
                type: "uint8",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "token0",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "token1",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "amount0Min",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "amount1Min",
                        type: "uint256",
                    },
                ],
                internalType: "struct IApproveAndCall.IncreaseLiquidityParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "increaseLiquidity",
        outputs: [
            {
                internalType: "bytes",
                name: "result",
                type: "bytes",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "token0",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "token1",
                        type: "address",
                    },
                    {
                        internalType: "uint24",
                        name: "fee",
                        type: "uint24",
                    },
                    {
                        internalType: "int24",
                        name: "tickLower",
                        type: "int24",
                    },
                    {
                        internalType: "int24",
                        name: "tickUpper",
                        type: "int24",
                    },
                    {
                        internalType: "uint256",
                        name: "amount0Min",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "amount1Min",
                        type: "uint256",
                    },
                    {
                        internalType: "address",
                        name: "recipient",
                        type: "address",
                    },
                ],
                internalType: "struct IApproveAndCall.MintParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "mint",
        outputs: [
            {
                internalType: "bytes",
                name: "result",
                type: "bytes",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "previousBlockhash",
                type: "bytes32",
            },
            {
                internalType: "bytes[]",
                name: "data",
                type: "bytes[]",
            },
        ],
        name: "multicall",
        outputs: [
            {
                internalType: "bytes[]",
                name: "",
                type: "bytes[]",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "deadline",
                type: "uint256",
            },
            {
                internalType: "bytes[]",
                name: "data",
                type: "bytes[]",
            },
        ],
        name: "multicall",
        outputs: [
            {
                internalType: "bytes[]",
                name: "",
                type: "bytes[]",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes[]",
                name: "data",
                type: "bytes[]",
            },
        ],
        name: "multicall",
        outputs: [
            {
                internalType: "bytes[]",
                name: "results",
                type: "bytes[]",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "positionManager",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "pull",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "refundETH",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "deadline",
                type: "uint256",
            },
            {
                internalType: "uint8",
                name: "v",
                type: "uint8",
            },
            {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
            },
        ],
        name: "selfPermit",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "nonce",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "expiry",
                type: "uint256",
            },
            {
                internalType: "uint8",
                name: "v",
                type: "uint8",
            },
            {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
            },
        ],
        name: "selfPermitAllowed",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "nonce",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "expiry",
                type: "uint256",
            },
            {
                internalType: "uint8",
                name: "v",
                type: "uint8",
            },
            {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
            },
        ],
        name: "selfPermitAllowedIfNecessary",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "deadline",
                type: "uint256",
            },
            {
                internalType: "uint8",
                name: "v",
                type: "uint8",
            },
            {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
            },
        ],
        name: "selfPermitIfNecessary",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "amountIn",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "amountOutMin",
                type: "uint256",
            },
            {
                internalType: "address[]",
                name: "path",
                type: "address[]",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
        ],
        name: "swapExactTokensForTokens",
        outputs: [
            {
                internalType: "uint256",
                name: "amountOut",
                type: "uint256",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "amountOut",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "amountInMax",
                type: "uint256",
            },
            {
                internalType: "address[]",
                name: "path",
                type: "address[]",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
        ],
        name: "swapTokensForExactTokens",
        outputs: [
            {
                internalType: "uint256",
                name: "amountIn",
                type: "uint256",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amountMinimum",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "recipient",
                type: "address",
            },
        ],
        name: "sweepToken",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amountMinimum",
                type: "uint256",
            },
        ],
        name: "sweepToken",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amountMinimum",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "feeBips",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "feeRecipient",
                type: "address",
            },
        ],
        name: "sweepTokenWithFee",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amountMinimum",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "recipient",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "feeBips",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "feeRecipient",
                type: "address",
            },
        ],
        name: "sweepTokenWithFee",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "int256",
                name: "amount0Delta",
                type: "int256",
            },
            {
                internalType: "int256",
                name: "amount1Delta",
                type: "int256",
            },
            {
                internalType: "bytes",
                name: "_data",
                type: "bytes",
            },
        ],
        name: "uniswapV3SwapCallback",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "amountMinimum",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "recipient",
                type: "address",
            },
        ],
        name: "unwrapWETH9",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "amountMinimum",
                type: "uint256",
            },
        ],
        name: "unwrapWETH9",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "amountMinimum",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "recipient",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "feeBips",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "feeRecipient",
                type: "address",
            },
        ],
        name: "unwrapWETH9WithFee",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "amountMinimum",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "feeBips",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "feeRecipient",
                type: "address",
            },
        ],
        name: "unwrapWETH9WithFee",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "wrapETH",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        stateMutability: "payable",
        type: "receive",
    },
];

export const UniswapQuoterABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_factory",
                type: "address",
            },
            {
                internalType: "address",
                name: "_WETH9",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "WETH9",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "factory",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "path",
                type: "bytes",
            },
            {
                internalType: "uint256",
                name: "amountIn",
                type: "uint256",
            },
        ],
        name: "quoteExactInput",
        outputs: [
            {
                internalType: "uint256",
                name: "amountOut",
                type: "uint256",
            },
            {
                internalType: "uint160[]",
                name: "sqrtPriceX96AfterList",
                type: "uint160[]",
            },
            {
                internalType: "uint32[]",
                name: "initializedTicksCrossedList",
                type: "uint32[]",
            },
            {
                internalType: "uint256",
                name: "gasEstimate",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "tokenIn",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "tokenOut",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amountIn",
                        type: "uint256",
                    },
                    {
                        internalType: "uint24",
                        name: "fee",
                        type: "uint24",
                    },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IQuoterV2.QuoteExactInputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "quoteExactInputSingle",
        outputs: [
            {
                internalType: "uint256",
                name: "amountOut",
                type: "uint256",
            },
            {
                internalType: "uint160",
                name: "sqrtPriceX96After",
                type: "uint160",
            },
            {
                internalType: "uint32",
                name: "initializedTicksCrossed",
                type: "uint32",
            },
            {
                internalType: "uint256",
                name: "gasEstimate",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "path",
                type: "bytes",
            },
            {
                internalType: "uint256",
                name: "amountOut",
                type: "uint256",
            },
        ],
        name: "quoteExactOutput",
        outputs: [
            {
                internalType: "uint256",
                name: "amountIn",
                type: "uint256",
            },
            {
                internalType: "uint160[]",
                name: "sqrtPriceX96AfterList",
                type: "uint160[]",
            },
            {
                internalType: "uint32[]",
                name: "initializedTicksCrossedList",
                type: "uint32[]",
            },
            {
                internalType: "uint256",
                name: "gasEstimate",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "tokenIn",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "tokenOut",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                    },
                    {
                        internalType: "uint24",
                        name: "fee",
                        type: "uint24",
                    },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IQuoterV2.QuoteExactOutputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "quoteExactOutputSingle",
        outputs: [
            {
                internalType: "uint256",
                name: "amountIn",
                type: "uint256",
            },
            {
                internalType: "uint160",
                name: "sqrtPriceX96After",
                type: "uint160",
            },
            {
                internalType: "uint32",
                name: "initializedTicksCrossed",
                type: "uint32",
            },
            {
                internalType: "uint256",
                name: "gasEstimate",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "int256",
                name: "amount0Delta",
                type: "int256",
            },
            {
                internalType: "int256",
                name: "amount1Delta",
                type: "int256",
            },
            {
                internalType: "bytes",
                name: "path",
                type: "bytes",
            },
        ],
        name: "uniswapV3SwapCallback",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
];

export const QuickSwapRouterABI = [
    {
        inputs: [
            { internalType: "address", name: "_factory", type: "address" },
            { internalType: "address", name: "_WNativeToken", type: "address" },
            { internalType: "address", name: "_poolDeployer", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "WNativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "int256", name: "amount0Delta", type: "int256" },
            { internalType: "int256", name: "amount1Delta", type: "int256" },
            { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        name: "algebraSwapCallback",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "bytes", name: "path", type: "bytes" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                    { internalType: "uint256", name: "amountIn", type: "uint256" },
                    { internalType: "uint256", name: "amountOutMinimum", type: "uint256" },
                ],
                internalType: "struct ISwapRouter.ExactInputParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactInput",
        outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "tokenIn", type: "address" },
                    { internalType: "address", name: "tokenOut", type: "address" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                    { internalType: "uint256", name: "amountIn", type: "uint256" },
                    { internalType: "uint256", name: "amountOutMinimum", type: "uint256" },
                    { internalType: "uint160", name: "limitSqrtPrice", type: "uint160" },
                ],
                internalType: "struct ISwapRouter.ExactInputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactInputSingle",
        outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "tokenIn", type: "address" },
                    { internalType: "address", name: "tokenOut", type: "address" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                    { internalType: "uint256", name: "amountIn", type: "uint256" },
                    { internalType: "uint256", name: "amountOutMinimum", type: "uint256" },
                    { internalType: "uint160", name: "limitSqrtPrice", type: "uint160" },
                ],
                internalType: "struct ISwapRouter.ExactInputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactInputSingleSupportingFeeOnTransferTokens",
        outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "bytes", name: "path", type: "bytes" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                    { internalType: "uint256", name: "amountOut", type: "uint256" },
                    { internalType: "uint256", name: "amountInMaximum", type: "uint256" },
                ],
                internalType: "struct ISwapRouter.ExactOutputParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactOutput",
        outputs: [{ internalType: "uint256", name: "amountIn", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "tokenIn", type: "address" },
                    { internalType: "address", name: "tokenOut", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "address", name: "recipient", type: "address" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                    { internalType: "uint256", name: "amountOut", type: "uint256" },
                    { internalType: "uint256", name: "amountInMaximum", type: "uint256" },
                    { internalType: "uint160", name: "limitSqrtPrice", type: "uint160" },
                ],
                internalType: "struct ISwapRouter.ExactOutputSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "exactOutputSingle",
        outputs: [{ internalType: "uint256", name: "amountIn", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "factory",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes[]", name: "data", type: "bytes[]" }],
        name: "multicall",
        outputs: [{ internalType: "bytes[]", name: "results", type: "bytes[]" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "poolDeployer",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    { inputs: [], name: "refundNativeToken", outputs: [], stateMutability: "payable", type: "function" },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "selfPermit",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "nonce", type: "uint256" },
            { internalType: "uint256", name: "expiry", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "selfPermitAllowed",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "nonce", type: "uint256" },
            { internalType: "uint256", name: "expiry", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "selfPermitAllowedIfNecessary",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "selfPermitIfNecessary",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
        ],
        name: "sweepToken",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint256", name: "feeBips", type: "uint256" },
            { internalType: "address", name: "feeRecipient", type: "address" },
        ],
        name: "sweepTokenWithFee",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
        ],
        name: "unwrapWNativeToken",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "amountMinimum", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint256", name: "feeBips", type: "uint256" },
            { internalType: "address", name: "feeRecipient", type: "address" },
        ],
        name: "unwrapWNativeTokenWithFee",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

export const QuickSwapQuoterABI = [
    {
        inputs: [
            { internalType: "address", name: "_factory", type: "address" },
            { internalType: "address", name: "_WNativeToken", type: "address" },
            { internalType: "address", name: "_poolDeployer", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "WNativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "int256", name: "amount0Delta", type: "int256" },
            { internalType: "int256", name: "amount1Delta", type: "int256" },
            { internalType: "bytes", name: "path", type: "bytes" },
        ],
        name: "algebraSwapCallback",
        outputs: [],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "factory",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolDeployer",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "path", type: "bytes" },
            { internalType: "uint256", name: "amountIn", type: "uint256" },
        ],
        name: "quoteExactInput",
        outputs: [
            { internalType: "uint256", name: "amountOut", type: "uint256" },
            { internalType: "uint16[]", name: "fees", type: "uint16[]" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "tokenIn", type: "address" },
            { internalType: "address", name: "tokenOut", type: "address" },
            { internalType: "uint256", name: "amountIn", type: "uint256" },
            { internalType: "uint160", name: "limitSqrtPrice", type: "uint160" },
        ],
        name: "quoteExactInputSingle",
        outputs: [
            { internalType: "uint256", name: "amountOut", type: "uint256" },
            { internalType: "uint16", name: "fee", type: "uint16" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "path", type: "bytes" },
            { internalType: "uint256", name: "amountOut", type: "uint256" },
        ],
        name: "quoteExactOutput",
        outputs: [
            { internalType: "uint256", name: "amountIn", type: "uint256" },
            { internalType: "uint16[]", name: "fees", type: "uint16[]" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "tokenIn", type: "address" },
            { internalType: "address", name: "tokenOut", type: "address" },
            { internalType: "uint256", name: "amountOut", type: "uint256" },
            { internalType: "uint160", name: "limitSqrtPrice", type: "uint160" },
        ],
        name: "quoteExactOutputSingle",
        outputs: [
            { internalType: "uint256", name: "amountIn", type: "uint256" },
            { internalType: "uint16", name: "fee", type: "uint16" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
];
