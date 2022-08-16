import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DarkThemeIcon from "@mui/icons-material/Brightness4";
import LightThemeIcon from "@mui/icons-material/Brightness7";

import ConnectedWallet from "src/components/connected-wallet/ConnectedWallet";
import { useWallet } from "src/store/walletContext";
import { useTheme } from "src/store/themeContext";
import MenuDrawer from "../menu-drawer/MenuDrawer";

const Header = () => {
  const { isWalletConnected, showConnectWalletModal } = useWallet();

  const { switchThemeMode, isDarkTheme } = useTheme();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <div>
          <MenuDrawer />
        </div>

        <Typography component="h1" sx={{ flexGrow: 1 }}>
          Safe Apps Workshop
        </Typography>

        {isWalletConnected ? (
          <ConnectedWallet />
        ) : (
          <Tooltip title="Connect your wallet">
            <Button
              color="inherit"
              disabled={isWalletConnected}
              variant="outlined"
              aria-label="Connect yout wallet"
              startIcon={<WalletIcon />}
              onClick={showConnectWalletModal}
            >
              Connect
            </Button>
          </Tooltip>
        )}

        <Tooltip title="Switch Theme mode">
          <IconButton
            size="large"
            color="inherit"
            aria-label="switch theme mode"
            edge="end"
            onClick={switchThemeMode}
          >
            {isDarkTheme ? <LightThemeIcon /> : <DarkThemeIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
