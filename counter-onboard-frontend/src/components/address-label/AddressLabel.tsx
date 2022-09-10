import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import OpenInNew from "@mui/icons-material/OpenInNew";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { styled } from "@mui/material/styles";

import useMemoizedAddressLabel from "src/hooks/useMemoizedAddressLabel";
import { useWallet } from "src/store/walletContext";

type AddressLabelProps = {
  address: string;
  showBlockExplorerLink?: boolean;
  ariaLabel?: string;
  iconSize?: "small" | "medium" | "large" | undefined;
  showCopyIntoClipboardButton?: boolean;
};

const AddressLabel = ({
  address,
  ariaLabel,
  iconSize,
  showBlockExplorerLink,
  showCopyIntoClipboardButton,
}: AddressLabelProps) => {
  const { chain } = useWallet();
  const addressLabel = useMemoizedAddressLabel(address);

  const blockExplorerLink = `${chain?.blockExplorerUrl}/address/${address}`;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
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
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
            }}
          >
            <OpenInNew fontSize="inherit" />
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
