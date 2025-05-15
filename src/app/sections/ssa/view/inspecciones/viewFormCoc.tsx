/*
 * Created on Tue Mar 04 2025
 *
 * Copyright (c) 2025 CC
 *
 * Author Cristian R. Paz
 */

import { Panel, Steps } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import PageContainer from "@/app/components/container/PageContainer";
import BaseCard from "@/app/components/shared/BaseCard";
import {
  Alert,
  alpha,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  Collapse,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Account } from "@/app/_mock/account";
import { FirstPage, LastPage, Checklist, Article, ArrowDropDown, TaskAlt, NoteAdd, Task, CheckCircleOutline, WidthFull } from "@mui/icons-material";
import { GetLugarObs, GetUsuarios } from "@/app/api/dataApiComponents";
import { useForm } from "react-hook-form";
import { primary } from "@/theme/palette";
import { SelectCC } from "@/app/components/select-option";
import { DateCC } from "@/app/components/date-hour";
import { InputTextAreaCC } from "@/app/components/input";
import { UploaderCC } from "@/app/components/uploader";

import { SweetNotifyError, SweetNotifySuccesss } from "@/app/components/sweet-notificacion";
import { _saveCheckList, GetOpcChecklist, GetTipoCheckList } from "@/app/controllers/qa/ControllerCheckList";
//import { uploadImagesS3 } from "@/app/controllers/ssa/ControllerAscl";
import { sendEmailSES, uploadImagesS3 } from "@/app/controllers/common/ControllerCommon";
import { useSession } from "next-auth/react";

