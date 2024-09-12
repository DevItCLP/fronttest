/*
 * Created on Wed Apr 24 2024
 *
 * Copyright (c) 2024 CC
 * Author:  Cristian R. Paz  */

import { Box, Button, Container, Divider, Grid, Link, Stack, Typography } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import SimpleListMenu from "@/app/components/container/CardSubModule";

// ----------------------------------------------------------------------

export default function QaView() {
  return (
    <PageContainer title="QA" description="PAGE QA">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">QA</Typography>

          {/*    <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" width={undefined} sx={undefined} color={""} />}>
            New
          </Button> */}
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
    </PageContainer>
  );
}
