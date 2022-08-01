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
  counter: string;
  counterContractAddress: string;
  isCounterLoading: boolean;
  incrementCounter: () => void;
  resetCounter: () => void;
  decrementCounter: () => void;
};

const initialState = {
  counter: "0",
  isCounterLoading: true,
  counterContractAddress: "",
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
  const [counter, setCounter] = useState<string>("0");
  const [isCounterLoading, setIsCounterLoading] = useState<boolean>(true);
  const [counterContract, setCounterContract] = useState<Contract>();

  const { provider } = useWallet();

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
    counter,
    counterContractAddress,
    isCounterLoading,

    incrementCounter,
    resetCounter,
    decrementCounter,
  };

  return (
    <counterContext.Provider value={state}>{children}</counterContext.Provider>
  );
};

export { useCounter, CounterProvider };
