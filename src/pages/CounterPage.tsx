import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import Loader from "src/components/loader/Loader";
import CounterLabel from "src/components/counter-label/CounterLabel";
import AddressLabel from "src/components/address-label/AddressLabel";
import TransactionTable from "src/components/transaction-table/TransactionTable";
import CounterChangedLabel from "src/components/counter-changed-label/CounterChangedLabel";
import { useCounter } from "src/store/counterContext";

const CounterPage = () => {
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

  // TODO: create useMultipleClicksPrevention()
  // to prevent multiple clicks on the same button
  const [disableActions, setDisableActions] = useState(false);

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
        id: event.transactionHash,
        // TODO: ADD STATUS LABEL
        status: "OK",
        // TODO: ADD Event LABEL
        method: event.eventType,
        user: <AddressLabel address={event.userAddress} />,
        value: (
          <CounterChangedLabel
            prevCounter={event.prevCounter}
            newCounter={event.newCounter}
          />
        ),
        // TODO: ADD TRANSACTION LABEL
        transaction: <AddressLabel address={event.transactionHash} />,
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
          <AddressLabel address={counterContractAddress} />
        </Typography>

        <Loader
          isLoading={isCounterLoading}
          loadingText={"Loading counter..."}
          minHeight={150}
        >
          <CounterLabel counter={counter} />
          <CounterActionsContainer>
            {/* increment Button */}
            <Tooltip title={"increment your counter"}>
              <Button
                disabled={disableActions}
                onClick={async () => {
                  setDisableActions(true);
                  try {
                    await incrementCounter();
                  } finally {
                    setDisableActions(false);
                  }
                }}
              >
                Increment
              </Button>
            </Tooltip>

            {/* reset Button */}
            <Tooltip title={"reset your counter"}>
              <Button
                disabled={disableActions}
                onClick={async () => {
                  setDisableActions(true);
                  try {
                    await resetCounter();
                  } finally {
                    setDisableActions(false);
                  }
                }}
              >
                Reset
              </Button>
            </Tooltip>

            {/* decrement Button */}
            <Tooltip title={"decrement your counter"}>
              <Button
                disabled={disableActions}
                onClick={async () => {
                  setDisableActions(true);
                  try {
                    await decrementCounter();
                  } finally {
                    setDisableActions(false);
                  }
                }}
              >
                Decrement
              </Button>
            </Tooltip>
          </CounterActionsContainer>
        </Loader>
      </CounterDisplayContainer>

      {/* Transactions Section */}
      <CounteTableContainer>
        <Loader
          isLoading={isEventsLoading}
          loadingText={"Loading events..."}
          minHeight={200}
        >
          <TransactionTable
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
  margin-top: 64px;
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

const CounterActionsContainer = styled("div")`
  padding: 12px;
`;
