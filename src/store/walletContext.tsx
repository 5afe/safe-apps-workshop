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
  disconnectWallet: () => void;
  isWalletConnected: boolean;
  chain: Chain;
  provider?: ethers.providers.Web3Provider;
};

const initialState = {
  isWalletConnected: false,
  showConnectWalletModal: () => Promise.resolve(),
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
  const [chain, setChain] = useState<Chain>(initialChain);
  const [wallet, setWallet] = useState<WalletState>();

  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();

  // suscriptions
  useEffect(() => {
    onboard.state.select("wallets").subscribe((update) => {
      console.log("wallets changed! ", update);
    });

    onboard.state.select("chains").subscribe((update) => {
      console.log("chain changed! ", update);
    });
  }, []);

  // chain react state & onboard state reconciliation
  useEffect(() => {
    if (wallet) {
      onboard.setChain({ chainId: chain.id, chainNamespace: "evm" });
    }
  }, [chain, wallet]);

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

  const accounts = wallet?.accounts;
  const userAddress = accounts?.[0].address;
  const userBalance = accounts?.[0].balance;
  const isWalletConnected = !!userAddress;

  const state = {
    chain,
    wallet,
    provider,

    isWalletConnected,
    userAddress,
    userBalance,

    showConnectWalletModal,
    disconnectWallet,
  };

  return (
    <walletContext.Provider value={state}>{children}</walletContext.Provider>
  );
};

export { useWallet, WalletProvider };
