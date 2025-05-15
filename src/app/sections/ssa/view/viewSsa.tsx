/*
 * Created on Wed Apr 24 2024
 *
 * Copyright (c) 2024 CC
 * Author:  Cristian R. Paz  */

import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Collapse,
  colors,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { getAsclDetalle, getUsuariosOpaci } from "@/app/controllers/ssa/ControllerAscl";
import { red, blue } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ApartmentIcon from "@mui/icons-material/Apartment";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PageContainer from "@/app/components/container/PageContainer";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Account } from "@/app/_mock/account";
import { useSession } from "next-auth/react";
import { DataGrid, GridColDef, GridToolbar, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { GetUsuarios } from "@/app/api/dataApiComponents";
import { alpha } from "@mui/material/styles";
import { DoneAll } from "@mui/icons-material";
import DateSelector from "@/app/components/DateSelector";
import dayjs from "dayjs";
// ----------------------------------------------------------------------

export default function SsaView() {
  //===================CONSTANTES GLOBALES======================================
  const folderModule: string = "inspecciones-planificadas";
  const fechaActual = dayjs().format("YYYY-MM-DD");

  //==========================LISTAS=======================================
  const [listaAsclDet, setListaAsclDet] = useState<any[]>([]);
  const [dataRows, setDataRows] = useState<any[]>([]);

  //===============================CONSTANTES=================================
  const [fechaSeleccionada, setFechaSeleccionada] = useState(fechaActual);
  const account = Account();
  const { status } = useSession();

  const listaAsclDasboardSSA = async () => {
    const listaAscl = await getAsclDetalle(2, account.token);
    setListaAsclDet(listaAscl.object);
  };
  const listaUsersAsclDasboardSSA = async () => {
    // console.log(fechaSeleccionada);
    const listaUsuarios = await GetUsuarios(account.token);
    const listaUsuariosOpaci = await getUsuariosOpaci(fechaSeleccionada, account.token);

    const lista = listaUsuarios
      .filter((us: any) => us.idEmpleado != 1)
      .map((user: any) => {
        const usuarioExiste = listaUsuariosOpaci?.find((u) => u.id === user.idEmpleado);

        return {
          id: user.idEmpleado,
          usuario: user.label,
          cantidad: usuarioExiste ? usuarioExiste.cantidad : 0,
        };
      });
    setDataRows(lista);
  };

  useEffect(() => {
    if (status === "authenticated") {
      listaAsclDasboardSSA();
    }
    if (fechaSeleccionada) {
      listaUsersAsclDasboardSSA();
    }
  }, [status, account.token, fechaSeleccionada]);

  const zfill = (value: any, length: number) => {
    const str = value.toString();
    return str.padStart(length, "0");
  };

  const handleFechaChange = async (fecha: string) => {
    const fechaSelect = fecha;
    setFechaSeleccionada(fechaSelect);
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarExport csvOptions={{ utf8WithBom: true }} />
        <GridToolbarFilterButton />
      </GridToolbarContainer>
    );
  };

  const dataColumns: GridColDef<(typeof dataRows)[number]>[] = [
    {
      field: "usuario",
      headerName: "USUARIO",
      width: 200,
    },
    {
      field: "cantidad",
      headerName: "OPACIS EJECUTADAS",
      width: 200,
      align: "center",
      renderCell: (params: any) => (
        <>{params.row.cantidad >= 2 ? <Chip label={params.row.cantidad} color="success" /> : <Chip label={params.row.cantidad} color="error" />}</>
      ),
    },
  ];

  return (
    <PageContainer title="SSA" description="">
      {/* <pre>{JSON.stringify(dataRows, null, 2)}</pre> */}
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3} mb={1}>
          <Typography variant="h4">Seguridad Salud y Ambiente</Typography>
        </Stack>
        <Divider sx={{ borderStyle: "revert", m: 2 }} />

        <Grid container spacing={3}>
          <Grid item container md={3} sm={12} xs={12} sx={{ padding: 2 }} spacing={3} justifyContent="center" direction="row">
            <Box>
              <DataGrid
                rows={dataRows}
                columns={dataColumns}
                sx={{
                  "& .MuiDataGrid-columnHeader": {
                    border: "1px solid #e0e0e0",
                    bgcolor: (theme) => alpha(theme.palette.grey[400], 1),
                    fontWeight: "bold",
                  },

                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                    color: "#fff",
                  },
                }}
                autoHeight
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 15 },
                  },
                }}
                pageSizeOptions={[15, 30, 60]}
                slots={{ toolbar: CustomToolbar }}
                disableRowSelectionOnClick
                disableColumnMenu
              />
              <DateSelector onDateChange={handleFechaChange} />
            </Box>
          </Grid>

          <Grid item container md={9} sm={12} xs={12} sx={{ padding: 2 }} spacing={3} justifyContent="center">
            {listaAsclDet.map((val, index) => {
              return (
                <Grid item md={6} sm={6} xs={12} sx={{ padding: 2 }} key={index}>
                  <Box key={index} sx={{ alignItems: "center" }}>
                    <Card sx={{ maxWidth: 900, width: "100%", margin: "auto", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)" }}>
                      <CardHeader
                        avatar={
                          <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
                            {val.checkOption}
                          </Avatar>
                        }
                        action={
                          <>
                            <Chip icon={<WarningAmberIcon />} label=" PENDIENTE" color="warning" sx={{ color: "white" }} />

                            {/*    <Link href={"/pages/ssa/formip/formcloseobs"} style={{ textDecoration: "none" }}>
                              <IconButton aria-label="settings">
                                <MoreVertIcon />
                              </IconButton>
                            </Link> */}
                          </>
                        }
                        title={val.comentarios}
                        subheader={val.fechaRegistro}
                      />

                      <CardMedia
                        sx={{ padding: "50px" }}
                        component="img"
                        height="400"
                        image={`${process.env.NEXT_PUBLIC_URL_MEDIA}/${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/${process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3}/${folderModule}/${val.imageObservacion}`}
                        alt={val.imageObservacion}
                      />
                      <CardContent>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {val.descripcionObservacion}
                        </Typography>
                      </CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <CardActions disableSpacing>
                          <Box>
                            <Tooltip title="Código de observación" arrow placement="top">
                              <Box sx={{ alignItems: "center", cursor: "pointer", borderRadius: 1, padding: 0.5 }}>
                                <Link
                                  href={{
                                    pathname: "/pages/ssa/formip/formcloseobs",
                                    query: {
                                      codigoInspeccionLabel: zfill(`${val.idAscl}`, 5),
                                      codigoInspeccionValue: val.idAscl,
                                    },
                                  }}
                                  style={{ textDecoration: "none", color: "black" }}
                                >
                                  <IconButton aria-label="share">
                                    <QrCodeScannerIcon />
                                  </IconButton>
                                  {zfill(`${val.idAscl}-${val.id}`, 9) || ""}
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
                                  {val.usuarioEjecucion}
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
                                  {val.lugarObservacion}
                                </Box>
                              </Tooltip>
                            </Box>
                          </>
                        </CardActions>
                      </Box>
                    </Card>
                    <br />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Container>
    </PageContainer>
  );
}
