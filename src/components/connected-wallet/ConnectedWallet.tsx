import { useNavigate, useMatch } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { formatEther } from "ethers/lib/utils";
import { SafeBalances } from "@gnosis.pm/safe-apps-sdk";

import { LIGHT_THEME } from "src/theme/theme";
import { useWallet } from "src/store/walletContext";
import Loader from "src/components/loader/Loader";
import AddressLabel from "src/components/address-label/AddressLabel";
import AmountLabel from "src/components/amount-label/AmountLabel";
import ChainLabel from "src/components/chain-label/ChainLabel";
import InvalidChainLabel from "../invalid-chain-label/InvalidChainLabel";
import { WALLET_DETAILS_PATHNAME } from "src/routes/routes";
import metamaskLogo from "src/assets/Metamask_logo.svg";
import QuestionMarkRoundedIcon from "@mui/icons-material/QuestionMarkRounded";
import walletConnectLogo from "src/assets/WalletConnect_logo.png";
import safeWalletLogo from "src/assets/SafeWallet_logo.png";

const logos: Record<string, string> = {
  WalletConnect: walletConnectLogo,
  MetaMask: metamaskLogo,
  "Gnosis Safe": safeWalletLogo,
};

const getNativeTokenAmount = (userBalance?: SafeBalances) => {
  if (!userBalance) {
    return 0;
  }

  return formatEther(
    userBalance.items.find(({ tokenInfo }) => tokenInfo.type === "NATIVE_TOKEN")
      ?.balance || 0
  );
};

const ConnectedWallet = () => {
  const { userAddress, wallet, chain, userBalance, isValidChain } = useWallet();

  const walletLabel = wallet?.label || "Unknown Wallet";
  const walletLogo = logos[walletLabel];
  const nativeTokenSymbol = chain.token;
  const amount = getNativeTokenAmount(userBalance);
  const hasFounds = !!amount && nativeTokenSymbol;

  const navigate = useNavigate();
  const isWalletDetailsPage = useMatch(WALLET_DETAILS_PATHNAME);

  return (
    <Loader isLoading={!userAddress}>
      {/* connected chain section */}

      {isValidChain ? (
        <Typography variant="body2">
          <ChainLabel chain={chain} />
        </Typography>
      ) : (
        <Tooltip title="Invalid selected chain, only Gnosis Chain and Rinkeby are allowed">
          <Typography variant="body2">
            <InvalidChainLabel />
          </Typography>
        </Tooltip>
      )}

      {/* connected address section */}
      {/* TODO: improve accessibility here */}
      <Container
        onClick={() => {
          if (!isWalletDetailsPage) {
            navigate(WALLET_DETAILS_PATHNAME);
          }
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          component="span"
        >
          {walletLogo ? (
            <img src={walletLogo} alt="connected Wallet logo" height={24} />
          ) : (
            <Tooltip title="Unknown connected Wallet">
              <QuestionMarkRoundedIcon />
            </Tooltip>
          )}

          <Typography variant="body2">
            {userAddress && (
              <AddressLabel address={userAddress} showBlockExplorerLink />
            )}
          </Typography>
        </Stack>
      </Container>

      {/* native founds section */}
      {hasFounds && (
        <Container>
          <Typography variant="body2">
            <AmountLabel amount={amount} tokenSymbol={nativeTokenSymbol} />
          </Typography>
        </Container>
      )}
    </Loader>
  );
};

export default ConnectedWallet;

const Container = styled("div")(
  ({ theme, onClick }) => `
  
  margin-right: 8px;
  border-radius: 4px;
  padding: 4px 12px;

  cursor: ${!!onClick ? "pointer" : "initial"};

  background-color: ${
    theme.palette.mode === LIGHT_THEME
      ? theme.palette.background.paper
      : theme.palette.grey["800"]
  };

  color: ${theme.palette.getContrastText(theme.palette.background.paper)};
  
  `
);
