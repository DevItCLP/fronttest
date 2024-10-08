/*
 * Created on Sat May 25 2024
 *
 * Copyright (c) 2024 CC
 *
 * Author: Cristian R. Paz
 */

import { Box, Typography } from "@mui/material";

export const DividerCenter = ({ texto }: { texto: string }) => {
  return (
    <Box display="flex" alignItems="center" padding={2}>
      <Box sx={{ flex: 1, height: "1px", backgroundColor: "#637381" }} />
      <Typography
        variant="body2"
        sx={{
          color: "gray",
          fontWeight: "",
          px: 1,
          backgroundColor: "background.paper",
        }}
      >
        {texto}
      </Typography>
      <Box sx={{ flex: 1, height: "1px", backgroundColor: "#637381" }} />
    </Box>
  );
};
