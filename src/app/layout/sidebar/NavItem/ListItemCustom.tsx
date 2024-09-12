import React from "react";

import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItem from "@mui/joy/ListItem";
import Link from "next/link";
import { alpha, ListItemIcon, ListItemText, styled } from "@mui/material";
import theme from "@/utils/theme";

type NavGroup = {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: any;
  onClick?: React.MouseEvent<HTMLButtonElement, MouseEvent>;
};

interface ItemType {
  item: NavGroup;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  hideMenu?: any;
  level?: number | any;
  pathDirect: string;
}

const ListItemCustom = ({ item, level, pathDirect, onClick }: ItemType) => {
  const ListItemStyled = styled(ListItem)(() => ({
    padding: 0,
    ".MuiButtonBase-root": {
      whiteSpace: "nowrap",
      marginBottom: "8px",
      padding: "8px 10px",
      borderRadius: "8px",
      backgroundColor: level > 1 ? "transparent !important" : "inherit",
      color: theme.palette.text.secondary,
      paddingLeft: "10px",
      "&:hover": {
        backgroundColor: "#ebedef",
      },
      "&.Mui-selected": {
        color: "#1877F2",
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.16),
          color: "#1877F2",
        },
      },
    },
  }));

  const Icon = item.icon;
  const itemIcon = <Icon stroke={1.5} size="1.0rem" />;
  return (
    <ListItem component="div" key={item.id}>
      {/*   <ListItemStyled> */}
      <ListItemButton
        component={Link}
        href={item.href}
        disabled={item.disabled}
        selected={pathDirect === item.href}
        target={item.external ? "_blank" : ""}
        onClick={onClick}
      >
        <ListItemIcon
          sx={{
            minWidth: "15px",
            p: "1px 0",
            color: "inherit",
          }}
        >
          {itemIcon}
        </ListItemIcon>

        <>{item.title}</>
      </ListItemButton>
      {/*  </ListItemStyled> */}
    </ListItem>
  );
};

export default ListItemCustom;
