import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";
// import ledgerModule from "@web3-onboard/ledger";
// import trezorModule from "@web3-onboard/trezor";
import { Balances, WalletState } from "@web3-onboard/core/dist/types";
import { ethers } from "ethers";

import Chain from "src/models/chain";
import chains, { initialChain } from "src/chains/chains";
import usePolling from "src/hooks/usePolling";

// TODO: Remove ledger & trezor support

const onboard = Onboard({
  wallets: [
    injectedModule(),
    // ledgerModule(),
    // trezorModule({
    //   // TODO: Add proper values
    //   email: "test@test.test",
    //   appUrl: "http://localhost:3000/",
    // }),
    walletConnectModule(),
  ],
  chains,
  accountCenter: {
    desktop: {
      enabled: false,
    } as any,
    mobile: {
      enabled: false,
    } as any,
  },
});

type walletContextValue = {
  userAddress?: string;
  userBalance?: Balances;
  wallet?: WalletState;
  showConnectWalletModal: () => Promise<void>;
  switchChain: (chain: Chain) => Promise<void>;
  disconnectWallet: () => void;
  isWalletConnected: boolean;
  isValidChain?: boolean;
  chain: Chain;
  provider?: ethers.providers.Web3Provider;
};

const initialState = {
  isWalletConnected: false,
  showConnectWalletModal: () => Promise.resolve(),
  switchChain: () => Promise.resolve(),
  disconnectWallet: () => {},
  chain: initialChain,
};

const walletContext = createContext<walletContextValue>(initialState);

const useWallet = () => {
  const context = useContext(walletContext);

  if (!context) {
    throw new Error("useWallet should be used within a WalletContext Provider");
  }

  return context;
};

const WalletProvider = ({ children }: { children: JSX.Element }) => {
  const [wallet, setWallet] = useState<WalletState>();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();

  const [chain, setChain] = useState<Chain>(initialChain);
  const [isValidChain, setIsValidChain] = useState<boolean>();

  const [userBalance, setUserBalance] = useState<Balances>();

  // TODO: Autoselect previous wallets:
  // see https://docs.blocknative.com/onboard/core#auto-selecting-a-wallet

  // TODO: Add disconnect wallet logic (Wallet details page)
  // https://docs.blocknative.com/onboard/core#disconnecting-a-wallet

  // suscriptions to onboard state (chain & wallet updates)
  useEffect(() => {
    const wallets = onboard.state.select("wallets");
    wallets.subscribe((update) => {
      const newWallet = update?.[0];

      if (!!newWallet) {
        // if the user select a new wallet we update the state with it
        setWallet((wallet) => {
          const newAddress = newWallet?.accounts?.[0]?.address;
          const oldAddress = wallet?.accounts?.[0]?.address;
          const walletHasChanged = oldAddress !== newAddress;

          if (walletHasChanged) {
            return newWallet; // we update the wallet state
          }

          return wallet; // no state update
        });

        // if the user select a new valid chain we update the state with it
        const newChainId = newWallet?.chains?.[0]?.id;
        const newChain = chains.find((chain) => chain.id === newChainId);
        const isValidChain = !!newChain;

        if (isValidChain) {
          setIsValidChain(true);
          setChain((chain) => {
            const chainHasChanged = newChain.id !== chain.id;

            if (chainHasChanged) {
              // we update the provider state
              setProvider(
                new ethers.providers.Web3Provider(newWallet.provider)
              );

              return newChain; // we update the chain state
            }

            return chain; // no state update
          });
        } else {
          // invalid selected chain
          setIsValidChain(false);
          setProvider(undefined);
        }
      }
    });
  }, []);

  const showConnectWalletModal = useCallback(async () => {
    const wallets = await onboard.connectWallet();

    if (wallets.length > 0) {
      setWallet(wallets[0]);
      setProvider(new ethers.providers.Web3Provider(wallets[0].provider));
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    const [wallet] = onboard.state.get().wallets;
    await onboard.disconnectWallet({ label: wallet.label });
    setWallet(undefined);
    setProvider(undefined);
  }, []);

  const switchChain = useCallback(async (chain: Chain) => {
    await onboard.setChain({ chainId: chain.id, chainNamespace: "evm" });
  }, []);

  const accounts = wallet?.accounts;
  const userAddress = accounts?.[0].address;
  const isWalletConnected = !!userAddress;

  const getUserBalance = useCallback(async () => {
    if (userAddress && isValidChain && chain) {
      await onboard.state.actions.updateBalances([userAddress]);
      const [wallet] = await onboard.state.get().wallets;
      const updatedBalance = wallet?.accounts?.[0].balance;

      setUserBalance(updatedBalance);
    } else {
      setUserBalance(undefined);
    }
  }, [userAddress, isValidChain, chain]);

  // user balance polling every 6 secs
  usePolling(getUserBalance);

  const state = {
    wallet,
    provider,
    chain,
    isValidChain,

    isWalletConnected,
    userAddress,
    userBalance,

    showConnectWalletModal,
    switchChain,
    disconnectWallet,
  };

  return (
    <walletContext.Provider value={state}>{children}</walletContext.Provider>
  );
};

export { useWallet, WalletProvider };
