/*
 * Created on Wed Mar 05 2025
 *
 * Copyright (c) 2025 CC
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
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  IconButton,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup, List, Message, useToaster } from "rsuite";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
  anularReport,
  GetCheckListInsp,
  getChecklists,
  getCheclist,
  getCheclistById,
  GetTipoCheckList,
} from "@/app/controllers/qa/ControllerCheckList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { useSession } from "next-auth/react";
import { ModalViewCierre } from "@/app/sections/ssa/reports/viewModalInspeccionesCierre";
import { ModalView } from "@/app/sections/ssa/reports/viewModalInspecciones";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { alpha } from "@mui/material/styles";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { useSearchParams } from "next/navigation";

export default function ViewListarInspecciones() {
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
  const [listaCheckList, setListaCheckList] = useState<any[]>([]);
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
  const urlParams = useSearchParams();

  /*--------------------------------------------FUNCIONES---------------------------------------------------*/
  //const urlParams = new URLSearchParams(window.location.search);
  const codigoInspeccionValue = urlParams.get("codigoInspeccionValue");
  const codigoInspeccionLabel = urlParams.get("codigoInspeccionLabel");

  const codigoInspeccionObject =
    codigoInspeccionValue && codigoInspeccionLabel
      ? {
          value: codigoInspeccionValue,
          label: codigoInspeccionLabel,
        }
      : undefined;

  useEffect(() => {
    if (status === "authenticated") {
      loadFilterData();
    }
  }, [status, account.token]);

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

  async function loadFilterData() {
    const listaUsuarios = await GetUsuarios(account.token);
    setListaUsuarios(listaUsuarios);
    const listaLugaresObs = await GetLugarObs(account.token);
    setListaLugaresObservacion(listaLugaresObs);
    const listaCheckList = await GetCheckListInsp(account.token);
    setListaCheckList(listaCheckList);
  }

  const codigoInspeccionChanged = () => {
    searchCheclklist();
  };

  const handleClickBtn = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    setMenuAnchors((prev) => ({ ...prev, [id]: event.currentTarget }));
  };
  const handleCloseBtn = (id: number) => {
    setMenuAnchors((prev) => ({ ...prev, [id]: null }));
  };

  const searchCheclklist = handleSubmit(async (data) => {
    //console.log("data ??????", data);

    const datosForm: any = {
      // LAS KEY DE ESTE OBJETO DEBEN SER EL MISMO DATO DEL DTO EN SPRING BOOT JAVA
      estado: data.estado,
     // nameLugarObservacion: data.nameLugarObservacion,
      //userNameControl: data.userNameControl,
    };
    if (data.fechas) {
      datosForm.fechaRegistroDesde = data.fechas[0];
      datosForm.fechaRegistroHasta = data.fechas[1];
    }

    const datos = Object.fromEntries(
      Object.entries(datosForm).filter(([_, value]) => value != undefined)
    );

    datos.modulo = 1;
    const datos1 = {
      ...datos,
      tipoChecklist: {
        idTipoChecklist: data.listaChecklist,
      },
    };

    try {
      const response: ResponseGetChecklist | undefined = await getChecklists(
        datos1,
        account.token
      );
      //console.log("kkkkkkkkk====>", response)
      setDataRows(response?.object ? response.object : []);
      response?.message == "Datos encontrados"
        ? toaster.push(<Message type="success">Datos encontrados</Message>)
        : toaster.push(
            <Message type="warning">No se encontraron resultados</Message>
          );
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
  });

  const dataColumns: GridColDef<(typeof dataRows)[number]>[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5, // Ajuste dinámico
      valueGetter: (_, row) => `${zfill(row.id, 6) || ""}`,
    },
    { field: "fechaRegistro", headerName: "FECHA", flex: 1 },
    {
      field: "userResponsableControl",
      headerName: "USUARIO DE CONTROL",
      flex: 1.5,
    },
    { field: "observaciones", headerName: "OBSERVACIONES", flex: 2 },

    {
      field: "estado",
      headerName: "ESTADO",
      flex: 1,
      renderCell: (params) => {
        const estadoLabels: any = {
          2: {
            icon: <CheckCircleIcon color="success" />,
            tooltip: "Archivado",
          },
          0: { icon: <CancelIcon color="error" />, tooltip: "Anulado" },
        };
        return (
          <Tooltip
            title={estadoLabels[params.row.estado]?.tooltip || "Desconocido"}
          >
            {estadoLabels[params.row.estado]?.icon || (
              <Chip label="DESCONOCIDO" size="small" color="default" />
            )}
          </Tooltip>
        );
      },
    },
    {
      field: "actions",
      headerName: "REPORTES",
      flex: 0.8,
      sortable: false,
      renderCell: (params: any) => (
        <Box>
          <Tooltip title="Más opciones">
            <IconButton
              aria-label="more"
              onClick={(event) => handleClickBtn(event, params.row.id)}
            >
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
                <RemoveRedEyeIcon />
              </ListItemIcon>
              <ListItemText primary="Reporte de Checklist" />
            </MenuItem>
            <MenuItem onClick={() => viewReportCierre(params.row.id)}>
              <ListItemIcon>
                <NoteAltIcon />
              </ListItemIcon>
              <ListItemText primary="Cierre de Observaciones" />
            </MenuItem>
            <MenuItem onClick={() => anularReporCheckList(params.row.id)}>
              <ListItemIcon>
                <DeleteSweepIcon />
              </ListItemIcon>
              <ListItemText primary="Anular Checklist" />
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
      const response: ResponseObsEncontradas | undefined =
        await getCheclistById(id, account.token);
      setListaDataReporte(response?.object ? response?.object : []);
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
  }

  async function viewReportCierre(id: number) {
    handleOpen2();
    handleCloseBtn(id);
    try {
      const response: ResponseObsEncontradas | undefined =
        await getCheclistById(id, account.token);
      setListaDataReporte2(response?.object ? response?.object : []);
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
  }

  async function anularReporCheckList(id: any) {
    handleCloseBtn(id);
    try {
      await anularReport(id, account.token);
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
  }

  return (
    <PageContainer
      title="SSA - Reportes De Inspecciones"
      description="Reportes"
    >
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4">SSA - Reportes De Inspecciones</Typography>
        </Stack>

        <ModalView
          open={open}
          handleClose={handleClose}
          listaDataReporte={listaDataReporte}
        />
        <ModalViewCierre
          open={open2}
          handleClose={handleClose2}
          listaDataReporte={listaDataReporte2}
        />

        <Divider sx={{ borderStyle: "revert", m: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Box component={"form"} onSubmit={searchCheclklist}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={2} lg={2}>
                  <SelectCC
                    _control={control}
                    _setValue={setValue}
                    label=" Tipo de Checklist"
                    name="listaChecklist"
                    size="small"
                    required={false}
                    errors={errors}
                    listaData={listaCheckList}
                    defaultValue={codigoInspeccionObject}
                    onChangeCallback={codigoInspeccionChanged}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <DataRangeCC
                    _setValue={setValue}
                    label=" date"
                    icon={<CalendarMonthIcon />}
                    name="fechas"
                  />
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
                  <SelectStatusCC
                    register={register}
                    label=" Estado"
                    name="estado"
                    size="small"
                    required={false}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Search />}
                  >
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <hr />
            <Box
              sx={{
                overflow: "auto",
                borderRadius: 2,
                boxShadow: 2,
                bgcolor: "background.paper",
              }}
            >
              <DataGrid
                rows={dataRows}
                columns={dataColumns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[7, 10, 20]}
                autoHeight
                slots={{ toolbar: GridToolbar }}
                disableRowSelectionOnClick
                disableColumnMenu
                sx={{
                  "& .MuiDataGrid-row": {
                    maxHeight: "none !important",
                  },

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
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </PageContainer>
  );
}
