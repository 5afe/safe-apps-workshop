import { useMemo } from "react";
import Tooltip from "@mui/material/Tooltip";

type AmountLabelType = {
  amount: string;
  tokenSymbol: string;
};

function AmountLabel({ amount, tokenSymbol }: AmountLabelType) {
  const amountLabel = useMemo(() => {
    const [integerPart, decimalPart] = amount.split(".");

    const hasDecimal = !!decimalPart;
    const decimalLabel = hasDecimal ? `.${decimalPart.slice(0, 4)}` : "";

    return `${integerPart}${decimalLabel}`;
  }, [amount]);

  return (
    <Tooltip title={`${amount} ${tokenSymbol}`}>
      <span>
        {amountLabel} {tokenSymbol}
      </span>
    </Tooltip>
  );
}

export default AmountLabel;
