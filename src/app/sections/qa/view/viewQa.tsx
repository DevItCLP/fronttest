/*
 * Created on Wed Apr 24 2024
 *
 * Copyright (c) 2024 CC
 * Author:  Cristian R. Paz  */

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ApartmentIcon from "@mui/icons-material/Apartment";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { blue } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { getCheckListPendiente } from "@/app/controllers/qa/ControllerCheckList";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Account } from "@/app/_mock/account";
import { useSession } from "next-auth/react";

// ----------------------------------------------------------------------

export default function QaView() {
  const folderModule: string = "inspecciones-qa";

  const account = Account();
  const { status } = useSession();

  const [listaObsPendiente, setListaObsPendiente] = useState<any[]>([]);

  const listaAscl = async () => {
    const listaAscl = await getCheckListPendiente(account.token);
    setListaObsPendiente(listaAscl.object);
  };

  useEffect(() => {
    if (status === "authenticated") {
      listaAscl();
    }
  }, [status, account.token]);

  const zfill = (value: any, length: number) => {
    const str = value.toString();
    return str.padStart(length, "0");
  };
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

        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={6} md={8}>
            {listaObsPendiente.map((val, index) => {
              return (
                <Box key={index} sx={{ alignItems: "center" }}>
                  <Card sx={{ maxWidth: 900, width: "100%", margin: "auto", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)" }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
                          <AssignmentIcon />
                        </Avatar>
                      }
                      action={
                        <>
                          <Chip icon={<WarningAmberIcon />} label=" PENDIENTE" color="warning" sx={{ color: "white" }} />

                          <Link href={"/pages/qa/formchlclose"} style={{ textDecoration: "none" }}>
                            <IconButton aria-label="settings">
                              <MoreVertIcon />
                            </IconButton>
                          </Link>
                        </>
                      }
                      title={val.nombreOpcion}
                      subheader={val.fechaRegistro}
                    />

                    <CardMedia
                      sx={{ padding: "50px" }}
                      component="img"
                      height="400"
                      image={`${process.env.NEXT_PUBLIC_URL_MEDIA}/${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/${process.env.NEXT_PUBLIC_URL_FOLDER_QA_S3}/${folderModule}/${val.imagenObservacion}`}
                      alt={val.imagenObservacion}
                    />
                    <CardContent>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {val.observacionEncontrada}
                      </Typography>
                    </CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <CardActions disableSpacing>
                        <Box sx={{ display: "flex" }}>
                          <Tooltip title="Código de observación" arrow placement="top">
                            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer", borderRadius: 1, padding: 0.5 }}>
                              <Link href={"/pages/qa/formchlclose"} style={{ textDecoration: "none", color: "black" }}>
                                <IconButton aria-label="share">
                                  <QrCodeScannerIcon />
                                </IconButton>
                                {zfill(`${val.idChecklist}-${val.id}`, 9) || ""}
                              </Link>
                            </Box>
                          </Tooltip>
                        </Box>
                      </CardActions>

                      <CardActions disableSpacing>
                        <>
                          <Box sx={{ display: "flex" }}>
                            <Tooltip title="Usuario encargado de la ejecución" arrow placement="top">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  borderRadius: 1,
                                  padding: 0.5,
                                }}
                              >
                                <IconButton aria-label="add to favorites">
                                  <AccountCircleIcon />
                                </IconButton>
                                {val.userNameEjecucion}
                              </Box>
                            </Tooltip>
                            <Tooltip title="Lugar de la observación" arrow placement="top">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  borderRadius: 1,
                                  padding: 0.5,
                                }}
                              >
                                <IconButton aria-label="add to favorites">
                                  <ApartmentIcon />
                                </IconButton>
                                {val.nameLugarObservacion}
                              </Box>
                            </Tooltip>
                          </Box>
                        </>
                      </CardActions>
                    </Box>
                  </Card>
                  <br />
                </Box>
              );
            })}
          </Grid>
        </Grid>
      </Container>
    </PageContainer>
  );
}
