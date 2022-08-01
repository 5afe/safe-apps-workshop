import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DarkThemeIcon from "@mui/icons-material/Brightness4";
import LightThemeIcon from "@mui/icons-material/Brightness7";

import ConnectedWallet from "src/components/connected-wallet/ConnectedWallet";
import { useWallet } from "src/store/walletContext";
import { useTheme } from "src/store/themeContext";

const Header = () => {
  const { isWalletConnected, showConnectWalletModal } = useWallet();

  const { switchThemeMode, isDarkTheme } = useTheme();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          size="large"
          color="inherit"
          aria-label="open-menu-bar"
          edge="start"
          onClick={() => {
            console.log("open menu! ");
          }}
        >
          <MenuIcon />
        </IconButton>

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
