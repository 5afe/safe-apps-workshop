const counterAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "eventType",
        type: "string",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "prevCounter",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "newCounter",
        type: "int256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
    ],
    name: "CounterChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "decrement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCounter",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "increment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "_newValue",
        type: "int256",
      },
    ],
    name: "setCounter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default counterAbi;
