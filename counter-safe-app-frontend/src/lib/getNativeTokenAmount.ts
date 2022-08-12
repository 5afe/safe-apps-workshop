import { formatEther } from "ethers/lib/utils";
import { SafeBalances } from "@gnosis.pm/safe-apps-sdk";

const getNativeTokenAmount = (userBalance?: SafeBalances) => {
  if (!userBalance) {
    return 0;
  }

  return formatEther(
    userBalance.items.find(({ tokenInfo }) => tokenInfo.type === "NATIVE_TOKEN")
      ?.balance || 0
  );
};

export default getNativeTokenAmount;
