import React from "react";
import GetMenuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import HomeIcon from "@mui/icons-material/Home";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import ListItemCustom from "@/app/layout/sidebar/NavItem/ListItemCustom";
import { uniqueId } from "lodash";
import { alpha, useTheme } from "@mui/material";
import Link from "next/link";

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const pathDirect = usePathname();

  const [headerModule, ListModules, ItemsModules]: [headerMain[], subTitles[], itemsTitles[]] = GetMenuitems();

  const [statesOpen, setStatesOpen] = React.useState<boolean[]>(ListModules.map(() => false));

  const handleClick = (index: number) => {
    const newStates = [...statesOpen];
    newStates[index] = !newStates[index];
    setStatesOpen(newStates);
  };
  const theme = useTheme();
  return (
    <Box sx={{ px: 1 }}>
      <Box
        sx={{
          /* width: 320, */
          pl: "24px",
        }}
      >
        <List
          size="sm"
          sx={(theme_) => ({
            // Gatsby colors
            "--joy-palette-primary-plainColor": "#8a4baf",
            "--joy-palette-neutral-plainHoverBg": "#ebedef",
            "--joy-palette-neutral-plainActiveBg": alpha(theme.palette.primary.main, 0.08),
            "--joy-palette-primary-plainHoverBg": "transparent",
            "--joy-palette-primary-plainActiveBg": "transparent",
            [theme_.getColorSchemeSelector("dark")]: {
              "--joy-palette-text-secondary": "#635e69",
              "--joy-palette-primary-plainColor": "#d48cff",
            },

            "--List-insetStart": "32px",
            "--ListItem-paddingY": "5px",
            "--ListItem-paddingRight": "16px",
            "--ListItem-paddingLeft": "21px",
            "--ListItem-startActionWidth": "0px",
            "--ListItem-startActionTranslateX": "-50%",

            [`& .${listItemButtonClasses.root}`]: {
              borderLeftColor: "divider",
              padding: "8px 20px",

              "&:hover": {
                textDecoration: "none",
              },
            },
            [`& .${listItemButtonClasses.root}.${listItemButtonClasses.selected}`]: {
              borderLeftColor: "currentColor",
              color: "#1877F2",
              textDecoration: "none",
            },
            '& [class*="startAction"]': {
              color: "var(--joy-palette-text-tertiary)",
            },
          })}
        >
          <ListItem nested>
            {headerModule.map((row, index) => (
              // eslint-disable-next-line react/jsx-key
              <div key={uniqueId()}>
                <ListItem component="div" startAction={<SpaceDashboardIcon color="action" />}>
                  <Typography level="body-xs" sx={{ textTransform: "uppercase" }}>
                    {row.header}
                  </Typography>
                </ListItem>
                <List sx={{ "--List-gap": "0px" }}>
                  <ListItem>
                    <ListItemButton component={Link} href={row.href}>
                      <HomeIcon color="action" /> {row.module}
                    </ListItemButton>
                  </ListItem>
                </List>
              </div>
            ))}
          </ListItem>

          {ListModules.map((row, index) => (
            // eslint-disable-next-line react/jsx-key
            <div key={uniqueId()}>
              <ListItem
                nested
                sx={{ my: 1 }}
                key={uniqueId()}
                startAction={
                  <IconButton variant="plain" size="sm" color="neutral" onClick={() => handleClick(index)}>
                    <KeyboardArrowDown
                      sx={{
                        transform: statesOpen[index] ? "initial" : "rotate(-90deg)",
                      }}
                    />
                  </IconButton>
                }
              >
                <ListItem key={uniqueId()}>
                  <Typography
                    level="inherit"
                    sx={{
                      fontWeight: statesOpen[index] ? "bold" : undefined,
                      color: statesOpen[index] ? "text.primary" : "inherit",
                    }}
                  >
                    {row.header}
                  </Typography>
                </ListItem>

                {statesOpen[index] && (
                  <List key={uniqueId()} sx={{ "--ListItem-paddingY": "8px" }}>
                    {ItemsModules.map((item: any) => {
                      if (item.idSubTitles == row.code) {
                        // eslint-disable-next-line react/jsx-key
                        return <ListItemCustom item={item} key={item.id} pathDirect={pathDirect} onClick={toggleMobileSidebar} />;
                      }
                    })}
                  </List>
                )}
              </ListItem>
            </div>
          ))}
        </List>
      </Box>
    </Box>
  );
};
export default SidebarItems;
