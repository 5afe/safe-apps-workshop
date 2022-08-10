import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import Loader from "src/components/loader/Loader";
import CounterLabel from "src/components/counter-label/CounterLabel";
import AddressLabel from "src/components/address-label/AddressLabel";
import DataTable from "src/components/data-table/DataTable";
import CounterChangedLabel from "src/components/counter-changed-label/CounterChangedLabel";
import { useCounter } from "src/store/counterContext";
import TransactionLabel from "src/components/transaction-label/TransactionLabel";
import useMultiOnClickPrevention from "src/hooks/useMultiOnClicksPrevention";
import CounterEventLabel from "src/components/counter-event-label/CounterEventLabel";
import StatusLabel from "src/components/status-label/StatusLabel";
import { useWallet } from "src/store/walletContext";
import {
  CONNECT_WALLET_PATHNAME,
  FAUCET_PATHNAME,
  INVALID_CHAIN_PATHNAME,
} from "src/routes/routes";

const CounterPage = () => {
  const { wallet, isValidChain, userBalance, chain } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (!wallet) {
      navigate(CONNECT_WALLET_PATHNAME);
    }
  }, [wallet, navigate]);

  useEffect(() => {
    if (!isValidChain) {
      navigate(INVALID_CHAIN_PATHNAME);
    }
  }, [isValidChain, navigate]);

  useEffect(() => {
    const nativeTokenSymbol = chain.token;
    const amount = userBalance?.[nativeTokenSymbol];
    const hasFounds = !!Number(amount);

    if (userBalance && !hasFounds) {
      navigate(FAUCET_PATHNAME);
    }
  }, [chain, userBalance, navigate]);

  const {
    counterContractAddress,

    counter,
    isCounterLoading,

    counterEvents,
    isEventsLoading,

    incrementCounter,
    resetCounter,
    decrementCounter,
  } = useCounter();

  // to prevent trigger multiple clicks
  const { disabled, preventMultiOnClick } = useMultiOnClickPrevention();

  const columns: string[] = [
    "status",
    "method",
    "user",
    "value",
    "transaction",
  ];

  const rows = useMemo(
    () =>
      counterEvents.map((event) => ({
        id: event.EventId,
        status: <StatusLabel status={event.status} />,
        method: <CounterEventLabel eventType={event.eventType} />,
        user: <AddressLabel address={event.userAddress} />,
        value: (
          <CounterChangedLabel
            prevCounter={event.prevCounter}
            newCounter={event.newCounter}
          />
        ),
        transaction: (
          <TransactionLabel
            transactionHash={event.transactionHash}
            showBlockExplorerLink
          />
        ),
      })),
    [counterEvents]
  );

  return (
    <Wrapper>
      {/* Counter Section */}
      <CounterDisplayContainer>
        <Typography component="h2" variant="h3" gutterBottom>
          Counter Contract
        </Typography>

        {/* Counter contract address */}
        <Typography component="h3" variant="h5" gutterBottom>
          <AddressLabel
            address={counterContractAddress}
            showCopyIntoClipboardButton
            showBlockExplorerLink
          />
        </Typography>

        <Loader
          isLoading={isCounterLoading}
          loadingText={"Loading counter..."}
          minHeight={140}
        >
          <CounterLabel counter={counter} />
        </Loader>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
          component="span"
        >
          {/* increment Button */}
          <Tooltip title={"increment your counter"}>
            <span>
              <Button
                disabled={disabled || isCounterLoading}
                onClick={preventMultiOnClick(incrementCounter)}
              >
                Increment
              </Button>
            </span>
          </Tooltip>

          {/* reset Button */}
          <Tooltip title={"reset your counter"}>
            <span>
              <Button
                disabled={disabled || isCounterLoading}
                onClick={preventMultiOnClick(resetCounter)}
              >
                Reset
              </Button>
            </span>
          </Tooltip>

          {/* decrement Button */}
          <Tooltip title={"decrement your counter"}>
            <span>
              <Button
                disabled={disabled || isCounterLoading}
                onClick={preventMultiOnClick(decrementCounter)}
              >
                Decrement
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </CounterDisplayContainer>

      {/* Transactions Section */}
      <CounteTableContainer>
        <Loader
          isLoading={isEventsLoading}
          loadingText={"Loading events..."}
          minHeight={200}
        >
          <DataTable
            rows={rows}
            columns={columns}
            ariaLabel="counter contract event table"
          />
        </Loader>
      </CounteTableContainer>
    </Wrapper>
  );
};

export default CounterPage;

const Wrapper = styled("div")`
  text-align: center;
  margin: 64px 0;
`;

const CounterDisplayContainer = styled(Paper)`
  max-width: 800px;
  margin: 0 auto;
  margin-top: 24px;
  padding: 16px;
`;

const CounteTableContainer = styled(Paper)`
  max-width: 800px;
  margin: 0 auto;
  margin-top: 24px;
`;