export default function FormCoc() {
  /*--------------------------------------------------REACT HOCK FORM AND THEME---------------------------------------*/
  const {
    register,
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const theme = useTheme();

  /*--------------------------------------------------LISTAS USE STATE-----------------------------------------------*/
  const [listaLugarObs, setlistaLugarObs] = useState<any[]>([]);
  const [listaUsuarios, setlistaUsuarios] = useState<any[]>([]);
  const [listaTipoCheckList, setlistaTipoCheckList] = useState<any[]>([]);
  const [listaOpcionesChecklist, setListaOpcionesChecklist] = useState<any[]>([]);
  const [listaObsEncontradas, setlistaObsEncontradas] = useState<any[]>([]);
  const [listaCategoriasOpc, setListaCategorias] = useState<any[]>([]);
  const [listaCategoriasOpcNew, setListaCategoriasOpcNew] = useState<any[]>([]);

  const [nombreTipoChecklist, setNombreTipoChecklist] = useState("");
  const [idTipoChecklist, setIdTipoChecklist] = useState<number>();

  /*-------------------DATOS DE INICIO DE SESION Y FECHA ACTUAL --------------------------------*/

  const account = Account();
  const { status } = useSession();
  const fechaActual = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(
    2,
    "0"
  )}`;

  /*-------------------------------ESTE METODO ARRANCA CON EL DOOM--------------------------------------*/
  useEffect(() => {
    if (status === "authenticated") {
      loadDataApi();
    }
  }, [status, account.token]);

  /*****OPEN: FUNCIONES PARA LOS STIPS OPTIONS****/
  const StipArrayOpc = [" Generar CheckList", " Asignar Responsable", " Revisar y Finalizar"];
  const [step, setStep] = useState(0);
  const [namePanel, setnamePanel] = useState(StipArrayOpc[0]);
  const [showForm, setShowForm] = useState(0);

  const onChange = (nextStep: any) => {
    setStep(nextStep < 0 ? 0 : nextStep > 2 ? 2 : nextStep);
    setShowForm(nextStep);
    setnamePanel(nextStep === 0 ? StipArrayOpc[0] : nextStep === 1 ? StipArrayOpc[1] : StipArrayOpc[2]);
  };

  const onNext = () => onChange(step + 1);
  const onPrevious = () => onChange(step - 1);
  /****CLOSE: FUNCIONES PARA LOS STIPS OPTIONS****/

  /*----------------------------------------------------------------------------------------------------------------------------*/

  /***OPEN: FUNCIONES PARA LAS OPCIOPNES DEL CHECKLIST***/
  const [isChecked, setIsChecked] = useState<{ [key: number]: boolean }>({});
  const [isCheckedPnel, setIsCheckedPanel] = useState<number>(0);

  const setCheckedStatus = (evt: any, id: number) => {
    setIsCheckedPanel(id);
    setIsChecked((prev) => ({ ...prev, [id]: evt.target.checked }));
  };

  const openPanel = (id: any) => {
    setIsCheckedPanel(id);
  };
  const handleTipoChecklistChange = async (newVal: OptionCheclist | null) => {
    //Alimentamos o cargamos las opciopnes del checklist

    const listaOpciones = await GetOpcChecklist(newVal, account.token);
    //console.log("Lista Opciones de categoria=======>>>>>>", listaOpciones)

    setListaOpcionesChecklist(listaOpciones);

    //Obtenemos el nombre del tipo de checklist seleccionado
    const nameTipoCheclist = listaTipoCheckList.find((item) => item.value === newVal?.value)?.label;
    setNombreTipoChecklist(nameTipoCheclist);
    //console.log("Nombre Categoria=======>>>>>>", nameTipoCheclist)
    setIdTipoChecklist(newVal?.value);

    //Obtenemos las categorias de cada opcion del checklist
    const listaCategorias = Array.from(
      new Map(listaOpciones.map((item: any) => [item.idCategoria, { idCategoria: item.idCategoria, nombreCategoria: item.nombreCategoria }])).values()
    );
    setListaCategorias(listaCategorias);
  };

  /*-------------------------------FUNCIONES----------------------------------------*/
  async function loadDataApi() {
    const lugares = await GetLugarObs(account.token);
    const tipoChecklist = await GetTipoCheckList(account.token, 1);
    const usuarios = await GetUsuarios(account.token);
    setlistaLugarObs(lugares);
    setlistaTipoCheckList(tipoChecklist);
    setlistaUsuarios(usuarios);
  }

  const registrarProceso = handleSubmit(async (data: any) => {
    if (showForm === 0) {
      createListaObservaciones(data);
      onNext();
    } else if (showForm === 1) {
      createListaObservaciones(data);
      onNext();
    } else if (showForm === 2) {
      let estado = 2;
      await saveChecklist(data, estado);
    }
  });

  function createListaObservaciones(data: any) {
    const observaciones = listaOpcionesChecklist
      .filter((val_) => data[`check_${val_.value}`] === true)
      .map((val) => ({
        observacionEncontrada: data[`detalle_${val.value}`],
        idObservacion: val.value,
        checkOption: data[`check_${val.value}`] ? 1 : 0,
        imagenObservacion: data[`imagen_${val.value}`],
        responsableEjecucion: data[`responsableEjec_${val.value}`],
        accionInmediata: data[`accion_inmediata_${val.value}`],
        idCategoria: val.idCategoria,
        nombreCategoria: val.nombreCategoria,
      }));
    // console.log("lista observaciones encontradas ", observaciones);
    setlistaObsEncontradas(observaciones);

    const lista = Array.from(
      new Map(observaciones.map((item: any) => [item.idCategoria, { idCategoria: item.idCategoria, nombreCategoria: item.nombreCategoria }])).values()
    );
    setListaCategoriasOpcNew(lista);
  }

  async function saveChecklist(data: any, estado: number) {
    //console.log(data);
    const datosDetalle = listaOpcionesChecklist.map((val) => ({
      accionInmediata: data[`accion_inmediata_${val.value}`] ? data[`accion_inmediata_${val.value}`] : null,
      imagenObservacion: data[`imagen_${val.value}`] ? data[`imagen_${val.value}`][0].name : null,
      imagenObservacionData: data[`imagen_${val.value}`] ? data[`imagen_${val.value}`][0] : null,
      observacionEncontrada: data[`detalle_${val.value}`],
      optionChecklist: { idOptionChecklist: val.value },
      checkOption: data[`check_${val.value}`] ? 1 : 0,
      responsableEjecucion: {
        idUser: data[`responsableEjec_${val.value}`] ? data[`responsableEjec_${val.value}`] : null,
      },
      estadoObservacionCierre: 0,
      accionRealizadaCierre: "",
    }));
    const datos = {
      fecha: fechaActual,
      fechaRegistro: data.fecha,
      observaciones: data.observacion,
      lugarObservacion: { idLugarObser: data.areaChecklist },
      estado: estado,
      responsableControl: { idUser: account.idUser },
      tipoChecklist: { idTipoChecklist: idTipoChecklist },
      datosDetalleChecklist: datosDetalle,
    };
    //console.log("datos: ", datos);

    try {
      const response: ResponseSaveCheckList | undefined = await _saveCheckList(datos, account.token);

      if (response?.status === "success") {
        SweetNotifySuccesss({ message: "Check list registrado exitosamente" });
        onNext();
        sendEmail(datos.datosDetalleChecklist, response?.object.idChecklist);
        uploadImages(datos.datosDetalleChecklist, response?.object.idChecklist); //Itera el objeto y extrae las imagenes cada imagen concateno con el id que me devuelve al guardar el registro
      } else {
        SweetNotifyError({ message: "A ocurrido un error al registrar el checklist" });
      }
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
  }

  async function uploadImages(detalle: any, id: number) {
    let folderModule: string = "inspecciones-ssa";
    let ruta: string = `${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/` + `${process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3}/` + folderModule;
    const images = detalle.filter((data: any) => data.imagenObservacionData != null).map((val: any) => (val = val.imagenObservacionData));
    await uploadImagesS3(images, id, ruta);
  }

  async function sendEmail(detalle: any, idRegistro: number) {
    const usuarios = detalle
      .filter((val: any) => val.responsableEjecucion.idUser != null)
      .map((val: any) => ({ idUser: (val = val.responsableEjecucion.idUser) }));

    const listatUsuariosMail: ResultadoEmail[] = [];
    listaUsuarios.map((row) => {
      usuarios.map((val: any) => {
        if (row.idEmpleado == val.idUser) {
          listatUsuariosMail.push({ name: row.label, email: row.email });
        }
      });
    });
    listatUsuariosMail.push({ name: account.displayName, email: account.email });

    let subject: string = "ZAMI Notificaciones";
    let proceso: string = nombreTipoChecklist;

    const listatUsuariosMailSend = listatUsuariosMail.filter((obj, index, self) => self.findIndex((o) => o.email === obj.email) === index); //ELIMINO DUPLICADOS
    await sendEmailSES(listatUsuariosMailSend, account.displayName, subject, proceso, idRegistro);
  }
  const newRegister = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_HOST_URL}/pages/ssa/formcoc `;
  };

  return (
    <PageContainer title="SSA - CheckList" description="SSA - CheckList">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">SSA - CheckList</Typography>
        </Stack>
        <Divider sx={{ borderStyle: "revert", m: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <BaseCard title="">
              <Stack spacing={3}>
                <div>
                  <Box
                    component="form"
                    onSubmit={registrarProceso}
                    sx={{
                      alignItems: "center",
                      maxWidth: 900,
                      mx: "auto",
                      mt: 2,
                    }}
                  >
                    <div>
                      <Steps current={step}>
                        <Steps.Item
                          title={step === 0 ? "Generar CheckList" : step === 1 || step === 2 ? "Finalizado" : "Por Completar"}
                          //description={StipArrayOpc[0]}
                        />
                        <Steps.Item
                          title={step === 1 ? "Asignar Responsable" : step === 2 ? "Finalizado" : "Por Completar"}
                          // description={StipArrayOpc[1]}
                        />
                        <Steps.Item
                          title={step === 2 ? "Revisar y Finalizar" : step === 3 ? "Finalizado" : "Por Completar"}
                          //description={StipArrayOpc[2]}
                        />
                      </Steps>
                      <hr />
                      <Panel header={<Typography></Typography>}>
                        {showForm == 0 && (
                          <Box component="section">
                            <Grid container spacing={2} paddingBottom={30}>
                              <Grid item xs={12} md={12}>
                                <DateCC _control={control} _setValue={setValue} label="Fechas" name="fecha" required={true} errors={errors} />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <SelectCC
                                  _control={control}
                                  _setValue={setValue}
                                  label=" Área del Checklist"
                                  name="areaChecklist"
                                  size="small"
                                  required={true}
                                  errors={errors}
                                  listaData={listaLugarObs}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <SelectCC
                                  _control={control}
                                  _setValue={setValue}
                                  label=" Tipo de Checklist"
                                  name="tipoChecklist"
                                  size="small"
                                  required={true}
                                  errors={errors}
                                  listaData={listaTipoCheckList}
                                  onChangeCallback={handleTipoChecklistChange}
                                />
                              </Grid>

                              {listaOpcionesChecklist.length > 0 ? (
                                listaCategoriasOpc.map((categoria, index) => (
                                  <Card key={index} sx={{ mb: 3, mt: 3, boxShadow: 3, borderRadius: 0, width: "100%" }}>
                                    <CardHeader
                                      title={categoria.nombreCategoria}
                                      sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        fontWeight: "bold",
                                        borderBottom: `3px solid ${theme.palette.primary.main}`,
                                        color: theme.palette.grey[600],
                                      }}
                                    />

                                    <CardContent>
                                      <Grid container spacing={2}>
                                        {listaOpcionesChecklist
                                          .filter((data) => data.idCategoria == categoria.idCategoria)
                                          .map((data) => (
                                            <Grid item xs={12} key={data.value}>
                                              <Paper
                                                elevation={5}
                                                sx={{
                                                  p: 2,
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "space-between",
                                                  borderRadius: 2,
                                                  transition: "0.3s",
                                                  "&:hover": {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                                  },
                                                }}
                                              >
                                                <FormControlLabel
                                                  control={
                                                    <Checkbox
                                                      {...register(`check_${data.value}`, {
                                                        required: { value: isChecked[data.value], message: "es requerido" },
                                                      })}
                                                      name={`check_${data.value}`}
                                                      checked={isChecked[data.value] || false}
                                                      onChange={(evt) => setCheckedStatus(evt, data.value)}
                                                    />
                                                  }
                                                  label={<Typography variant="body1">{data.label}</Typography>}
                                                />
                                                <IconButton onClick={() => openPanel(data.value)} color="primary">
                                                  <ArrowDropDown fontSize="large" />
                                                </IconButton>
                                              </Paper>

                                              <Collapse in={isChecked[data.value] && isCheckedPnel == data.value} timeout="auto">
                                                <Box sx={{ p: 2, mt: 1, borderLeft: `4px solid ${theme.palette.primary.main}`, borderRadius: 1 }}>
                                                  <InputTextAreaCC
                                                    register={register}
                                                    label="Detalle la observación encontrada"
                                                    icon={<Article />}
                                                    name={`detalle_${data.value}`}
                                                    size="small"
                                                    required={isChecked[data.value]}
                                                    errors={errors}
                                                    rows={3}
                                                  />
                                                  <UploaderCC
                                                    _control={control}
                                                    label="Foto: novedad encontrada"
                                                    name={`imagen_${data.value}`}
                                                    required={isChecked[data.value]}
                                                    multiple={false}
                                                    errors={errors}
                                                    shouldFocus={false}
                                                  />
                                                </Box>
                                              </Collapse>
                                            </Grid>
                                          ))}
                                      </Grid>
                                    </CardContent>
                                  </Card>
                                ))
                              ) : (
                                <Box
                                  sx={{
                                    p: 5,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                  }}
                                >
                                  <Alert severity="info">No hay opciones disponibles.</Alert>
                                </Box>
                              )}
                              <Grid item xs={12} md={12}>
                                <InputTextAreaCC
                                  register={register}
                                  label="Observación general"
                                  icon={<Article />}
                                  name="observacion"
                                  size="small"
                                  required={false}
                                  errors={errors}
                                  rows={3}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                        {showForm == 1 && (
                          <Box component="section">
                            <Grid container spacing={2}>
                              {listaObsEncontradas.length > 0 ? (
                                listaCategoriasOpcNew.map((categoria, index) => (
                                  <Card key={index} sx={{ mb: 3, mt: 3, boxShadow: 3, borderRadius: 0, width: "100%" }}>
                                    <CardHeader
                                      title={categoria.nombreCategoria}
                                      sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        fontWeight: "bold",
                                        borderBottom: `3px solid ${theme.palette.primary.main}`,
                                        color: theme.palette.grey[600],
                                      }}
                                    />
                                    <CardContent>
                                      <Grid container spacing={2}>
                                        {listaObsEncontradas
                                          .filter((data) => data.idCategoria == categoria.idCategoria)
                                          .map((data, index2) => (
                                            <Grid item xs={12} md={12} key={index2}>
                                              <Paper
                                                elevation={5}
                                                sx={{
                                                  p: 2,
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "space-between",
                                                  borderRadius: 2,
                                                  transition: "0.3s",
                                                  "&:hover": {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                                  },
                                                }}
                                              >
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                  {data.observacionEncontrada}
                                                </Typography>

                                                <IconButton onClick={() => openPanel(data.idObservacion)} color="primary">
                                                  <ArrowDropDown />
                                                </IconButton>
                                              </Paper>
                                              <Collapse in={isCheckedPnel == data.idObservacion}>
                                                <Box
                                                  sx={{
                                                    p: 2,
                                                    mt: 1,
                                                    borderLeft: `4px solid ${alpha(theme.palette.primary.main, 0.7)}`,
                                                    borderRadius: 1,
                                                  }}
                                                >
                                                  <InputTextAreaCC
                                                    register={register}
                                                    label="Detalle una acción inmediata"
                                                    icon={<Article />}
                                                    name={`accion_inmediata_${data.idObservacion}`}
                                                    size="small"
                                                    required={true}
                                                    errors={errors}
                                                    rows={3}
                                                  />
                                                  <Box sx={{ mt: 2 }}>
                                                    <SelectCC
                                                      _control={control}
                                                      _setValue={setValue}
                                                      label="Responsable de la ejecución"
                                                      name={`responsableEjec_${data.idObservacion}`}
                                                      size="small"
                                                      required={true}
                                                      errors={errors}
                                                      listaData={listaUsuarios}
                                                    />
                                                  </Box>
                                                </Box>
                                              </Collapse>
                                            </Grid>
                                          ))}
                                      </Grid>
                                    </CardContent>
                                  </Card>
                                ))
                              ) : (
                                <Box
                                  sx={{
                                    p: 5,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                  }}
                                >
                                  <Alert severity="info">No hay opciones disponibles.</Alert>
                                </Box>
                              )}
                            </Grid>
                          </Box>
                        )}
                        {showForm == 2 && (
                          <Box component="section">
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={12}>
                                <TableContainer component={Paper}>
                                  <Table
                                    style={{
                                      border: "1px solid #EBEDEF",
                                      padding: "5px",
                                    }}
                                  >
                                    {listaObsEncontradas.map((val, index) => {
                                      return (
                                        <TableBody key={index}>
                                          <TableRow key={1000}>
                                            <TableCell colSpan={2} style={{ color: "#637381", background: "#e5e5ea" }}>
                                              <Typography variant="h6">
                                                <CheckCircleOutline />
                                                {val.observacionEncontrada}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow key={index} style={{ alignItems: "start" }}>
                                            <TableCell>
                                              <CardMedia
                                                component="img"
                                                height="130"
                                                image={URL.createObjectURL(val.imagenObservacion[0].blobFile)}
                                                style={{
                                                  objectFit: "contain",
                                                }} // Esto asegura que la imagen se ajuste al tamaño especificado
                                                alt={val.imagenObservacion[0].name}
                                              />
                                            </TableCell>
                                            <TableCell>
                                              <Typography component="span" variant="subtitle1">
                                                Acción inmediata:{" "}
                                                <Typography component="span" variant="body2">
                                                  {val.accionInmediata}
                                                </Typography>
                                              </Typography>
                                              <br />
                                              <Typography component="span" variant="subtitle1">
                                                Responsable de Control:{" "}
                                                <Typography component="span" variant="body2">
                                                  {account.displayName}
                                                </Typography>
                                              </Typography>
                                              <br />
                                              <Typography component="span" variant="subtitle1">
                                                Responsable Ejecución:{" "}
                                                <Typography component="span" variant="body2">
                                                  {listaUsuarios.find((obj) => obj.value == val.responsableEjecucion)?.label}
                                                </Typography>
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                        </TableBody>
                                      );
                                    })}
                                  </Table>
                                </TableContainer>
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                        {showForm == 3 && (
                          <Box sx={{ textAlign: "center", padding: 2 }}>
                            <TaskAlt sx={{ fontSize: 70, color: "#00A76F" }} />
                            <Typography variant="h3" color="#00A76F">
                              Check List Registrado exitosamente
                            </Typography>
                            <br />
                            <Task sx={{ fontSize: 200, color: "#566573" }} />
                            <br />

                            <br />
                            <br />
                            <Button onClick={newRegister} variant="contained" color="success">
                              <NoteAdd /> Nuevo
                            </Button>
                          </Box>
                        )}
                        <br />
                        <br />
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          {showForm < 3 && (
                            <div>
                              <ButtonGroup>
                                <Button color="primary" onClick={onPrevious} disabled={step === 0} startIcon={<FirstPage />}>
                                  Regresar
                                </Button>
                                <Button type="submit" color="primary" disabled={step === 2} endIcon={<LastPage />}>
                                  Siguiente
                                </Button>
                              </ButtonGroup>
                            </div>
                          )}
                          <div>
                            {showForm == 2 && (
                              <Button color="success" variant="contained" type="submit" startIcon={<Checklist />}>
                                Finalizar
                              </Button>
                            )}
                          </div>
                        </Box>
                      </Panel>
                    </div>
                  </Box>
                </div>
              </Stack>
            </BaseCard>
          </Grid>
        </Grid>
      </Container>
    </PageContainer>
  );
}
