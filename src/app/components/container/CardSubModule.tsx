import React, { useState } from "react";
import { Card, CardContent, Typography, Menu, MenuItem, IconButton, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import Link from "next/link";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
const options = ["Show some love to MUI", "Show all notification content", "Hide sensitive notification content", "Hide all notification content"];

export default function SimpleListMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Menú de Navegación
        </Typography>
        <IconButton aria-label="more" aria-controls="menu" aria-haspopup="true" onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu id="menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
          <List>
            <Link href="#" passHref>
              <ListItem button component="a" onClick={handleClose}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
            </Link>
            <Link href="#" passHref>
              <ListItem button component="a" onClick={handleClose}>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="About" />
              </ListItem>
            </Link>
            <Link href="#" passHref>
              <ListItem button component="a" onClick={handleClose}>
                <ListItemIcon>
                  <ContactMailIcon />
                </ListItemIcon>
                <ListItemText primary="Contact" />
              </ListItem>
            </Link>
          </List>
        </Menu>
      </CardContent>
    </Card>
  );
}
