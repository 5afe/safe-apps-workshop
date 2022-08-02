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

  // TODO: ADD POLLING TO UPDATE BALANCES: updatedBalances
  // onboard.state.actions.updateBalances(); // update all balances for all connected addresses

  // TODO: Setting the User's Chain
  // const success = await onboard.setChain({ chainId: '0x89' })
  // NOTE: onboard.state.select("chains").subscribe is not working ?
  // TODO: Create invalid selected chain (only Rinkeby and Gnosis chain allowed)

  // TODO: Autoselect previous wallets:
  // see https://docs.blocknative.com/onboard/core#auto-selecting-a-wallet

  // TODO: Add disconnect wallet logic
  // https://docs.blocknative.com/onboard/core#disconnecting-a-wallet

  // suscriptions to onboard state changes
  useEffect(() => {
    // if the user select a new wallet we update the state with it
    onboard.state.select("wallets").subscribe((update) => {
      setWallet((wallet) => {
        const newWallet = update?.[0];
        const newAddress = newWallet?.accounts?.[0]?.address;
        const oldAddress = wallet?.accounts?.[0]?.address;
        const walletHasChanged = oldAddress !== newAddress;

        if (walletHasChanged) {
          return newWallet;
        }

        return wallet;
      });
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
