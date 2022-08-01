import { useMemo } from "react";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import IosShareIcon from "@mui/icons-material/IosShare";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { styled } from "@mui/material/styles";
import chains from "src/chains/chains";

const ADDRESS_LENGTH = 42;

type AddressLabelProps = {
  address: string;
  showCopyIntoClipboardButton?: boolean;
  showBlockExplorerLink?: boolean;
  ariaLabel?: string;
  iconSize?: "small" | "medium" | "large" | undefined;
  chainId?: string;
};

// TODO: Support chain short name

const AddressLabel = ({
  address,
  showCopyIntoClipboardButton,
  ariaLabel,
  iconSize,
  showBlockExplorerLink,
  chainId,
}: AddressLabelProps) => {
  const addressLabel = useMemo(() => {
    if (address) {
      const firstPart = address.slice(0, 6);
      const lastPart = address.slice(ADDRESS_LENGTH - 6);

      return `${firstPart}...${lastPart}`;
    }

    return address;
  }, [address]);

  const chain = chains.find((chain) => chain.id === chainId);
  const blockExplorerLink = `${chain?.blockExplorerUrl}/address/${address}`;
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={0.5}
      component="span"
    >
      <Tooltip title={address}>
        <span>{addressLabel}</span>
      </Tooltip>

      {/* Button to copy into clipboard */}
      {showCopyIntoClipboardButton && (
        <Tooltip title={"Copy address into clipboard"}>
          <StyledIconButton
            aria-label={`Copy ${ariaLabel} to clipboard`}
            onClick={() => navigator?.clipboard?.writeText?.(address)}
            size={iconSize || "small"}
          >
            <FileCopyOutlinedIcon fontSize="inherit" />
          </StyledIconButton>
        </Tooltip>
      )}

      {/* Button to etherscan */}
      {showBlockExplorerLink && blockExplorerLink && (
        <Tooltip title={"view details on block Explorer"}>
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

export default AddressLabel;

const StyledIconButton = styled(IconButton)`
  margin-left: 0px;
`;
