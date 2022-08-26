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
import { Balances, WalletState } from "@web3-onboard/core/dist/types";
import { ethers } from "ethers";
// TODO: uncomment the line below to import the Gnosis Safe web3-onboard module
// import gnosisModule from "@web3-onboard/gnosis";

import Chain from "src/models/chain";
import chains, { initialChain } from "src/chains/chains";
import usePolling from "src/hooks/usePolling";

const injected = injectedModule();
const walletConnect = walletConnectModule();

const onboard = Onboard({
  wallets: [
    injected,
    walletConnect,
    // To use this Dapp as a Safe App:
    //
    // 1.- Update the manifest.json file and add this 3 lines:
    // "name": "Counter App",
    // "description": "Update your counter!",
    // "iconPath": "logo512.png",
    //
    // 2.- Install the Gnosis Safe web3-onboard module
    // yarn add @web3-onboard/gnosis
    //
    // 3.- after installing it, uncomment the line 14 of this file to import the Gnosis Safe web3-onboard module
    //
    // 4.- after import the Gnosis Module, uncomment the line below to use Gnosis Module with web3-onboard
    // gnosisModule(),
    //
    // 5.- disable the last used wallet autoconnect uncommenting the line 231 in the bottom of this file
    //
    // 6.- go to src/components/connected-wallet/ConnectedWallet.tsx file and add the safe logo in the UI
    //
    // 7.- you can change the UI if a Safe wallet is connected, as an example we can remove the disconnect wallet button
    // Go to the line 199 and add the logic to detect if a Safe App is connected
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
  isWalletLoading: boolean;
  isSafeAppWallet: boolean;
  isValidChain?: boolean;
  chain: Chain;
  provider?: ethers.providers.Web3Provider;
};

const initialState = {
  isWalletConnected: false,
  isSafeAppWallet: false,
  isWalletLoading: true,
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
  const [wallet, setWallet] = useState<WalletState | undefined>();
  const [isWalletLoading, setIsWalletLoading] = useState<boolean>(true);

  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();

  const [chain, setChain] = useState<Chain>(initialChain);
  const [isValidChain, setIsValidChain] = useState<boolean>();

  const [userBalance, setUserBalance] = useState<Balances>();

  // update the provider if a valid wallet & chain is present
  useEffect(() => {
    if (wallet && chain && isValidChain) {
      setProvider(new ethers.providers.Web3Provider(wallet.provider));
    }
    return () => {
      setProvider(undefined);
    };
  }, [wallet, isValidChain, chain]);

  // suscriptions to onboard state (chain & wallet updates)
  useEffect(() => {
    const wallets = onboard.state.select("wallets");
    wallets.subscribe((update) => {
      const newWallet = update?.[0];
      const newChainId = newWallet?.chains?.[0]?.id;
      const newChain = chains.find((chain) => chain.id === newChainId);

      setIsValidChain(!!newChain);

      // we only update the state if a new wallet is present
      setWallet((wallet) => {
        const newAddress = newWallet?.accounts?.[0]?.address;
        const currentAddress = wallet?.accounts?.[0]?.address;
        const isNewWallet =
          currentAddress !== newAddress || wallet?.label !== newWallet?.label;

        if (isNewWallet) {
          return newWallet;
        }

        return wallet;
      });

      // we only update the state if a new chain is present
      setChain((chain) => {
        const isNewChain = newChainId !== chain.id;

        if (isNewChain) {
          setWallet(newWallet);
          return newChain || initialChain;
        }

        return chain;
      });
    });

    // auto selecting the user wallet
    // see https://docs.blocknative.com/onboard/core#auto-selecting-a-wallet
    getInitialWallet().finally(() => setIsWalletLoading(false));
  }, []);

  const showConnectWalletModal = useCallback(async () => {
    // we only display metamask and walletconnect wallets in the onboard Modal
    onboard.state.actions.setWalletModules([injected, walletConnect]);

    const wallets = await onboard.connectWallet();

    if (wallets.length > 0) {
      setWallet(wallets[0]); // for simplicity, we only connect one wallet
      localStorage?.setItem(LAST_USED_USER_WALLET_KEY, wallets[0].label);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    const [wallet] = onboard.state.get().wallets;
    setWallet(undefined);
    await onboard.disconnectWallet({ label: wallet.label });
    localStorage?.setItem(LAST_USED_USER_WALLET_KEY, "");
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

  // TODO: remove the line 192 and uncomment the line 193
  const isSafeAppWallet = false; // delete this
  // const isSafeAppWallet = wallet?.label === "Gnosis Safe";

  const state = {
    wallet,
    provider,

    chain,
    isValidChain,

    isWalletLoading,
    isWalletConnected,
    isSafeAppWallet,
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

const LAST_USED_USER_WALLET_KEY = "lastUsedWallet";

const getInitialWallet = async (): Promise<WalletState | undefined> => {
  const lastUsedWallet = localStorage?.getItem(LAST_USED_USER_WALLET_KEY);

  // TODO: Uncomment this 7 lines below to force Safe connection if you are in an iframe
  // const isASafeApp = window.self !== window.top;
  // if (isASafeApp) {
  //   await onboard.connectWallet({
  //     autoSelect: { label: "Gnosis Safe", disableModals: true },
  //   });
  //   return;
  // }

  if (lastUsedWallet) {
    await onboard.connectWallet({
      autoSelect: { label: lastUsedWallet, disableModals: true },
    });
  }

  return;
};
