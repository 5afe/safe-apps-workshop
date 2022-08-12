import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import OpenInNew from "@mui/icons-material/OpenInNew";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { styled } from "@mui/material/styles";
import { SafeBalances } from "@gnosis.pm/safe-apps-sdk";

import Loader from "src/components/loader/Loader";
import AddressLabel from "src/components/address-label/AddressLabel";
import DataTable, { RowType } from "src/components/data-table/DataTable";
import { HOME_PATHNAME, INVALID_CHAIN_PATHNAME } from "src/routes/routes";
import AmountLabel from "src/components/amount-label/AmountLabel";
import { gnosisChain, rinkebyChain } from "src/chains/chains";
import { useWallet } from "src/store/walletContext";
import { formatEther } from "ethers/lib/utils";
import Chain from "src/models/chain";

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

  const assetColumns = ["token", "type", "balance", "value"];
  const assetRows = useMemo(
    () => getBalanceRows(chain, userBalance),
    [userBalance, chain]
  );

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

        {/* Your total balance */}
        {userBalance && (
          <>
            <Typography component="h4" variant="h6" gutterBottom>
              Total Balance
            </Typography>

            <AmountLabel
              amount={userBalance.fiatTotal}
              tokenSymbol={"USD"}
              decimalsDisplayed={2}
            />
          </>
        )}

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

const getBalanceRows = (
  chain: Chain,
  userBalance?: SafeBalances
): RowType[] => {
  if (!userBalance) {
    return [];
  }

  return userBalance.items.map((token) => ({
    id: token.tokenInfo.name,
    token: (
      <TokenNameLabel
        name={token.tokenInfo.name}
        logoUri={token.tokenInfo.logoUri}
        address={
          token.tokenInfo.type === "NATIVE_TOKEN" ? "" : token.tokenInfo.address
        }
        chain={chain}
      />
    ),
    type:
      token.tokenInfo.type === "NATIVE_TOKEN"
        ? "Native Token"
        : token.tokenInfo.type,
    balance: (
      <AmountLabel
        amount={formatEther(token.balance)}
        tokenSymbol={token.tokenInfo.symbol}
      />
    ),
    value: (
      <AmountLabel
        amount={token.fiatBalance}
        tokenSymbol={"USD"}
        decimalsDisplayed={2}
      />
    ),
  }));
};

const TokenNameLabel = ({
  name,
  logoUri,
  chain,
  address,
}: {
  name: string;
  logoUri: string;
  chain: Chain;
  address?: string;
}) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      spacing={0.5}
    >
      <img src={logoUri} height="24" alt="" />
      <div>{name}</div>
      {address && (
        <Tooltip title={"view details on block Explorer"}>
          <IconButton
            aria-label={`Show token details on block Explorer`}
            component="a"
            href={`${chain?.blockExplorerUrl}/address/${address}`}
            target="_blank"
            rel="noopener"
            size={"small"}
          >
            <OpenInNew fontSize="inherit" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};
