import { Contract, ethers } from "ethers";
import { useCallback } from "react";
import { useEffect } from "react";
import { useContext, useState } from "react";
import { createContext } from "react";

import { useWallet } from "src/store/walletContext";
import { gnosisChain, rinkebyChain, goerliChain } from "src/chains/chains";
import Chain from "src/models/chain";
import counterAbi from "src/contract-abi/counterAbi";

const COUNTER_CONTRACT_ADDRESS_RINKEBY =
  "0x2AEEE557fcb83c866EDf667860631EbE2a39803e";
const COUNTER_CONTRACT_ADDRESS_GNOSIS_CHAIN =
  "0xC098C5D10334c9ac0d18C51f1388C2148Eb611aF";
const COUNTER_CONTRACT_ADDRESS_GOERLI = "TODO: ADD GOERLI ADDRESS";

type counterContextValue = {
  counterContractAddress: string;
  counter: string;
  isCounterLoading: boolean;
  counterEvents: CounterEvent[];
  isEventsLoading: boolean;
  incrementCounter: () => Promise<any>;
  resetCounter: () => Promise<any>;
  decrementCounter: () => Promise<any>;
};

export type CounterEventsStatus = "completed" | "pending";

type CounterEvent = {
  EventId: string;
  transactionHash: string;
  event: string;
  status: CounterEventsStatus;
  eventType: string;
  prevCounter: string;
  newCounter: string;
  userAddress: string;
};

const initialState = {
  counterContractAddress: "",
  counter: "0",
  isCounterLoading: true,
  counterEvents: [],
  isEventsLoading: true,
  incrementCounter: () => Promise.resolve(),
  resetCounter: () => Promise.resolve(),
  decrementCounter: () => Promise.resolve(),
};

const counterContext = createContext<counterContextValue>(initialState);

const useCounter = () => {
  const context = useContext(counterContext);

  if (!context) {
    throw new Error("useCounter should be used within a Context Provider");
  }

  return context;
};

