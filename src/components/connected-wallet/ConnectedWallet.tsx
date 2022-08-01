import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { LIGHT_THEME } from "src/theme/theme";
import { useWallet } from "src/store/walletContext";
import AddressLabel from "src/components/address-label/AddressLabel";
import AmountLabel from "src/components/amount-label/AmountLabel";
import ChainLabel from "src/components/chain-label/ChainLabel";
import metamaskLogo from "src/assets/Metamask_logo.svg";
import walletConnectLogo from "src/assets/WalletConnect_logo.png";

const logos: Record<string, string> = {
  WalletConnect: walletConnectLogo,
  MetaMask: metamaskLogo,
  unknown: "TBD",
};

const ConnectedWallet = () => {
  const {
    userAddress,
    wallet,
    chain,
    userBalance,
    // disconnectWallet
  } = useWallet();

  const walletLabel = wallet?.label || "unknown";
  const walletLogo = logos[walletLabel];
  const nativeTokenSymbol = chain.token;
  const amount = userBalance?.[nativeTokenSymbol];
  const hasFounds = !!amount && nativeTokenSymbol;

  if (!userAddress) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* connected chain section */}
      <Typography variant="body2">
        <ChainLabel chain={chain} />
      </Typography>

      {/* connected address section */}
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          component="span"
        >
          <img src={walletLogo} alt="connected wallet logo" height={24} />
          <Typography variant="body2">
            <AddressLabel address={userAddress} />
          </Typography>
        </Stack>
      </Container>

      {/* native founds section */}
      <Container>
        {hasFounds && (
          <Typography variant="body2">
            <AmountLabel amount={amount} tokenSymbol={nativeTokenSymbol} />
          </Typography>
        )}
      </Container>
    </>
  );
};

export default ConnectedWallet;

const Container = styled("div")(
  ({ theme }) => `
  
  margin-right: 8px;
  border-radius: 4px;
  padding: 4px 12px;


  background-color: ${
    theme.palette.mode === LIGHT_THEME
      ? theme.palette.background.paper
      : theme.palette.grey["600"]
  };

  color: ${theme.palette.getContrastText(theme.palette.background.paper)};
  
  `
);
