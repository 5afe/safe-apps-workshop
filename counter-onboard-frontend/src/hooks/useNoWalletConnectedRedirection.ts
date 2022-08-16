import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CONNECT_WALLET_PATHNAME } from "src/routes/routes";

import { useWallet } from "src/store/walletContext";

const useNoWalletConnectedRedirection = () => {
  const navigate = useNavigate();

  const { wallet, isWalletLoading } = useWallet();

  useEffect(() => {
    if (!wallet && !isWalletLoading) {
      navigate(CONNECT_WALLET_PATHNAME);
    }
  }, [wallet, navigate, isWalletLoading]);
};

export default useNoWalletConnectedRedirection;
