/*
 * Created on Mon Jul 22 2024
 *
 * Copyright (c) 2024 CC
 *
 * Author Cristian R. Paz
 */

import { Account } from "@/app/_mock/account";
import PageContainer from "@/app/components/container/PageContainer";
import {
  Box,
  Button,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
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
import { PhotoCamera, Search } from "@mui/icons-material";
import { SelectCC } from "@/app/components/select-option";
import { GetUsuarios } from "@/app/api/dataApiComponents";
import { closeObservaciones, getInspPlanificadas, getObservacionesEncontradas, reasignarResponsable } from "@/app/controllers/ssa/ControllerAscl";
import { sendEmailCloseSES, sendEmailSES, uploadImageS3 } from "@/app/controllers/common/ControllerCommon";
import { SweetNotifyError, SweetNotifySuccesss } from "@/app/components/sweet-notificacion";
//----------------------------------------------------------------------------------------------------------------
//================================================================================================================

export default function FormIpClose() {
  /*--------------------------------------------------REACT HOCK FORM ---------------------------------------*/
  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();

  /*----------------------------------------LISTAS USE STATE-----------------------------------------------*/
  const [dataRows, setDataRows] = useState<ObjectDataIp[]>([]);
  const [stateCierre, setStateCierre] = useState<{ [key: number]: string }>({});
  const [accionRealizadaCierre, setAccionRealizadaCierre] = useState<{ [key: number]: string }>({});
  const [listaInspecciones, setListaInspecciones] = useState<any[]>([]);
  const [listaUsuarios, setListaUsuarios] = useState<any[]>([]);
  const [listaEstados, setListaEstados] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [idUpdate, setIdUpdate] = useState<number | undefined>();
  const [dataRowObservacion, setDataRowObservacion] = useState<any[]>([]);

  /*-------------------DATOS DE INICIO DE SESION Y TOASTER --------------------------------*/
  const account = Account();
  const toaster = useToaster();
  const folderModule: string = "inspecciones-planificadas";
  const fechaActual = new Date();
  /*-------------------------------FUNCIONES----------------------------------------*/

  useEffect(() => {
    loadFilterData();
  }, []);

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
    const listaUsuarios = await GetUsuarios();
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
    ];
    setListaEstados(listaEst);

    const inspeciones = await getInspPlanificadas(2);
    setListaInspecciones(inspeciones);
  }

  async function uploadImage(images: imageType, params: any) {
    // console.log(images);
    let ruta: string = `${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/` + `${process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3}/` + folderModule;
    let id = `${params.row.idAscl}_${params.row.id}`;
    await uploadImageS3(images, id, ruta);
  }

  const handleChange = (evt: any, params: any, typeUpdate: number) => {
    //console.log(evt);
    if (typeUpdate == 1) {
      setAccionRealizadaCierre((prev) => ({ ...prev, [params.row.id]: evt.target.value }));
      setValue(`accionRealizada_${params.row.id}`, evt.target.value);
    }
    if (typeUpdate == 2) {
      setStateCierre((prev) => ({ ...prev, [params.row.id]: evt.target.value }));
      setValue(`estadoCierre_${params.row.id}`, evt.target.value);
      updateCloseObs(params, "estadoCierre_");
    }

    if (typeUpdate == 3) {
      setValue(`images_${params.row.id}`, evt.name);
      updateCloseObs(params, "images_");
      uploadImage(evt, params);
      //console.log(imagenObsCierre);
    }
  };

  const updateCloseObs = async (params: any, nameField: string) => {
    const value = getValues(`${nameField}${params.row.id}`);
    const datos: any = {
      id: params.row.id,
      idAscl: params.row.idAscl,
    };
    let typeUpdate = 0;
    let textToast = "";
    if (nameField == "estadoCierre_") {
      datos.statusAcslDet = value;
      typeUpdate = 2;
      textToast = "Se ha actualizado el estado de la observación";
    } else if (nameField == "accionRealizada_") {
      datos.accionRealizadaCierre = value;
      typeUpdate = 1;
      textToast = "Se ha registrado la acción realizada";
    } else if (nameField == "images_") {
      datos.imagenAccionRealizadaCierre = value;
      typeUpdate = 3;
      textToast = "Se ha cargado la imagen del cierre de la observación";
    }

    //console.log(datos);

    try {
      const response: ResponseCloseObseEncontradas | undefined = await closeObservaciones(datos, typeUpdate);
      if (response?.status === "success") {
        toaster.push(<Message type="success">{textToast}</Message>);
        typeUpdate == 2 && value == 2 && sendEmail(params);
        console.log(params);
      } else {
        toaster.push(<Message type="error">A ocurrido un error al actualizar la observacion</Message>);
      }
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
  };
  async function sendEmail(datos: any) {
    const emailUserSystem = listaUsuarios.find((val) => val.idEmpleado == account.idUser)?.email;
    const emailUserControl = listaUsuarios.find((val) => val.idEmpleado == datos.row.idUsuarioControl)?.email;
    const emailUserEjecucion = listaUsuarios.find((val) => val.idEmpleado == datos.row.idUsuarioEjecucion)?.email;

    const listatUsuariosSendMail: ResultadoEmail[] = [
      { name: "", email: emailUserSystem },
      { name: "", email: emailUserControl },
      { name: "", email: emailUserEjecucion },
    ];
    const id = zfill(datos.row.idAscl, 5);
    const idObservacion = datos.row.id;
    const idRegistro = `${id}-${idObservacion}`;

    let subject: string = "ZAMI Notificaciones (Cierre de Observaciones)";
    let proceso: string = "OPACI";
    console.log(listatUsuariosSendMail);
    await sendEmailCloseSES(listatUsuariosSendMail, account.displayName, subject, proceso, idRegistro);
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
    const response = await reasignarResponsable(idUpdate, datos);

    if (response?.status == "success") {
      SweetNotifySuccesss({ message: "Reasignación exitosa" });
      sendEmailReasignar(dataRowObservacion, data.newUserEjecucion);
      handleClose();
    } else {
      SweetNotifyError({ message: "A ocurrido un error al intentar reasignar el responsable" });
    }
  });

  const colorOptions: any = {
    "0": "#F4D03F", // Naranja ABIERTO
    "1": "#2196F3", // Azul EN PROCESO
    "2": "#52BE80", // Verde CERRADO
  };
  const dataColumns: GridColDef<(typeof dataRows)[number]>[] = [
    { field: "idAscl", headerName: "COD-IPACI", width: 100, valueGetter: (value, row) => `${zfill(`${row.idAscl}-${row.id}`, 9) || ""}` },
    //{ field: "id", headerName: "ID", width: 70 },
    { field: "checkOption", headerName: "ACTO/CONDICIÓN", width: 150 },
    { field: "comentarios", headerName: "OBSERVACIÓN ENCONTRADA", width: 400 },
    {
      field: "imageObservacion",
      headerName: "EVIDENCIA OBSEERVACIÓN",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ border: 1, display: "flex", justifyContent: "flex-start", alignItems: "center", overflowX: "auto" }}>
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
      field: "accionRealizadaCierre",
      headerName: "ACCIÓN REALIZADA",
      width: 300,
      editable: false,
      renderCell: (params) => (
        <TextField
          disabled={params.row.statusAcslDet == 2 || stateCierre[params.row.id] == "2" ? true : false}
          fullWidth
          type="text"
          {...register(`accionRealizada_${params.row.id}`)}
          name={`accionRealizada_${params.row.id}`}
          rows={2}
          multiline
          value={accionRealizadaCierre[params.row.id] ? accionRealizadaCierre[params.row.id] : params.row.accionRealizadaCierre}
          onChange={(evt) => {
            handleChange(evt, params, 1);
          }}
          onBlur={(_) => {
            updateCloseObs(params, "accionRealizada_");
          }}
          onKeyDown={(evt) => {
            if (evt.key === " ") {
              evt.stopPropagation();
            }
          }}
        />
      ),
    },
    {
      field: "imagenObservacionCierre",
      headerName: "IMAGEN CIERRE",
      width: 150,
      align: "center",
      renderCell: (params) => (
        <Box>
          <UploaderAvatar
            _control={control}
            name={`images_${params.row.id}`}
            icon={<PhotoCamera />}
            required={false}
            multiple={false}
            errors={errors}
            shouldFocus={false}
            onUploadCallback={(evt) => {
              handleChange(evt, params, 3);
            }}
            imagePreview={
              params.row.imagenAccionRealizadaCierre
                ? `${process.env.NEXT_PUBLIC_URL_MEDIA}/${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/${process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3}/${folderModule}/${params.row.imagenAccionRealizadaCierre}`
                : ""
            }
            disabled={params.row.statusAcslDet == 2 || stateCierre[params.row.id] == "2" ? true : false}
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
      renderCell: (params) => (
        <Box>
          <FormControl fullWidth>
            <Select
              {...register(`estadoCierre_${params.row.id}`)}
              name={`estadoCierre_${params.row.id}`}
              value={stateCierre[params.row.id] ? stateCierre[params.row.id] : params.row.statusAcslDet}
              label="Esatdo de cierre"
              onChange={(evt) => {
                handleChange(evt, params, 2);
              }}
              sx={{
                backgroundColor: colorOptions[stateCierre[params.row.id] || params.row.statusAcslDet] || "initial",
                color: "#FFFFFF",
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
              <MenuItem sx={{ color: colorOptions[0] }} value={"0"}>
                ⚠️ ABIERTO
              </MenuItem>
              <MenuItem sx={{ color: colorOptions[1] }} value={"1"}>
                📶EN PROCESO
              </MenuItem>
              <MenuItem sx={{ color: colorOptions[2] }} value={"2"}>
                ✅ CERRADO
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
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
    //console.log(datos);

    const response: ResponseObsEncontradasIp | undefined = await getObservacionesEncontradas(datos);
    setDataRows(response?.object ? response.object : []);
    toaster.push(<Message type="success">Datos encontrados</Message>);
  });

  return (
    <PageContainer title="SSA - CheckList" description="Cerrar Observaciones - OPACI">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Cerrar Observaciones - OPACI</Typography>
        </Stack>
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
                    label="Código de  Inspeccion "
                    name="idInspPlanificada"
                    size="small"
                    required={false}
                    errors={errors}
                    listaData={listaInspecciones}
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
