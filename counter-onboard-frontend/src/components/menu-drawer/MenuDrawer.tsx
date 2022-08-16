import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import MenuIcon from "@mui/icons-material/Menu";
import ArticleIcon from "@mui/icons-material/Article";
import ListItem from "@mui/material/ListItem";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import {
  FAUCET_PATHNAME,
  HOME_PATHNAME,
  WALLET_DETAILS_PATHNAME,
} from "src/routes/routes";

const MenuDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const toggleDrawer = (event: any) => {
    if (
      event?.type === "keydown" &&
      (event?.key === "Tab" || event?.key === "Shift")
    ) {
      return;
    }

    setIsOpen((open) => !open);
  };

  return (
    <>
      <IconButton
        size="large"
        color="inherit"
        aria-label="opens DApp navigation menu drawer"
        edge="start"
        onClick={toggleDrawer}
      >
        <MenuIcon />
      </IconButton>
      <StyledMenuDrawer
        anchor={"left"}
        open={isOpen}
        hideBackdrop
        onClose={toggleDrawer}
      >
        <ClickAwayListener onClickAway={toggleDrawer}>
          <Box
            role="presentation"
            onClick={toggleDrawer}
            onKeyDown={toggleDrawer}
          >
            <nav aria-label="Counter DApp navigation">
              <List>
                {/* Counter Page link */}
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <ArticleIcon />
                    </ListItemIcon>
                    <Link
                      href={HOME_PATHNAME}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(HOME_PATHNAME);
                      }}
                      underline="hover"
                      color="inherit"
                    >
                      <ListItemText primary={"Counter DApp"} />
                    </Link>
                  </ListItemButton>
                </ListItem>

                {/* Wallet Details link */}
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <WalletIcon />
                    </ListItemIcon>
                    <Link
                      href={WALLET_DETAILS_PATHNAME}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(WALLET_DETAILS_PATHNAME);
                      }}
                      underline="hover"
                      color="inherit"
                    >
                      <ListItemText primary={"Wallet Details"} />
                    </Link>
                  </ListItemButton>
                </ListItem>

                {/* Faucet Page link */}
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <RequestQuoteIcon />
                    </ListItemIcon>
                    <Link
                      href={FAUCET_PATHNAME}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(FAUCET_PATHNAME);
                      }}
                      underline="hover"
                      color="inherit"
                    >
                      <ListItemText primary={"Faucet DApp"} />
                    </Link>
                  </ListItemButton>
                </ListItem>
              </List>
            </nav>
            <Divider />
          </Box>
        </ClickAwayListener>
      </StyledMenuDrawer>
    </>
  );
};

export default MenuDrawer;

const StyledMenuDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    margin-top: 64px;
    width: 240px;
  }
`;
