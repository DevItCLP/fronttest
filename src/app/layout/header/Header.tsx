/*
 * Created on Wed Apr 24 2024
 *
 * Copyright (c) 2024 CC
 * Author:  Cristian R. Paz  */

import React from "react";
import { Box, AppBar, Toolbar, styled, Stack, IconButton } from "@mui/material";
import PropTypes from "prop-types";

// components
import Search from "./Search";
import { IconMenu2 } from "@tabler/icons-react";
import AccountPopover from "@/app/layout/common/account-popover";
import LanguagePopover from "@/app/layout/common/language-popover";
import NotificationsPopover from "@/app/layout/common/notifications-popover";
import theme from "@/utils/theme";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
//------------------------------------------

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  const ColorModeContext = React.createContext({ toggleColorMode: () => {} });
  const colorMode = React.useContext(ColorModeContext);

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu2 width="20" height="20" />
        </IconButton>

        <Search />
        <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />
        <Stack spacing={1} direction="row" alignItems="center">
          <LanguagePopover />
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
