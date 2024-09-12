/*
 * Created on Wed Apr 24 2024
 *
 * Copyright (c) 2024 CC
 * Author:  Cristian R. Paz  */

import { Container, Divider, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";
import Box from "@mui/material/Box";

import SimpleListMenu from "@/app/components/container/CardSubModule";
// ----------------------------------------------------------------------

export default function SsaView() {
  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3} mb={1}>
        <Typography variant="h4">Seguridad Salud y Ambiente</Typography>
      </Stack>
      <Divider sx={{ borderStyle: "revert", m: 2 }} />
      <Box mt={1}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4} md={3}>
            <Link href={"/pages/ssa"} style={{ textDecoration: "none" }}>
              <SimpleListMenu />
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