const CounterProvider = ({ children }: { children: JSX.Element }) => {
  const [counterContract, setCounterContract] = useState<Contract>();

  const [counter, setCounter] = useState<string>("0");
  const [isCounterLoading, setIsCounterLoading] = useState<boolean>(true);

  const [counterEvents, setcounterEvents] = useState<CounterEvent[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true);

  const { userAddress, provider, chain, isValidChain } = useWallet();

  const counterContractAddress = getCounterContractAddress(chain, isValidChain);

  // load counter contract
  useEffect(() => {
    if (provider && counterContractAddress) {
      setIsCounterLoading(true);
      const counterContract = new ethers.Contract(
        counterContractAddress,
        counterAbi,
        provider.getSigner()
      );
      setCounterContract(counterContract);
    } else {
      setCounterContract(undefined);
    }
  }, [provider, counterContractAddress]);

  // read the current user counter value
  const getCounter = useCallback(async () => {
    if (counterContract && userAddress) {
      setIsCounterLoading(true);
      const userCounter = await counterContract.getCounter();
      setCounter(userCounter.toString());
      setIsCounterLoading(false);
    }
  }, [counterContract, userAddress]);

  useEffect(() => {
    getCounter();
  }, [getCounter]);

  // get all the user CounterChanged events to display the transactions table
  const getCounterEvents = useCallback(async () => {
    // see docs: https://docs.ethers.io/v5/api/contract/example/#erc20-meta-events

    if (counterContract && userAddress) {
      // CounterChanged filterd by the current user
      const filteredCounterEvents = counterContract.filters.CounterChanged(
        null, // eventType
        null, // prevCounter
        null, // newCounter
        userAddress // userAddress
      );

      const counterEvents = await counterContract.queryFilter(
        filteredCounterEvents, // CounterChanged filterd by the current user
        0, // fromBlock
        "latest" // toBlock
      );

      setcounterEvents(
        counterEvents
          .reverse()
          .map(({ event, args, transactionHash, blockHash, logIndex }) => ({
            EventId: `${transactionHash}-${blockHash}-${logIndex}`, // to uniquely identify the event
            transactionHash,
            event: event || "unknown event",
            status: "completed",
            eventType: args?.eventType,
            prevCounter: args?.prevCounter.toString(),
            newCounter: args?.newCounter.toString(),
            userAddress: args?.userAddress,
          }))
      );

      setIsEventsLoading(false);
    }
  }, [counterContract, userAddress]);

  useEffect(() => {
    getCounterEvents();
  }, [getCounterEvents]);

  // Subscribe to the new user CounterChange events
  useEffect(() => {
    if (counterContract && userAddress) {
      // see docs: https://docs.ethers.io/v5/api/contract/example/#erc20-meta-events
      const filterUserCounterEvents = counterContract.filters.CounterChanged(
        null, // eventType
        null, // prevCounter
        null, // newCounter
        userAddress // userAddress
      );

      // Listen to incoming CounterChange user events and update the UI
      counterContract.on(filterUserCounterEvents, () => {
        getCounter();
        getCounterEvents();
      });
    }
  }, [counterContract, userAddress, getCounter, getCounterEvents]);

  // remove all listeners if the contract changes
  useEffect(() => {
    return () => {
      counterContract?.removeAllListeners();
    };
  }, [counterContract]);

  const incrementCounter = useCallback(async () => {
    const transaction = await counterContract?.increment();

    // we add the new pending transaction to the event table as "pending" status
    setcounterEvents((events) => {
      const newEvent: CounterEvent = {
        EventId: transaction.hash,
        transactionHash: transaction.hash,
        event: "CounterChange",
        status: "pending",
        eventType: "increment",
        prevCounter: counter,
        newCounter: "?",
        userAddress: transaction.from,
      };

      return [newEvent, ...events];
    });
  }, [counterContract, counter]);

  const resetCounter = useCallback(async () => {
    const transaction = await counterContract?.reset();

    // we add the new pending transaction to the event table as "pending" status
    setcounterEvents((events) => {
      const newEvent: CounterEvent = {
        EventId: transaction.hash,
        transactionHash: transaction.hash,
        event: "CounterChange",
        status: "pending",
        eventType: "reset",
        prevCounter: counter,
        newCounter: "0",
        userAddress: transaction.from,
      };

      return [newEvent, ...events];
    });
  }, [counterContract, counter]);

  const decrementCounter = useCallback(async () => {
    const transaction = await counterContract?.decrement();

    // we add the new pending transaction to the event table as "pending" status
    setcounterEvents((events) => {
      const newEvent: CounterEvent = {
        EventId: transaction.hash,
        transactionHash: transaction.hash,
        event: "CounterChange",
        status: "pending",
        eventType: "decrement",
        prevCounter: counter,
        newCounter: "?",
        userAddress: transaction.from,
      };

      return [newEvent, ...events];
    });
  }, [counterContract, counter]);

  const state = {
    counterContractAddress,

    counter,
    isCounterLoading,

    counterEvents,
    isEventsLoading,

    incrementCounter,
    resetCounter,
    decrementCounter,
  };

  return (
    <counterContext.Provider value={state}>{children}</counterContext.Provider>
  );
};

export { useCounter, CounterProvider };

const counterContractAddresses = {
  [rinkebyChain.id]: COUNTER_CONTRACT_ADDRESS_RINKEBY,
  [gnosisChain.id]: COUNTER_CONTRACT_ADDRESS_GNOSIS_CHAIN,
  [goerliChain.id]: COUNTER_CONTRACT_ADDRESS_GOERLI
};

const getCounterContractAddress = (
  chain: Chain,
  isValidChain?: boolean
): string => {
  const counterContractAddress = counterContractAddresses[chain.id] || "";

  if (!counterContractAddress && isValidChain) {
    throw new Error("no contract address for the selected chain");
  }

  if (!isValidChain) {
    return "";
  }

  return counterContractAddress;
};
