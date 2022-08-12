import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";

import TransactionLabel from "src/components/transaction-label/TransactionLabel";
import AmountLabel from "src/components/amount-label/AmountLabel";
import Loader from "src/components/loader/Loader";
import DataTable from "src/components/data-table/DataTable";
import StatusLabel from "src/components/status-label/StatusLabel";
import useFaucet from "src/hooks/useFaucet";
import { useWallet } from "src/store/walletContext";
import { LIGHT_THEME } from "src/theme/theme";
import { HOME_PATHNAME } from "src/routes/routes";
import getNativeTokenAmount from "src/lib/getNativeTokenAmount";

const FaucetPage = () => {
  const { chain, userBalance, userAddress } = useWallet();

  const navigate = useNavigate();

  const {
    claimFunds,
    isClaimLoading,
    claimError,

    userClaims,
    isEventsLoading,
  } = useFaucet();

  const isBalanceLoading = !userBalance;
  const nativeTokenSymbol = chain.token;
  const amount = getNativeTokenAmount(userBalance);

  const rows = useMemo(
    () =>
      userClaims.map(
        ({ EventId, status, claimTime, transactionHash, claimedAmount }) => ({
          id: EventId,
          status: <StatusLabel status={status} />,
          date: new Date(Number(claimTime) * 1000).toLocaleString(),
          transaction: (
            <TransactionLabel
              transactionHash={transactionHash}
              showBlockExplorerLink
            />
          ),
          amount: (
            <AmountLabel
              amount={
                claimedAmount !== "?"
                  ? ethers.utils.formatEther(claimedAmount)
                  : claimedAmount
              }
              tokenSymbol={nativeTokenSymbol}
            />
          ),
        })
      ),
    [userClaims, nativeTokenSymbol]
  );

  const columns = ["status", "date", "transaction", "amount"];

  const isClaimPending = userClaims.some((claim) => claim.status === "pending");

  return (
    <>
      <Wrapper>
        <Typography component="h2" variant="h4" gutterBottom>
          Request Funds
        </Typography>

        <Typography gutterBottom>
          To perform transactions in {chain.label} you need to pay fees in the
          native currency, {chain.token}. You can request an small amount of
          funds to be able to participate in this Workshop. Click on "Request
          Funds" button and we will send you funds to your connected wallet.
        </Typography>

        <Loader
          isLoading={isClaimLoading || isClaimPending}
          loadingText="Requesting funds..."
          minHeight={233}
        >
          <Loader
            isLoading={isBalanceLoading}
            loadingText="Loading funds..."
            minHeight={123}
          >
            <BalanceWrapper>
              <Typography component="h3" variant="h5" gutterBottom>
                Your current balance
              </Typography>

              <AmountContainer>
                <Typography>
                  <AmountLabel
                    amount={amount || "0"}
                    tokenSymbol={nativeTokenSymbol}
                  />
                </Typography>
              </AmountContainer>
            </BalanceWrapper>
          </Loader>

          <ButtonContainer>
            <Button
              aria-label="claim funds"
              onClick={() => claimFunds(userAddress as string)}
              variant="contained"
              disabled={isBalanceLoading}
            >
              Request Funds
            </Button>

            {!!claimError && (
              <ClaimErrorLabel color="error">{claimError}</ClaimErrorLabel>
            )}

            {!isBalanceLoading && Number(amount) > 0.02 && (
              <LinkToCounter>
                <Link
                  href={HOME_PATHNAME}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(HOME_PATHNAME);
                  }}
                >
                  Go to your counter page
                </Link>
              </LinkToCounter>
            )}
          </ButtonContainer>
        </Loader>
      </Wrapper>

      <TableContainer>
        <Loader
          isLoading={isEventsLoading}
          loadingText={"Loading events..."}
          minHeight={200}
        >
          <DataTable
            rows={rows}
            columns={columns}
            ariaLabel="user claim funds event table"
          />
        </Loader>
      </TableContainer>
    </>
  );
};

export default FaucetPage;

const Wrapper = styled(Paper)`
  max-width: 800px;
  margin: 64px auto;
  padding: 24px;
  text-align: center;
`;

const BalanceWrapper = styled("div")`
  margin: 24px 0 32px 0;
`;

const AmountContainer = styled(Paper)(
  ({ theme }) => `

  display: inline-block;
  border-radius: 4px;
  padding: 4px 12px;
  margin: 0;

  background-color: ${
    theme.palette.mode === LIGHT_THEME
      ? theme.palette.grey["200"]
      : theme.palette.grey["800"]
  }
`
);

const ButtonContainer = styled("div")`
  min-height: 110px;
`;

const ClaimErrorLabel = styled(Typography)`
  margin: 12px 0;
`;

const LinkToCounter = styled(Typography)`
  margin: 12px 0 0 0;
`;

const TableContainer = styled(Paper)`
  max-width: 800px;
  margin: 0 auto;
  margin-top: 24px;
`;
