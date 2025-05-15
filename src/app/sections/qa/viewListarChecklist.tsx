/*
 * Created on Mon Jul 22 2024
 *
 * Copyright (c) 2024 CC
 *
 * Author Cristian R. Paz
 */

import { Account } from "@/app/_mock/account";
import { GetUsuarios, GetLugarObs } from "@/app/api/dataApiComponents";
import PageContainer from "@/app/components/container/PageContainer";
import { DataRangeCC } from "@/app/components/date-hour";
import { SelectCC, SelectStatusCC } from "@/app/components/select-option";
import { Search } from "@mui/icons-material";
import {
  Typography,
  Box,
  Container,
  Stack,
  Divider,
  Grid,
  Button,
  useTheme,
  Chip,
  Tooltip,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Badge, Message, useToaster } from "rsuite";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { getChecklists, getCheclistById } from "@/app/controllers/qa/ControllerCheckList";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { ModalView } from "./reports/viewModal";
import { ModalViewCierre } from "./reports/viewModalCierre";
import { useSession } from "next-auth/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MoreVertIcon from "@mui/icons-material/MoreVert";
//-----------------------------------------------------------------------------------------------------------
//===========================================================================================================

export default function ReportChecklist() {
  type MenuState = {
    [key: string]: HTMLElement | null;
  };
  /*--------------------------------------------------REACT HOCK FORM ---------------------------------------*/
  const {
    register,
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();
  /*----------------------------------------LISTAS USE STATE-----------------------------------------------*/
  const [dataRows, setDataRows] = useState<ObjectData2[]>([]);
  const [listaUsuarios, setListaUsuarios] = useState<any[]>([]);
  const [listaLugaresObservacion, setListaLugaresObservacion] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [listaDataReporte, setListaDataReporte] = useState<any[]>([]);
  const [listaDataReporte2, setListaDataReporte2] = useState<any[]>([]);

  const [menuAnchors, setMenuAnchors] = useState<MenuState>({});

  /*-------------------DATOS DE INICIO DE SESION Y TOASTER Y TEMA --------------------------------*/
  const account = Account();
  const { status } = useSession();
  const toaster = useToaster();
  const theme = useTheme();

  /*--------------------------------------------FUNCIONES---------------------------------------------------*/
  //Carga al aniciar el componente
  useEffect(() => {
    if (status === "authenticated") {
      loadFilterData();
    }
  }, [status, account.token]);

  const zfill = (value: any, length: number) => {
    const str = value.toString();
    return str.padStart(length, "0");
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  const handleClickBtn = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setMenuAnchors((prev) => ({ ...prev, [id]: event.currentTarget }));
  };
  const handleCloseBtn = (id: number) => {
    setMenuAnchors((prev) => ({ ...prev, [id]: null }));
  };

  async function loadFilterData() {
    const listaUsuarios = await GetUsuarios(account.token);
    setListaUsuarios(listaUsuarios);
    const listaLugaresObs = await GetLugarObs(account.token);
    setListaLugaresObservacion(listaLugaresObs);
  }

  const searchCheclklist = handleSubmit(async (data) => {
    console.log(data);
    const datosForm: any = {
      // LAS KEY DE ESTE OBJETO DEBEN SER EL MISMO DATO DEL DTO EN SPRING BOOT JAVA
      estado: data.estado,
      _lugarObservacion: data.lugobservacion,
      userResponsableControl: data.userControl,
    };
    if (data.fechas) {
      datosForm.fechaRegistroDesde = data.fechas[0];
      datosForm.fechaRegistroHasta = data.fechas[1];
    }
    const datos = Object.fromEntries(Object.entries(datosForm).filter(([_, value]) => value != undefined));

    try {
      const response: ResponseGetChecklist | undefined = await getChecklists(datos, account.token);
      setDataRows(response?.object ? response.object : []);
      response?.message == "Datos encontrados"
        ? toaster.push(<Message type="success">Datos encontrados</Message>)
        : toaster.push(<Message type="warning">No se encontraron resultados</Message>);
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
  });

  const dataColumns: GridColDef<(typeof dataRows)[number]>[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      valueGetter: (_, row) => `${zfill(row.id, 6) || ""}`,
    },
    { field: "fechaRegistro", headerName: "FECHA", width: 200 },
    { field: "userResponsableControl", headerName: "USUARIO DE CONTROL", width: 300 },
    { field: "observaciones", headerName: "OBSERVACIONES", width: 450 },
    {
      field: "estado",
      headerName: "ESTADO",
      flex: 1,
      renderCell: (params) => {
        const estadoLabels: any = {
          2: { icon: <CheckCircleIcon color="success" />, tooltip: "Archivado" },
          1: { icon: <CancelIcon color="error" />, tooltip: "Anulado" },
        };
        return (
          <Tooltip title={estadoLabels[params.row.estado]?.tooltip || "Desconocido"}>
            {estadoLabels[params.row.estado]?.icon || <Chip label="DESCONOCIDO" size="small" color="default" />}
          </Tooltip>
        );
      },
    },
    {
      field: "actions",
      headerName: "REPORTES",
      width: 150,
      sortable: false,
      renderCell: (params: any) => (
        <Box>
          <Tooltip title="Más opciones">
            <IconButton aria-label="more" onClick={(event) => handleClickBtn(event, params.row.id)}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id={`menu_${params.row.id}`}
            anchorEl={menuAnchors[params.row.id]}
            open={Boolean(menuAnchors[params.row.id])}
            onClose={() => handleCloseBtn(params.row.id)}
          >
            <MenuItem onClick={() => viewReport(params.row.id)}>
              <ListItemIcon>
                <NoteAltIcon />
              </ListItemIcon>
              <ListItemText primary="Reporte de Checklist" />
            </MenuItem>
            <MenuItem onClick={() => viewReportCierre(params.row.id)}>
              <ListItemIcon>
                <NoteAltIcon />
              </ListItemIcon>
              <ListItemText primary="Cierre de Observaciones" />
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];
  async function viewReport(id: number) {
    handleOpen();
    handleCloseBtn(id);
    try {
      const response: ResponseObsEncontradas | undefined = await getCheclistById(id, account.token);
      
      setListaDataReporte(response?.object ? response?.object : []);
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
  }
  async function viewReportCierre(id: number) {
    handleOpen2();
    handleCloseBtn(id);
    try {
      const response: ResponseObsEncontradas | undefined = await getCheclistById(id, account.token);
      setListaDataReporte2(response?.object ? response?.object : []);
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
  }
  return (
    <PageContainer title="QA - Reportes" description="Reportes">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">QA - Reportes</Typography>
        </Stack>

        <ModalView open={open} handleClose={handleClose} listaDataReporte={listaDataReporte} />
        <ModalViewCierre open={open2} handleClose={handleClose2} listaDataReporte={listaDataReporte2} />

        <Divider sx={{ borderStyle: "revert", m: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Box component={"form"} onSubmit={searchCheclklist}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={2}>
                  <DataRangeCC _setValue={setValue} label=" date" icon={<CalendarMonthIcon />} name="fechas" />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <SelectCC
                    _control={control}
                    _setValue={setValue}
                    label="Responsable de Control "
                    name="userControl"
                    size="small"
                    required={false}
                    errors={errors}
                    listaData={listaUsuarios}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <SelectCC
                    _control={control}
                    _setValue={setValue}
                    label=" Lugar de Observación"
                    name="lugobservacion"
                    size="small"
                    required={false}
                    errors={errors}
                    listaData={listaLugaresObservacion}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <SelectStatusCC register={register} label=" Estado" name="estado" size="small" required={false} errors={errors} />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <Button type="submit" variant="contained" startIcon={<Search />}>
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <hr />
            <Box
              sx={{
                overflowX: { xs: "auto", sm: "hidden" },
                overflowY: { xs: "hidden", sm: "auto" },
              }}
            >
              <DataGrid
                rows={dataRows}
                columns={dataColumns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 7 },
                  },
                }}
                pageSizeOptions={[7, 10]}
                autoHeight
                slots={{ toolbar: GridToolbar }}
                disableRowSelectionOnClick
                disableColumnMenu
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    fontSize: 16,
                    fontWeight: "bold",
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </PageContainer>
  );
}
