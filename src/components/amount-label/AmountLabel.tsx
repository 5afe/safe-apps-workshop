import Tooltip from "@mui/material/Tooltip";

import useMemoizedAmountLabel from "src/hooks/useMemoizedAmountLabel";

type AmountLabelType = {
  amount: string;
  tokenSymbol: string;
};

function AmountLabel({ amount, tokenSymbol }: AmountLabelType) {
  const amountLabel = useMemoizedAmountLabel(amount, tokenSymbol);

  return (
    <Tooltip title={`${amount} ${tokenSymbol}`}>
      <span>{amountLabel}</span>
    </Tooltip>
  );
}

export default AmountLabel;
