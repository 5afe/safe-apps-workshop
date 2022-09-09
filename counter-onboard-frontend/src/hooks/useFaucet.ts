import { useCallback, useEffect, useState } from "react";
import { Contract, ethers } from "ethers";

import { useWallet } from "src/store/walletContext";
import requestFunds from "src/api/requestFunds";
import faucetAbi from "src/contract-abi/faucetAbi";
import { gnosisChain, rinkebyChain, goerliChain } from "src/chains/chains";
import Chain from "src/models/chain";

const FAUCET_CONTRACT_ADDRESS_RINKEBY =
  "0x93885EBaE734Edc78190E569DB812Be21F863518";
const FAUCET_CONTRACT_ADDRESS_GNOSIS_CHAIN =
  "0x394A2D5ad4Ed471881D3f8deD91251279db91eBf";
const FAUCET_CONTRACT_ADDRESS_GOERLI =
  "0x6EDcB4c5B049f4b3dB7ffd8E9ce0EC45ebB7981E";

type useFauceReturnType = {
  isClaimLoading: boolean;
  isFaucetLoading: boolean;
  isEventsLoading: boolean;
  claimTransaction?: string;
  faucetContractAddress: string;
  claimError?: string;
  claimFunds: (address: string) => Promise<void>;
  userClaims: ClaimFundsEvent[];
};

export type ClaimFundsEventStatus = "completed" | "pending";

type ClaimFundsEvent = {
  EventId: string;
  transactionHash: string;
  status: ClaimFundsEventStatus;
  claimTime: string;
  claimedAmount: string;
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

  const claimFunds = async (address: string) => {
    try {
      setIsClaimLoading(true);
      setClaimError("");
      const { transaction } = await requestFunds({
        address,
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
          claimedAmount: "?",
        };

        return [newEvent, ...events];
      });
    } catch (error) {
      console.log("claim error: ", claimError);
      setClaimError("Error claiming funds");
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
        null, // claimTime
        null // claimedAmount
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
            claimedAmount: args?.claimedAmount.toString(),
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
        null, // claimTime
        null // claimedAmount
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
    faucetContractAddress,

    userClaims,
    isEventsLoading,
  };
}

export default useFaucet;

const faucetContractAddresses = {
  [rinkebyChain.id]: FAUCET_CONTRACT_ADDRESS_RINKEBY,
  [gnosisChain.id]: FAUCET_CONTRACT_ADDRESS_GNOSIS_CHAIN,
  [goerliChain.id]: FAUCET_CONTRACT_ADDRESS_GOERLI,
};

const getFaucetContractAddress = (
  chain: Chain,
  isValidChain?: boolean
): string => {
  const faucetContractAddress = faucetContractAddresses[chain.id] || "";

  if (!faucetContractAddress && isValidChain) {
    throw new Error("no Faucet contract address defined for this chain");
  }

  if (!isValidChain) {
    return "";
  }

  return faucetContractAddress;
};
