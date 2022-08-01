import { Contract, ethers } from "ethers";
import { useCallback } from "react";
import { useEffect } from "react";
import { useContext, useState } from "react";
import { createContext } from "react";

import { useWallet } from "src/store/walletContext";
import CounterContractArtifact from "src/artifacts/contracts/Counter.sol/Counter.json";

const counterAbi = CounterContractArtifact.abi;

const { REACT_APP_COUNTER_CONTRACT_ADDRESS } = process.env;

type counterContextValue = {
  counterContractAddress: string;
  counter: string;
  isCounterLoading: boolean;
  counterEvents: CounterEvents[];
  isEventsLoading: boolean;
  incrementCounter: () => void;
  resetCounter: () => void;
  decrementCounter: () => void;
};

// TODO: refine this
type CounterEvents = {
  transactionHash: string;
  event: string;
  eventType: string;
  prevCounter: string;
  newCounter: string;
  userAddress: string;
  blockNumber: number;
};

const initialState = {
  counterContractAddress: "",
  counter: "0",
  isCounterLoading: true,
  counterEvents: [],
  isEventsLoading: true,
  incrementCounter: () => {},
  resetCounter: () => {},
  decrementCounter: () => {},
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

  const [counterEvents, setcounterEvents] = useState<CounterEvents[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true);

  const { userAddress, provider } = useWallet();

  const counterContractAddress = REACT_APP_COUNTER_CONTRACT_ADDRESS;

  if (!counterContractAddress) {
    throw new Error("no contract address provided in the .env file");
  }

  // load counter contract
  useEffect(() => {
    if (provider) {
      setIsCounterLoading(true);
      const counterContract = new ethers.Contract(
        counterContractAddress,
        counterAbi,
        provider.getSigner()
      );
      setCounterContract(counterContract);
    }
  }, [provider, counterContractAddress]);

  // read the current user counter value
  const getCounter = useCallback(async () => {
    if (counterContract) {
      const userCounter = await counterContract.getCounter();
      setCounter(userCounter.toString());
      setIsCounterLoading(false);
    }
  }, [counterContract]);

  useEffect(() => {
    getCounter();
  }, [getCounter]);

  // read all the user CounterChanged events to display the tx list
  const getCounterEvents = useCallback(async () => {
    if (counterContract && userAddress) {
      setIsEventsLoading(true);
      // see docs: https://docs.ethers.io/v5/api/contract/example/#erc20-meta-events
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
        counterEvents.reverse().map(({ transactionHash, event, args, blockNumber }) => ({
          transactionHash,
          event: event || "unknown event",
          blockNumber,
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

  // Subscribe & Unsubscribe to the user CounterChange events
  useEffect(() => {
    if (counterContract && userAddress) {
      // see docs: https://docs.ethers.io/v5/api/contract/example/#erc20-meta-events
      const filterUserCounterEvents = counterContract.filters.CounterChanged(
        null, // eventType
        null, // prevCounter
        null, // newCounter
        userAddress // userAddress
      );

      // Listen to incoming CounterChange user events:
      counterContract.on(
        filterUserCounterEvents,
        (eventType, prevCounter, newCounter, signerAddress, newEvent) => {
          // we need to check if its a new counter change event
          const isNewEvent = !counterEvents.some(
            (event) => event.transactionHash === newEvent.transactionHash
          );

          //if its a new counter change event we update the counter and the tx list
          if (isNewEvent) {
            getCounter();
            getCounterEvents();
          }
        }
      );
    }

    return () => {
      // Unsubscribe all listeners for all events
      counterContract?.removeAllListeners();
    };
  }, [
    counterContract,
    userAddress,
    counterEvents,
    getCounter,
    getCounterEvents,
  ]);

  const incrementCounter = useCallback(() => {
    counterContract?.increment();
  }, [counterContract]);

  const resetCounter = useCallback(() => {
    counterContract?.reset();
  }, [counterContract]);

  const decrementCounter = useCallback(() => {
    counterContract?.decrement();
  }, [counterContract]);

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
