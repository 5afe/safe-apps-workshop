import { useMemo } from "react";

const DECIMALS_DISPLAYED = 3;

const useMemoizedAmountLabel = (amount: string, tokenSymbol: string) => {
  const amountLabel = useMemo(() => {
    if (amount) {
      const [integerPart, decimalPart] = amount.split(".");

      const hasDecimal = !!decimalPart;
      const decimalLabel = hasDecimal
        ? `.${decimalPart.slice(0, DECIMALS_DISPLAYED)}`
        : "";

      return `${integerPart}${decimalLabel} ${tokenSymbol}`;
    }

    return `0 ${tokenSymbol}`;
  }, [amount, tokenSymbol]);

  return amountLabel;
};

export default useMemoizedAmountLabel;
