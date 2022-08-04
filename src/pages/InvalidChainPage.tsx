import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { styled } from "@mui/material/styles";

import { useWallet } from "src/store/walletContext";
import { COUNTER_CONTRACT_PATHNAME, HOME_PATHNAME } from "src/routes/routes";
import { gnosisChain, rinkebyChain } from "src/chains/chains";

const InvalidChainPage = () => {
  const { wallet, isValidChain, switchChain, isSafeAppWallet } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (!wallet) {
      navigate(HOME_PATHNAME);
    }
  }, [wallet, navigate]);

  useEffect(() => {
    if (isValidChain) {
      navigate(COUNTER_CONTRACT_PATHNAME);
    }
  }, [isValidChain, navigate]);

  return (
    <Wrapper>
      <Typography component="h2" variant="h4" gutterBottom>
        Invalid Chain
      </Typography>

      {!isSafeAppWallet && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          component="span"
        >
          <Tooltip title="switch to Rinkeby chain">
            <Button
              color={"warning"}
              variant="outlined"
              aria-label="switch to Rinkeby chain"
              startIcon={<WalletIcon />}
              onClick={() => switchChain(rinkebyChain)}
            >
              Switch to Rinkeby
            </Button>
          </Tooltip>

          <Tooltip title="switch to Gnosis chain">
            <Button
              variant="outlined"
              aria-label="switch to Gnosis chain"
              startIcon={<WalletIcon />}
              onClick={() => switchChain(gnosisChain)}
            >
              Switch to Gnosis Chain
            </Button>
          </Tooltip>
        </Stack>
      )}
    </Wrapper>
  );
};

export default InvalidChainPage;

const Wrapper = styled(Paper)`
  max-width: 800px;
  margin: 64px auto;
  padding: 16px;
  text-align: center;
`;
