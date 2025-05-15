/*
 * Created on Mon Jul 22 2024
 *
 * Copyright (c) 2024 CC
 *
 * Author Cristian R. Paz
 */

"use client";
import { Account } from "@/app/_mock/account";
import PageContainer from "@/app/components/container/PageContainer";
import {
  Avatar,
  Box,
  Button,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  Link,
  MenuItem,
  Select,
  Slide,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UploaderAvatar } from "@/app/components/uploader";
import { Message, useToaster } from "rsuite";
import { HourglassBottom, DoneAll, Search, WarningAmber } from "@mui/icons-material";
import { SelectCC } from "@/app/components/select-option";
import { GetUsuarios } from "@/app/api/dataApiComponents";
import {
  closeObservaciones,
  closeObsOpaci,
  getInspPlanificadas,
  getObservacionesEncontradas,
  reasignarResponsable,
} from "@/app/controllers/ssa/ControllerAscl";
import { sendEmailCloseSES, sendEmailSES, uploadIFilesS3, uploadImageS3, uploadImagesS3 } from "@/app/controllers/common/ControllerCommon";
import { SweetNotifyError, SweetNotifySuccesss } from "@/app/components/sweet-notificacion";
import { CloseObservacion } from "./viewFormIpModalClose";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

//----------------------------------------------------------------------------------------------------------------
//================================================================================================================

