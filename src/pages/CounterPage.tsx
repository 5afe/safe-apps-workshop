import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import CounterLabel from "src/components/counter-label/CounterLabel";
import { useCounter } from "src/store/counterContext";
import AddressLabel from "src/components/address-label/AddressLabel";
import TransactionTable from "src/components/transaction-table/TransactionTable";

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

  const columns: string[] = [
    "status",
    "method",
    "user",
    "value",
    "transaction",
  ];

  const rows = counterEvents.map((event) => ({
    id: event.transactionHash,
    status: "OK",
    method: event.eventType,
    user: <AddressLabel address={event.userAddress} />,
    value: event.prevCounter + " -> " + event.newCounter,
    // TODO: ADD TRANSACTION LABEL
    transaction: <AddressLabel address={event.transactionHash} />,
  }));

  return (
    <Wrapper>
      <Typography component="h2" variant="h2" gutterBottom>
        Counter Contract
      </Typography>

      {/* Counter Section */}
      <CounterDisplayContainer>
        {/* Counter contract address */}
        <Typography component="h3" variant="h5" gutterBottom>
          <AddressLabel address={counterContractAddress} />
        </Typography>

        <CounterLabel counter={counter} />
        <CounterActionsContainer>
          {/* increment Button */}
          <Tooltip title={"increment your counter"}>
            <Button onClick={incrementCounter}>Increment</Button>
          </Tooltip>

          {/* reset Button */}
          <Tooltip title={"reset your counter"}>
            <Button onClick={resetCounter}>Reset</Button>
          </Tooltip>

          {/* decrement Button */}
          <Tooltip title={"decrement your counter"}>
            <Button onClick={decrementCounter}>Decrement</Button>
          </Tooltip>
        </CounterActionsContainer>
      </CounterDisplayContainer>

      {/* Transactions Section */}
      <CounteTableContainer>
        <TransactionTable
          rows={rows}
          columns={columns}
          ariaLabel="counter contract event table"
        />
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
