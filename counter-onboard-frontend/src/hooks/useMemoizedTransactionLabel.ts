import { useMemo } from "react";

const TRANSACTION_HASH_LENGTH = 66;
const CHAR_DISPLAYED = 10;

const useMemoizedTransactionLabel = (transactionHash: string) => {
  const transactionHashLabel = useMemo(() => {
    if (transactionHash) {
      const firstPart = transactionHash.slice(0, CHAR_DISPLAYED);
      const lastPart = transactionHash.slice(
        TRANSACTION_HASH_LENGTH - CHAR_DISPLAYED
      );

      return `${firstPart}...${lastPart}`;
    }

    return transactionHash;
  }, [transactionHash]);

  return transactionHashLabel;
};

export default useMemoizedTransactionLabel;
