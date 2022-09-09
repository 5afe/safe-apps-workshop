import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { styled } from "@mui/material/styles";
import { Balances } from "@web3-onboard/core/dist/types";

import Loader from "src/components/loader/Loader";
import AddressLabel from "src/components/address-label/AddressLabel";
import DataTable, { RowType } from "src/components/data-table/DataTable";
import { gnosisChain, goerliChain, rinkebyChain } from "src/chains/chains";
import { HOME_PATHNAME } from "src/routes/routes";
import { useWallet } from "src/store/walletContext";
import useInvalidChainRedirection from "src/hooks/useInvalidChainRedirection";
import useNoWalletConnectedRedirection from "src/hooks/useNoWalletConnectedRedirection";

const WalletDetailsPage = () => {
  const {
    userAddress,
    userBalance,
    isSafeAppWallet,

    chain,

    switchChain,
    disconnectWallet,
  } = useWallet();

  const navigate = useNavigate();

  useNoWalletConnectedRedirection();

  useInvalidChainRedirection();

  const isGnosisChain = chain.id === gnosisChain.id;
  const isRinkebyChain = chain.id === rinkebyChain.id;
  const isGoerliChain = chain.id === goerliChain.id;

  const assetColumns = ["token", "amount"];
  const assetRows = useMemo(() => getBalanceRows(userBalance), [userBalance]);

  if (!userAddress) {
    return <Loader isLoading />;
  }

  return (
    <>
      <Wrapper>
        <Typography component="h2" variant="h4" gutterBottom>
          Your Wallet Details
        </Typography>

        {/* Your current address */}
        <Typography component="h3" variant="h5" gutterBottom>
          <AddressLabel
            address={userAddress}
            showCopyIntoClipboardButton
            showBlockExplorerLink
          />
        </Typography>

        {!isSafeAppWallet && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
            component="span"
          >
            <Tooltip title="disconnect wallet">
              <Button
                color={"error"}
                variant="outlined"
                aria-label="disconnect wallet"
                startIcon={<WalletIcon />}
                onClick={disconnectWallet}
              >
                Disconnect Wallet
              </Button>
            </Tooltip>

            {!isRinkebyChain && (
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
            )}
            {!isGnosisChain && (
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
            )}

            {!isGoerliChain && (
              <Tooltip title="switch to Görli chain">
                <Button
                  color={"warning"}
                  variant="outlined"
                  aria-label="switch to Görli chain"
                  startIcon={<WalletIcon />}
                  onClick={() => switchChain(goerliChain)}
                >
                  Switch to Görli Chain
                </Button>
              </Tooltip>
            )}
          </Stack>
        )}

        <LinkWrapper>
          <Link
            href={HOME_PATHNAME}
            onClick={(e) => {
              e.preventDefault();
              navigate(HOME_PATHNAME);
            }}
          >
            Go back to your counter page
          </Link>
        </LinkWrapper>
      </Wrapper>

      <AssetsTableContainer>
        <DataTable
          rows={assetRows}
          columns={assetColumns}
          ariaLabel="current user wallet assets"
        />
      </AssetsTableContainer>
    </>
  );
};

export default WalletDetailsPage;

const Wrapper = styled(Paper)`
  max-width: 800px;
  margin: 64px auto;
  padding: 16px;
  text-align: center;
`;

const LinkWrapper = styled("div")`
  margin: 24px 0;
`;

const AssetsTableContainer = styled(Paper)`
  max-width: 800px;
  margin: 0 auto;
  margin-top: 24px;
`;

const getBalanceRows = (balances: Balances | undefined): RowType[] => {
  if (!balances) {
    return [];
  }

  return Object.keys(balances).map((token) => ({
    id: token,
    token,
    amount: balances[token],
  }));
};