export default function FormIpClose() {
  /*--------------------------------------------------REACT HOCK FORM ---------------------------------------*/
  const {
    register,
    control,
    getValues,
    reset,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  /**------------------------------------CONSTANTES GLOBALES ---------------------------------------*/
  const colorOptions: any = {
    "0": "#F4D03F", // Naranja ABIERTO
    "1": "#2196F3", // Azul EN PROCESO
    "2": "#52BE80", // Verde CERRADO
    "3": "#17a589", // Verde fuerte CIERRE APROBADO
  };

  /*----------------------------------------LISTAS USE STATE-----------------------------------------------*/
  const [dataRows, setDataRows] = useState<ObjectDataIp[]>([]);
  const [stateCierre, setStateCierre] = useState<{ [key: number]: string }>({});
  //const [accionRealizadaCierre, setAccionRealizadaCierre] = useState<{ [key: number]: string }>({});
  const [listaInspecciones, setListaInspecciones] = useState<any[]>([]);
  const [listaUsuarios, setListaUsuarios] = useState<any[]>([]);
  const [listaEstados, setListaEstados] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [openmodal, setOpenModal] = useState(false);
  const [idUpdate, setIdUpdate] = useState<number | undefined>();
  const [dataRowObservacion, setDataRowObservacion] = useState<any[]>([]);
  const [dataParams, setDataParams] = useState<any[]>([]);

  /*-------------------DATOS DE INICIO DE SESION Y TOASTER --------------------------------*/
  const account = Account();
  const { status } = useSession();
  const toaster = useToaster();
  const folderModule: string = "inspecciones-planificadas";
  const urlParams = useSearchParams();

  /*-------------------------------FUNCIONES----------------------------------------*/

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

  const handleClickOpen = (data: any) => {
    setOpen(true);
    setIdUpdate(data.row.id);
    setDataRowObservacion(data);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const zfill = (value: any, length: number) => {
    const str = value.toString();
    return str.padStart(length, "0");
  };
  async function loadFilterData() {
    const listaUsuarios = await GetUsuarios(account.token);
    setListaUsuarios(listaUsuarios);
    const listaEst: any = [
      {
        label: "ABIERTO",
        value: 0,
      },
      {
        label: "EN PROCESO",
        value: 1,
      },
      {
        label: "CERRADO",
        value: 2,
      },
      {
        label: "GESTIONADO",
        value: 3,
      },
    ];
    setListaEstados(listaEst);

    const inspeciones = await getInspPlanificadas(2, account.token);
    setListaInspecciones(inspeciones);
  }

  async function uploadFiles(images: imagesType[], idAscl: number, idOpaci: number) {
    let ruta: string = `${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/` + `${process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3}/` + folderModule;
    let id = `${idAscl}_${idOpaci}`;
    await uploadIFilesS3(images, id, ruta);
  }

  async function sendEmail(datos: any, estado: number) {
    const emailUserSystem = listaUsuarios.find((val) => val.idEmpleado == account.idUser)?.email;
    const emailUserControl = listaUsuarios.find((val) => val.idEmpleado == datos.idUsuarioControl)?.email;
    const emailUserEjecucion = listaUsuarios.find((val) => val.idEmpleado == datos.idUsuarioEjecucion)?.email;

    const nameUserSystem = listaUsuarios.find((val) => val.idEmpleado == account.idUser)?.label;
    const namelUserControl = listaUsuarios.find((val) => val.idEmpleado == datos.idUsuarioControl)?.label;
    const namelUserEjecucion = listaUsuarios.find((val) => val.idEmpleado == datos.idUsuarioEjecucion)?.label;

    const listatUsuariosSendMail: ResultadoEmail[] = [
      { name: nameUserSystem, email: emailUserSystem },
      { name: namelUserControl, email: emailUserControl },
      { name: namelUserEjecucion, email: emailUserEjecucion },
    ];

    const id = zfill(datos.idAscl, 5);
    const idObservacion = datos.id;
    const idRegistro = `${id}-${idObservacion}`;

    let subject: string = "ZAMI Notificaciones (Cierre de Observaciones)";
    let proceso: string = "OPACI";
    //console.log(listatUsuariosSendMail);
    if (estado == 0) {
      subject = "ZAMI Notificaciones (Observación reabierta)";
      await sendEmailSES(listatUsuariosSendMail, account.displayName, subject, proceso, idRegistro);
    } else {
      await sendEmailCloseSES(listatUsuariosSendMail, account.displayName, subject, proceso, idRegistro);
    }
  }

  async function sendEmailReasignar(datos: any, idNewEjecutor: number) {
    /*  const emailUserSystem = listaUsuarios.find((val) => val.idEmpleado == account.idUser)?.email;
    const nameUserSystem = listaUsuarios.find((val) => val.idEmpleado == account.idUser)?.label;
    const emailUserControl = listaUsuarios.find((val) => val.idEmpleado == datos.row.idUsuarioControl)?.email;
    const nameUserControl = listaUsuarios.find((val) => val.idEmpleado == datos.row.idUsuarioControl)?.label; */
    const emailUserEjecucion = listaUsuarios.find((val) => val.idEmpleado == idNewEjecutor)?.email;
    const nameUserEjecucion = listaUsuarios.find((val) => val.idEmpleado == idNewEjecutor)?.label;

    const listatUsuariosSendMail: ResultadoEmail[] = [
      /*  { name: nameUserSystem, email: emailUserSystem },
      { name: nameUserControl, email: emailUserControl }, */
      { name: nameUserEjecucion, email: emailUserEjecucion },
    ];

    const id = zfill(datos.row.idAscl, 5);
    const idObservacion = datos.row.id;
    const idRegistro = `${id}-${idObservacion}`;

    let subject: string = "ZAMI Notificaciones (Reasignación)";
    let proceso: string = "OPACI";
    //console.log(listatUsuariosSendMail);
    await sendEmailSES(listatUsuariosSendMail, account.displayName, subject, proceso, idRegistro);
  }

  const reasignar = handleSubmit(async (data) => {
    let datos = {
      usuarioEjecucion: data.newUserEjecucion,
    };
    const response = await reasignarResponsable(idUpdate, datos, account.token);

    if (response?.status == "success") {
      SweetNotifySuccesss({ message: "Reasignación exitosa" });
      sendEmailReasignar(dataRowObservacion, data.newUserEjecucion);
      handleClose();
    } else {
      SweetNotifyError({
        message: "A ocurrido un error al intentar reasignar el responsable",
      });
    }
  });

  const handleChange = (evt: any, params: any) => {
    setStateCierre((prev) => ({ ...prev, [params.row.id]: evt.target.value }));
    setValue(`estadoCierre_${params.row.id}`, evt.target.value);
    updateCloseObs(params);
  };

  const updateCloseObs = async (params: any) => {
    const value = getValues(`estadoCierre_${params.row.id}`);
    const datos: any = {
      id: params.row.id,
      idAscl: params.row.idAscl,
    };

    datos.statusAcslDet = value;
    const typeUpdate = 2;
    let textToast = "Se ha aprobado el proceso de cierre de la observación";
    let colorNotify: any = "success";
    if (datos.statusAcslDet == 0) {
      textToast = "Se ha rechazado el proceso de cierre";
      colorNotify = "warning";
    }

    try {
      const response: ResponseCloseObseEncontradas | undefined = await closeObservaciones(datos, typeUpdate, account.token);
      if (response?.status === "success") {
        toaster.push(<Message type={colorNotify}>{textToast}</Message>);
        typeUpdate == 2 && value == 0 && sendEmail(params.row, datos.statusAcslDet);
        //console.log(params);
      } else {
        toaster.push(<Message type="error">A ocurrido un error al actualizar la observacion</Message>);
      }
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
  };

  const dataColumns: GridColDef<(typeof dataRows)[number]>[] = [
    // { field: "idAscl", headerName: "COD-IPACI", width: 100, valueGetter: (value, row) => `${zfill(`${row.idAscl}-${row.id}`, 9) || ""}` },
    {
      field: "idAscl",
      headerName: "COD-IPACI",
      width: 100,
      renderCell: (params) => (
        <Link
          onClick={() => {
            openModalCloseObservaciones(params);
          }}
          sx={{ cursor: "pointer" }}
        >
          {zfill(`${params.row.idAscl}-${params.row.id}`, 9) || ""}
        </Link>
      ),
    },

    { field: "checkOption", headerName: "ACTO/CONDICIÓN", width: 150 },
    { field: "comentarios", headerName: "OBSERVACIÓN ENCONTRADA", width: 500 },
    {
      field: "imageObservacion",
      headerName: "EVIDENCIA OBSERVACIÓN",
      width: 200,
      renderCell: (params) => (
        <Box
          sx={{
            border: 1,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            overflowX: "auto",
          }}
        >
          <CardMedia
            key={`image`}
            component="img"
            height="80"
            image={`${process.env.NEXT_PUBLIC_URL_MEDIA}/${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/${process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3}/${folderModule}/${params.row.imageObservacion}`}
            alt={params.row.imageObservacion}
          />
        </Box>
      ),
    },

    {
      field: "usuarioControl",
      headerName: "CONTROLADOR",
      width: 150,
    },
    {
      field: "usuarioEjecucion",
      headerName: "EJECUTOR",
      width: 150,
      renderCell: (params) => (
        <>
          {account.role == "root" || account.role == "admin" ? (
            <Button
              disabled={params.row.statusAcslDet == 2 || stateCierre[params.row.id] == "2" ? true : false}
              color="info"
              variant="text"
              onClick={() => {
                handleClickOpen(params);
              }}
            >
              {params.row.usuarioEjecucion}
            </Button>
          ) : (
            <span>{params.row.usuarioEjecucion}</span>
          )}
        </>
      ),
    },
    {
      field: "statusAcslDet",
      headerName: "ESTADO",
      width: 200,
      renderCell: (params: any) => (
        <>
          {account.role === "user" ? (
            params.row.statusAcslDet == 0 ? (
              <Chip icon={<WarningAmber />} label=" PENDIENTE" color="warning" sx={{ color: "white" }} />
            ) : params.row.statusAcslDet == 1 ? (
              <Chip icon={<HourglassBottom />} label=" EN PROCESO" color="primary" />
            ) : params.row.statusAcslDet == 2 ? (
              <Chip label=" ✅ CERRADO" color="success" />
            ) : (
              <Chip icon={<DoneAll />} label=" CIERRE APROBADO" color="success" />
            )
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", height: "100%", width: "100%" }}>
              <FormControl fullWidth>
                <Select
                  {...register(`estadoCierre_${params.row.id}`)}
                  name={`estadoCierre_${params.row.id}`}
                  value={stateCierre[params.row.id] ? stateCierre[params.row.id] : params.row.statusAcslDet}
                  label="Esatdo de cierre"
                  onChange={(evt) => {
                    handleChange(evt, params);
                  }}
                  size="small"
                  sx={{
                    backgroundColor: colorOptions[stateCierre[params.row.id] || params.row.statusAcslDet] || "initial",
                    color: "#FFFFFF",
                    fontSize: "0.8rem",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white",
                    },
                  }}
                >
                  <MenuItem disabled={params.row.statusAcslDet === 2 ? false : true} sx={{ color: colorOptions[0] }} value={"0"}>
                    <WarningAmber /> ABIERTO
                  </MenuItem>
                  <MenuItem disabled={true} sx={{ color: colorOptions[1] }} value={"1"}>
                    <HourglassBottom />
                    EN PROCESO
                  </MenuItem>
                  <MenuItem disabled={true} sx={{ color: colorOptions[2] }} value={"2"}>
                    <DoneAll /> CERRADO
                  </MenuItem>
                  <MenuItem disabled={params.row.statusAcslDet === 2 ? false : true} sx={{ color: colorOptions[3] }} value={"3"}>
                    <DoneAll /> CIERRE APROBADO
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </>
      ),
    },
  ];

  const searchObservaciones = handleSubmit(async (data) => {
    const datosForm = {
      // LAS KEY DE ESTE OBJETO DEBEN SER EL MISMO DATO DEL DTO EN SPRING BOOT JAVA
      idAscl: data.idInspPlanificada,
      statusAcslDet: data.estado,
      usuarioControl: data.userControl,
      usuarioEjecucion: data.userEjecucion,
    };
    // console.log(datosForm);
    const datos = Object.fromEntries(Object.entries(datosForm).filter(([_, value]) => value != undefined));
    console.log(datos);

    const response: ResponseObsEncontradasIp | undefined = await getObservacionesEncontradas(datos, account.token);
    setDataRows(response?.object ?? []);
    if (response?.object && response.object.length > 0) {
      toaster.push(<Message type="success">Registros encontrados</Message>);
    } else {
      toaster.push(<Message type="warning">No se han encontrado datos registrados</Message>);
    }
  });

  const codigoInspeccionChanged = () => {
    searchObservaciones();
  };

  const handleClickClose = () => {
    setOpenModal(false); //CAMBIO EL ESTADO DEL MODAL A FALSE (CERRADO)
  };
  const openModalCloseObservaciones = (params: any) => {
    setOpenModal(true);
    setDataParams(params);
    const datos = {
      id: params.row.id,
      idAscl: params.row.idAscl,
      accionRealizada: params.row.accionRealizadaCierre,
      estadoCierre: params.row.statusAcslDet,
      imagenAccionRealizadaCierre: params.row.imagenAccionRealizadaCierre,
      checkOption: params.row.checkOption,
      comentarios: params.row.comentarios,
      descripcionObservacion: params.row.descripcionObservacion,
      imageObservacion: params.row.imageObservacion,
      lugarObservacion: params.row.lugarObservacion,
      idUsuarioControl: params.row.idUsuarioControl,
      idUsuarioEjecucion: params.row.idUsuarioEjecucion,
      usuarioControl: params.row.usuarioControl,
      fechaObservacion: params.row.fechaRegistro,
      accionObservacion: params.row.accionObservacion,
    };
    //console.log(datos);
    reset(datos);
  };

  const registrarCierre = handleSubmit(async (data: any) => {
    const datos = {
      idObservacion: data.id,
      accionRealizadaCierre: data.accionRealizada,
      statusAcslDet: data.estadoCierre,
      imagenAccionRealizadaCierre: data.imagenAccionRealizadaCierre,
    };
    if (data.images) {
      const filesCierre = data.images.map((file: any) => `${data.idAscl}_${data.id}_${file.name}`).join(", ");
      datos.imagenAccionRealizadaCierre = filesCierre;
      //console.log(datos);
    }

    try {
      const response: ResponseCloseObseEncontradas | undefined = await closeObsOpaci(datos, datos.idObservacion, account.token);

      if (response?.status === "success") {
        handleClickClose();
        toaster.push(<Message type="success">Datos actualizados exitosamente</Message>);

        // data.images && uploadImage(data.images[0], data.idAscl, data.idIp);
        data.images && uploadFiles(data.images, data.idAscl, data.id);
        data.estadoCierre == 2 && sendEmail(data, data.estadoCierre);
      } else {
        toaster.push(<Message type="error">A ocurrido un error al actualizar el cierre de la observación</Message>);
      }
    } catch (error) {
      console.error("Error de comunicacion con el servicio", error);
    }
  });

  return (
    <PageContainer title="SSA - Cerrar OPACI" description="Cerrar Observaciones - OPACIs">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Cerrar Observaciones - OPACI</Typography>
        </Stack>

        <CloseObservacion
          open={openmodal}
          onClose={handleClickClose}
          onSubmit={registrarCierre}
          register={register}
          control={control}
          setValue={setValue}
          errors={errors}
          dataParams={dataParams}
          watch={watch}
        />

        <React.Fragment>
          <Dialog open={open} onClose={handleClose}>
            <Box component={"form"} onSubmit={reasignar}>
              <DialogTitle>{"Reasignar responsable de cierre"}</DialogTitle>
              <DialogContent>
                <SelectCC
                  _control={control}
                  _setValue={setValue}
                  label="Responsable de Ejecución "
                  name="newUserEjecucion"
                  size="small"
                  required={true}
                  errors={errors}
                  listaData={listaUsuarios}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="error" variant="contained">
                  Cancelar
                </Button>
                <Button type="submit" color="primary" variant="contained">
                  Reasignar
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        </React.Fragment>

        <Divider sx={{ borderStyle: "revert", m: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Box component={"form"} onSubmit={searchObservaciones}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={2}>
                  <SelectCC
                    _control={control}
                    _setValue={setValue}
                    label="Código de Inspección"
                    name="idInspPlanificada"
                    size="small"
                    required={false}
                    errors={errors}
                    listaData={listaInspecciones}
                    defaultValue={codigoInspeccionObject}
                    onChangeCallback={codigoInspeccionChanged}
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
                    label="Responsable de Ejecución "
                    name="userEjecucion"
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
                    label="Estado "
                    name="estado"
                    size="small"
                    required={false}
                    errors={errors}
                    listaData={listaEstados}
                  />
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
                rowHeight={80}
                disableRowSelectionOnClick
                disableColumnMenu
                sx={{
                  "& .MuiDataGrid-cell": {
                    border: "1px solid #e0e0e0",
                  },
                  "& .MuiDataGrid-row": {
                    maxHeight: "none !important",
                  },

                  "& .MuiDataGrid-columnHeader": {
                    border: "1px solid #e0e0e0",
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
