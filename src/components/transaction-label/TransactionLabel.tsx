import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import IosShareIcon from "@mui/icons-material/IosShare";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { styled } from "@mui/material/styles";

import chains from "src/chains/chains";
import useMemoizedTransactionLabel from "src/hooks/useMemoizedTransactionLabel";

type TransactionLabelProps = {
  transactionHash: string;
  showCopyIntoClipboardButton?: boolean;
  showBlockExplorerLink?: boolean;
  ariaLabel?: string;
  iconSize?: "small" | "medium" | "large" | undefined;
  chainId?: string;
};

const TransactionLabel = ({
  transactionHash,
  showCopyIntoClipboardButton,
  ariaLabel,
  iconSize,
  showBlockExplorerLink,
  chainId,
}: TransactionLabelProps) => {
  const transactionHashLabel = useMemoizedTransactionLabel(transactionHash);

  const chain = chains.find((chain) => chain.id === chainId);
  const blockExplorerLink = `${chain?.blockExplorerUrl}/transaction/${transactionHash}`;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={0.5}
      component="span"
    >
      <Tooltip title={transactionHash}>
        <span>{transactionHashLabel}</span>
      </Tooltip>

      {/* Button to copy into clipboard */}
      {showCopyIntoClipboardButton && (
        <Tooltip title={"Copy address into clipboard"}>
          <StyledIconButton
            aria-label={`Copy ${ariaLabel} to clipboard`}
            onClick={() => navigator?.clipboard?.writeText?.(transactionHash)}
            size={iconSize || "small"}
          >
            <FileCopyOutlinedIcon fontSize="inherit" />
          </StyledIconButton>
        </Tooltip>
      )}

      {/* Button to etherscan */}
      {showBlockExplorerLink && blockExplorerLink && (
        <Tooltip title={"view transaction details on block Explorer"}>
          <IconButton
            aria-label={`Show ${ariaLabel} details on block Explorer`}
            component="a"
            href={blockExplorerLink}
            target="_blank"
            rel="noopener"
            size={iconSize || "small"}
          >
            <IosShareIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};

export default TransactionLabel;

const StyledIconButton = styled(IconButton)`
  margin-left: 0px;
`;
