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
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import {
  getObservacionesEncontradas,
  closeObsChecklist,
  uploadImageS3,
  getCheclist,
  reasignarResponsable,
} from "@/app/controllers/qa/ControllerCheckList";
import { useForm } from "react-hook-form";
import { UploaderAvatar } from "@/app/components/uploader";
import { Message, useToaster } from "rsuite";
import { PhotoCamera, Search } from "@mui/icons-material";
import { SelectCC } from "@/app/components/select-option";
import { GetUsuarios } from "@/app/api/dataApiComponents";
import { SweetNotifyError, SweetNotifySuccesss } from "@/app/components/sweet-notificacion";
import { sendEmailCloseSES, sendEmailSES } from "@/app/controllers/common/ControllerCommon";
import { useSession } from "next-auth/react";
//----------------------------------------------------------------------------------------------------------------
//================================================================================================================

export default function FormChecklist() {
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
  const [dataRows, setDataRows] = useState<ObjectData[]>([]);
  const [stateCierre, setStateCierre] = useState<{ [key: number]: string }>({});
  const [accionRealizadaCierre, setAccionRealizadaCierre] = useState<{ [key: number]: string }>({});
  const [listaChecklist, setListaChecklist] = useState<any[]>([]);
  const [listaUsuarios, setListaUsuarios] = useState<any[]>([]);
  const [listaEstados, setListaEstados] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [idUpdate, setIdUpdate] = useState<number | undefined>();
  const [dataRowObservacion, setDataRowObservacion] = useState<any[]>([]);

  /*-------------------DATOS DE INICIO DE SESION Y TOASTER --------------------------------*/
  const account = Account();
  const { status } = useSession();
  const toaster = useToaster();
  const folderModule: string = "inspecciones-qa";
  const fechaActual = new Date();

  const colorOptions: any = {
    "0": "#F4D03F", // Naranja ABIERTO
    "1": "#2196F3", // Azul EN PROCESO
    "2": "#52BE80", // Verde CERRADO
    "-1": "#F1948A", // Gris NO APLICA
  };
  const dataColumns: GridColDef<(typeof dataRows)[number]>[] = [
    //{ field: "id", headerName: "ID", width: 70 },
    { field: "idChecklist", headerName: "CHECKLIST", width: 100, valueGetter: (value, row) => `${zfill(`${row.idChecklist}-${row.id}`, 9) || ""}` },
    { field: "observacionEncontrada", headerName: "OBSERVACIÓN ENCONTRADA", width: 400 },
    {
      field: "imagenObservacion",
      headerName: "EVIDENCIA OBSEERVACIÓN",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ border: 1, display: "flex", justifyContent: "flex-start", alignItems: "center", overflowX: "auto" }}>
          <CardMedia
            key={`image`}
            component="img"
            height="80"
            image={`${process.env.NEXT_PUBLIC_URL_MEDIA}/${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/${process.env.NEXT_PUBLIC_URL_FOLDER_QA_S3}/${folderModule}/${params.row.imagenObservacion}`}
            alt={params.row.imagenObservacion}
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
          disabled={params.row.estadoObservacionCierre == "2" || stateCierre[params.row.id] == "2" ? true : false}
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
              params.row.imagenObservacionCierre
                ? `${process.env.NEXT_PUBLIC_URL_MEDIA}/${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/${process.env.NEXT_PUBLIC_URL_FOLDER_QA_S3}/${folderModule}/${params.row.imagenObservacionCierre}`
                : ""
            }
            disabled={params.row.estadoObservacionCierre == "2" || stateCierre[params.row.id] == "2" ? true : false}
          />
        </Box>
      ),
    },
    { field: "userNameControl", headerName: "CONTROLADOR", width: 150 },

    {
      field: "userNameEjecucion",
      headerName: "EJECUTOR",
      width: 150,
      renderCell: (params) => (
        <>
          {account.role == "root" || account.role == "admin" ? (
            <Button
              disabled={params.row.estadoObservacionCierre == "2" || stateCierre[params.row.id] == "2" ? true : false}
              color="info"
              variant="text"
              onClick={() => {
                handleClickOpen(params);
              }}
            >
              {params.row.userNameEjecucion}
            </Button>
          ) : (
            <span>{params.row.userNameEjecucion}</span>
          )}
        </>
      ),
    },
    {
      field: "estadoObservacionCierre",
      headerName: "ESTADO",
      width: 200,
      renderCell: (params) => (
        <Box>
          <FormControl fullWidth>
            <Select
              {...register(`estadoCierre_${params.row.id}`)}
              name={`estadoCierre_${params.row.id}`}
              value={stateCierre[params.row.id] ? stateCierre[params.row.id] : params.row.estadoObservacionCierre}
              label="Esatdo de cierre"
              onChange={(evt) => {
                handleChange(evt, params, 2);
              }}
              sx={{
                backgroundColor: colorOptions[stateCierre[params.row.id] || params.row.estadoObservacionCierre] || "initial",
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
              <MenuItem sx={{ color: colorOptions[-1] }} value={"-1"}>
                NO APLICA
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      ),
    },
  ];

  /*-------------------------------FUNCIONES----------------------------------------*/

  useEffect(() => {
    if (status === "authenticated") {
      loadFilterData();
    }
  }, [status, account.token]);

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
        label: "NO APLICA",
        value: -1,
      },
    ];
    setListaEstados(listaEst);

    const checklists = await getCheclist(account.token);
    setListaChecklist(checklists);
  }

  async function uploadImage(images: imageType, params: any) {
    // console.log(images);
    let ruta: string = `${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/` + `${process.env.NEXT_PUBLIC_URL_FOLDER_QA_S3}/` + folderModule;
    let id = `${params.row.idChecklist}_${params.row.id}`;
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
      // setImagenObsCierre((prev) => ({ ...prev, [params.row.id]: evt.name }));
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
      idChecklist: params.row.idChecklist,
    };
    let typeUpdate = 0;
    let textToast = "";
    if (nameField == "estadoCierre_") {
      datos.estadoObservacionCierre = value;
      typeUpdate = 2;
      textToast = "Se ha actualizado el estado de la observación";
    } else if (nameField == "accionRealizada_") {
      datos.accionRealizadaCierre = value;
      typeUpdate = 1;
      textToast = "Se ha registrado la acción realizada";
    } else if (nameField == "images_") {
      datos.imagenObservacionCierre = value;
      typeUpdate = 3;
      textToast = "Se ha cargado la imagen del cierre de la observación";
    }

    //console.log(datos);

    try {
      const response: ResponseCloseObseEncontradas | undefined = await closeObsChecklist(datos, typeUpdate, account.token);
      if (response?.status === "success") {
        toaster.push(<Message type="success">{textToast}</Message>);
        typeUpdate == 2 && value == 2 && sendEmail(params);
      } else {
        toaster.push(<Message type="error">A ocurrido un error al actualizar la observacion</Message>);
      }
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
  };
  async function sendEmail(datos: any) {
    const emailUserControl = listaUsuarios.find((val) => val.idEmpleado == datos.row.idUserControl)?.email;
    const emailUserEjecucion = listaUsuarios.find((val) => val.idEmpleado == datos.row.idUserEjecucion)?.email;

    const listatUsuariosSendMail: ResultadoEmail[] = [
      { name: "", email: emailUserControl },
      { name: "", email: emailUserEjecucion },
    ];
    const id = zfill(datos.row.idChecklist, 5);
    const idObservacion = datos.row.id;
    const idRegistro = `${id}-${idObservacion}`;

    let subject: string = "ZAMI Notificaciones (Cierre de Observaciones)";
    let proceso: string = "CHECKLIST DE OPERACIÓN";
    await sendEmailCloseSES(listatUsuariosSendMail, account.displayName, subject, proceso, idRegistro);
  }

  const handleClickOpen = (data: any) => {
    setOpen(true);
    setIdUpdate(data.row.id);
    setDataRowObservacion(data);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const searchObs = handleSubmit(async (data) => {
    const datosForm = {
      // LAS KEY DE ESTE OBJETO DEBEN SER EL MISMO DATO DEL DTO EN SPRING BOOT JAVA
      idChecklist: data.idChecklist,
      estadoObservacionCierre: data.estado,
      userNameControl: data.userControl,
      userNameEjecucion: data.userEjecucion,
      checkOption: 1,
    };
    // console.log(datosForm);
    const datos = Object.fromEntries(Object.entries(datosForm).filter(([_, value]) => value != undefined));
    const response: ResponseObsEncontradas | undefined = await getObservacionesEncontradas(datos, account.token);
    setDataRows(response?.object ?? []);

    if (response?.object && response.object.length) {
      toaster.push(<Message type="success">Registros encontrados</Message>);
    } else {
      toaster.push(<Message type="warning">No se han encontrados registros</Message>);
    }
  });

  const reasignar = handleSubmit(async (data) => {
    let datos = {
      userNameEjecucion: data.newUserEjecucion,
    };
    const response = await reasignarResponsable(idUpdate, datos, account.token);

    if (response?.status == "success") {
      SweetNotifySuccesss({ message: "Reasignación exitosa" });
      sendEmailReasignar(dataRowObservacion, data.newUserEjecucion);
      handleClose();
    } else {
      SweetNotifyError({ message: "A ocurrido un error al intentar reasignar el responsable" });
    }
  });

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

    const id = zfill(datos.row.idChecklist, 5);
    const idObservacion = datos.row.id;
    const idRegistro = `${id}-${idObservacion}`;

    let subject: string = "ZAMI Notificaciones (Reasignación)";
    let proceso: string = "CHECKLIST DE OPERACIÓN";
    //console.log(listatUsuariosSendMail);
    await sendEmailSES(listatUsuariosSendMail, account.displayName, subject, proceso, idRegistro);
  }

  return (
    <PageContainer title="QA - CheckList" description="Cierre de Observaciones">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">QA - Cierre de Observaciones</Typography>
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
            <Box component={"form"} onSubmit={searchObs}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={2}>
                  <SelectCC
                    _control={control}
                    _setValue={setValue}
                    label=" Seleccione el código del checklist "
                    name="idChecklist"
                    size="small"
                    required={false}
                    errors={errors}
                    listaData={listaChecklist}
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
