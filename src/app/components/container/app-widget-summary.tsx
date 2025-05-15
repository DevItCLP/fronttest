import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";
import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function AppWidgetSummary({
  title,
  legend,
  icon,
  color = "#bdc3c7",
  sx,
  ...other
}: {
  title: string;
  legend: string;
  icon: ReactNode;
  color: string;
  sx: any;
}) {
  return (
    <Card
      border={2}
      borderColor={(theme) => alpha(color, 0.1)}
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        px: 3,
        py: 5,
        borderRadius: 2,
        "&:hover": {
          fontSize: "37px",
          borderColor: (theme) => alpha(color, 0.2),
        },
        ...sx,
      }}
      {...other}
    >
      {icon && <Box sx={{ width: 64, height: 64 }}>{icon}</Box>}

      <Stack spacing={0.5}>
        <Typography variant="h4"> {title}</Typography>

        <Typography variant="subtitle2" sx={{ color: (theme) => alpha(color, 0.6) }}>
          {legend}
        </Typography>
      </Stack>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
};
