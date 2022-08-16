import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FAUCET_PATHNAME } from "src/routes/routes";

import { useWallet } from "src/store/walletContext";

const useFaucetRedirection = () => {
  const navigate = useNavigate();

  const { isWalletLoading, userBalance, chain } = useWallet();

  useEffect(() => {
    const nativeToken = chain.token;
    const nativeTokenFunds = userBalance?.[nativeToken];
    const hasFunds = nativeTokenFunds && !!Number(nativeTokenFunds);
    const redirectToFaucetPage =
      nativeTokenFunds && !hasFunds && !isWalletLoading;

    if (redirectToFaucetPage) {
      navigate(FAUCET_PATHNAME);
    }
  }, [chain, userBalance, isWalletLoading, navigate]);
};

export default useFaucetRedirection;
