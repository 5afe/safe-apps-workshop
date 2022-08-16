import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { INVALID_CHAIN_PATHNAME } from "src/routes/routes";

import { useWallet } from "src/store/walletContext";

const useInvalidChainRedirection = () => {
  const navigate = useNavigate();

  const { isValidChain, isWalletLoading } = useWallet();

  useEffect(() => {
    if (!isValidChain && !isWalletLoading) {
      navigate(INVALID_CHAIN_PATHNAME);
    }
  }, [isValidChain, navigate, isWalletLoading]);
};

export default useInvalidChainRedirection;
