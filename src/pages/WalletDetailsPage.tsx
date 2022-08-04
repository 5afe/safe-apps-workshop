import { useEffect, useMemo } from "react";
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
import { gnosisChain, rinkebyChain } from "src/chains/chains";
import { HOME_PATHNAME, INVALID_CHAIN_PATHNAME } from "src/routes/routes";
import { useWallet } from "src/store/walletContext";

const WalletDetailsPage = () => {
  const {
    wallet,
    userAddress,
    userBalance,
    isSafeAppWallet,

    isValidChain,
    chain,

    switchChain,
    disconnectWallet,
  } = useWallet();

  const navigate = useNavigate();

  useEffect(() => {
    if (!wallet || !isValidChain) {
      navigate(INVALID_CHAIN_PATHNAME);
    }
  }, [wallet, isValidChain, navigate]);

  const isGnosisChain = chain.id === gnosisChain.id;

  const assetColumns = ["token", "amount"];
  const assetRows = useMemo(() => getBalanceRows(userBalance), [userBalance]);

  if (!userAddress) {
    return <Loader isLoading />;
  }

  return (
    <>
      <Wrapper>
        <GoBackLink
          href={HOME_PATHNAME}
          onClick={(e) => {
            e.preventDefault();
            navigate(HOME_PATHNAME);
          }}
        >
          Go back to your counter
        </GoBackLink>

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

            {isGnosisChain ? (
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
            ) : (
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
          </Stack>
        )}
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
  position: relative;
  max-width: 800px;
  margin: 64px auto;
  padding: 16px;
  text-align: center;
`;

const GoBackLink = styled(Link)`
  position: absolute;
  top: -28px;
  left: 0;
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
