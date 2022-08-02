import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { styled } from "@mui/material/styles";

import { COUNTER_CONTRACT_PATHNAME } from "src/routes/routes";

import { useWallet } from "src/store/walletContext";

const ConnectYourWalletPage = () => {
  const navigate = useNavigate();

  const { wallet, showConnectWalletModal } = useWallet();

  useEffect(() => {
    if (wallet) {
      navigate(COUNTER_CONTRACT_PATHNAME);
    }
  }, [wallet, navigate]);

  return (
    <Wrapper>
      <Typography component="h2" variant="h4" gutterBottom>
        Connect your wallet!
      </Typography>

      <Tooltip title="Connect your wallet">
        <Button
          color="inherit"
          variant="outlined"
          aria-label="Connect yout wallet"
          startIcon={<WalletIcon />}
          onClick={showConnectWalletModal}
        >
          Connect
        </Button>
      </Tooltip>
    </Wrapper>
  );
};

export default ConnectYourWalletPage;

const Wrapper = styled(Paper)`
  max-width: 800px;
  margin: 0 auto;
  margin-top: 24px;
  padding: 16px;
  text-align: center;
`;
