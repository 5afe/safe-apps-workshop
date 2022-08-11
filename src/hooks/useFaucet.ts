import { useCallback, useEffect, useState } from "react";
import { Contract, ethers } from "ethers";

import { useWallet } from "src/store/walletContext";
import requestFunds from "src/api/requestFunds";
import FaucetContractArtifact from "src/artifacts/contracts/Faucet.sol/Faucet.json";
import { gnosisChain, rinkebyChain } from "src/chains/chains";
import Chain from "src/models/chain";

const faucetAbi = FaucetContractArtifact.abi;

const {
  REACT_APP_FAUCET_CONTRACT_ADDRESS_RINKEBY,
  REACT_APP_FAUCET_CONTRACT_ADDRESS_GNOSIS_CHAIN,
} = process.env;

type useFauceReturnType = {
  isClaimLoading: boolean;
  isFaucetLoading: boolean;
  isEventsLoading: boolean;
  claimTransaction?: string;
  claimError?: string;
  claimFunds: () => Promise<void>;
  userClaims: ClaimFundsEvent[];
};

export type ClaimFundsEventStatus = "completed" | "pending";

type ClaimFundsEvent = {
  EventId: string;
  transactionHash: string;
  status: ClaimFundsEventStatus;
  claimTime: string;
};

function useFaucet(): useFauceReturnType {
  const [faucetContract, setFaucetContract] = useState<Contract>();
  const [isFaucetLoading, setIsFaucetLoading] = useState<boolean>(false);

  const [isClaimLoading, setIsClaimLoading] = useState<boolean>(false);
  const [claimTransaction, setClaimTransaction] = useState<string>();
  const [claimError, setClaimError] = useState<string>();

  const [userClaims, setUserClaims] = useState<ClaimFundsEvent[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true);

  const { userAddress, chain, provider, isValidChain } = useWallet();

  // if user changes wallet or chain we remove the claim error if present
  useEffect(() => {
    setClaimError("");
    setClaimTransaction("");
  }, [userAddress, chain]);

  const claimFunds = async () => {
    try {
      setIsClaimLoading(true);
      setClaimError("");
      const { transaction } = await requestFunds({
        address: userAddress,
        chainId: chain.id,
      });

      setClaimTransaction(transaction);

      // we add the new pending transaction to the event table as "pending" status
      setUserClaims((events) => {
        const newEvent: ClaimFundsEvent = {
          EventId: transaction,
          transactionHash: transaction,
          status: "pending",
          claimTime: new Date().getTime().toString(),
        };

        return [newEvent, ...events];
      });
    } catch (error) {
      setClaimError(error as string);
    } finally {
      setIsClaimLoading(false);
    }
  };

  const faucetContractAddress = getFaucetContractAddress(chain, isValidChain);

  // load faucet contract
  useEffect(() => {
    if (provider && faucetContractAddress) {
      setIsFaucetLoading(true);
      const faucetContract = new ethers.Contract(
        faucetContractAddress,
        faucetAbi,
        provider.getSigner()
      );
      setFaucetContract(faucetContract);
    } else {
      setFaucetContract(undefined);
    }
  }, [provider, faucetContractAddress]);

  // get all the user FundsClaimed events to display the transactions table
  const getClaimsEvents = useCallback(async () => {
    // see docs: https://docs.ethers.io/v5/api/contract/example/#erc20-meta-events

    if (faucetContract && userAddress) {
      // event FundsClaimed(address userAddress) filterd by the current user
      const filteredClaimEvents = faucetContract.filters.FundsClaimed(
        userAddress, // userAddress
        null // claimTime
      );

      const faucetEvents = await faucetContract.queryFilter(
        filteredClaimEvents, // ClaimEvents filterd by the current user
        0, // fromBlock
        "latest" // toBlock
      );

      setUserClaims(
        faucetEvents
          .reverse()
          .map(({ args, transactionHash, blockHash, logIndex }) => ({
            EventId: `${transactionHash}-${blockHash}-${logIndex}`, // to uniquely identify the event
            transactionHash,
            status: "completed",
            claimTime: args?.claimTime.toString(),
          }))
      );

      setIsEventsLoading(false);
      setClaimTransaction(undefined);
    }
  }, [faucetContract, userAddress]);

  useEffect(() => {
    getClaimsEvents();
  }, [getClaimsEvents]);

  // Subscribe to the new user ClaimFunds events
  useEffect(() => {
    if (faucetContract && userAddress) {
      // see docs: https://docs.ethers.io/v5/api/contract/example/#erc20-meta-events
      const filteredClaimEvents = faucetContract.filters.FundsClaimed(
        userAddress, // userAddress
        null // claimTime
      );

      // Listen to incoming ClaimEvents user events and update the UI
      faucetContract.on(filteredClaimEvents, getClaimsEvents);
    }
  }, [faucetContract, userAddress, getClaimsEvents]);

  return {
    claimFunds,
    isClaimLoading,
    claimTransaction,
    claimError,

    isFaucetLoading,

    userClaims,
    isEventsLoading,
  };
}

export default useFaucet;

const faucetContractAddresses = {
  [rinkebyChain.id]: REACT_APP_FAUCET_CONTRACT_ADDRESS_RINKEBY,
  [gnosisChain.id]: REACT_APP_FAUCET_CONTRACT_ADDRESS_GNOSIS_CHAIN,
};

const getFaucetContractAddress = (
  chain: Chain,
  isValidChain?: boolean
): string => {
  const faucetContractAddress = faucetContractAddresses[chain.id] || "";

  if (!faucetContractAddress && isValidChain) {
    throw new Error("no contract address provided in the .env file");
  }

  if (!isValidChain) {
    return "";
  }

  return faucetContractAddress;
};
