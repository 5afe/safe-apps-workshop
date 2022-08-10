// REACT_APP_FAUCET_BACKEND_URL

import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

import TransactionLabel from "src/components/transaction-label/TransactionLabel";
import AmountLabel from "src/components/amount-label/AmountLabel";
import Loader from "src/components/loader/Loader";
import requestFunds from "src/api/requestFunds";
import { useWallet } from "src/store/walletContext";
import { LIGHT_THEME } from "src/theme/theme";

const FaucetPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<string>();
  const [error, setError] = useState<string>("");

  const { userAddress, chain, userBalance } = useWallet();

  useEffect(() => {
    setError("");
  }, [userAddress, chain]);

  // TODO: create useFaucet

  // TODO: create redirection to Faucet if no funds are present

  // TODO: create redirection to Counter if funds are present

  // TODO: ADD RECAPTCHA ????

  const isBalanceLoading = !userBalance;
  const nativeTokenSymbol = chain.token;
  const amount = userBalance?.[nativeTokenSymbol];
  const hasError = !!error;

  const claimFunds = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await requestFunds({
        address: userAddress,
        chainId: chain.id,
      });
      setTransaction(response.data.transaction);
    } catch (error) {
      setError(error as string);
    } finally {
      setIsLoading(false);
    }
  };

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
          isLoading={isLoading}
          loadingText={"Requesting funds..."}
          minHeight={170}
        >
          <Loader
            isLoading={isBalanceLoading}
            loadingText={"Loading founds..."}
            minHeight={133}
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

          <div>
            {transaction ? (
              <TransactionLabel transactionHash={transaction} />
            ) : (
              <Button
                aria-label="claim founds"
                onClick={claimFunds}
                variant="contained"
                disabled={isBalanceLoading}
              >
                Request Funds
              </Button>
            )}
          </div>

          {/* {hasError && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )} */}
        </Loader>
      </Wrapper>

      {/* Claims Table */}
      <Wrapper>
        {/* TODO: check transaction here! */}
        <Typography>TODO: Claims Table</Typography>
      </Wrapper>
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
  margin: 24px 0 42px 0;
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
