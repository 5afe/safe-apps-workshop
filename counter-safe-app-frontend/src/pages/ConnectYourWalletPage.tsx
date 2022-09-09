import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

import { HOME_PATHNAME } from "src/routes/routes";

import { useWallet } from "src/store/walletContext";

const ConnectYourWalletPage = () => {
  const navigate = useNavigate();

  const { wallet } = useWallet();

  useEffect(() => {
    if (wallet) {
      navigate(HOME_PATHNAME);
    }
  }, [wallet, navigate]);

  return (
    <Wrapper>
      <Typography component="h2" variant="h4" gutterBottom>
        Update the Manifest.json and open this Safe App{" "}
        <Link href="https://gnosis-safe.io/app/welcome">in the Safe UI!</Link>
      </Typography>
    </Wrapper>
  );
};

export default ConnectYourWalletPage;

const Wrapper = styled(Paper)`
  max-width: 800px;
  margin: 64px auto;
  padding: 16px;
  text-align: center;
`;
