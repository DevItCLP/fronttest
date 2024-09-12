/*
 * Created on Wed Apr 24 2024
 *
 * Copyright (c) 2024 CC
 * Author:  Cristian R. Paz  */

import {
  Article,
  Check,
  CheckCircleOutline,
  Checklist,
  FileCopy,
  FirstPage,
  LastPage,
  NoteAdd,
  Task,
  TaskAlt,
  Delete,
  AddCircleOutline,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardMedia,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Panel, Steps } from "rsuite";
import BaseCard from "../../components/shared/BaseCard";
import { UploaderCC } from "../../components/uploader";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PageContainer from "../../components/container/PageContainer";
import { _InputRadiotCC, InputTextAreaCC } from "../../components/input";
import { DateCC } from "../../components/date-hour";
import { SelectCC, SelectSimple } from "../../components/select-option";
import { GetAreas, GetLugarObs, GetPreguntas, GetProgramas, GetProyectos, GetTurnos, GetUsuarios } from "@/app/api/dataApiComponents";
import { useResponsive } from "@/hooks/use-responsive";
import { SweetNotifyError, SweetNotifySuccesss } from "@/app/components/sweet-notificacion";
import { Account } from "@/app/_mock/account";

import PreviewReport from "./reports/viewPreview";
import { saveAsclFull, uploadGenericImagesS3 } from "@/app/controllers/ssa/ControllerAscl";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { sendEmailSES } from "@/app/controllers/common/ControllerCommon";
//---------------------------------------------------------
interface ComponentState {
  id: number;
}

//------------------------------------------------------------
export default function FormIP() {
  const account = Account();
  const authCredentials = {
    username: process.env.NEXT_PUBLIC_USER || "",
    password: process.env.NEXT_PUBLIC_PASS || "",
  };
  const upLg = useResponsive("up", "lg");
  const folderModule: string = "inspecciones-planificadas";
  const ruta: string = `${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/${process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3}/${folderModule}`;

  const [listaAreas, setlistaAreas] = useState<any[]>([]);
  const [listaProgramas, setlistaProgramas] = useState<any[]>([]);
  const [listaProyectos, setlistaProyectos] = useState<any[]>([]);
  const [listaTurnos, setlistaTurnos] = useState<any[]>([]);
  const [listaLugarObs, setlistaLugarObs] = useState<any[]>([]);
  const [listaUsuarios, setListaUsuarios] = useState<any[]>([]);
  const [preguntas, setlistaPreguntas] = useState<any[]>([]);
  //-----------------------------------------------------------------------
  const [datospreview, setDatosPreview] = useState<any[]>([]);
  const [imagespreview, setImagesPreview] = useState<any[]>([]);
  const [alldatosform, setAlldatosForm] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(0);
  const [step, setStep] = useState(0);
  const [namePanel, setnamePanel] = useState(" : Información General");
  //-------------------------------------
  const [showReport, setShowReport] = useState(false);
  const [idPrograma, setIdPrograma] = useState(0);
  //---------------------------------------------------
  const [boxComponents, setBoxComponent] = useState<ComponentState[]>([{ id: 0 }]);
  const [nextId, setNexId] = useState<number>(1);

  const {
    register,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onChange = (nextStep: any) => {
    setStep(nextStep < 0 ? 0 : nextStep > 2 ? 2 : nextStep);
    setShowForm(nextStep);
    setnamePanel(nextStep === 0 ? " : Información General" : nextStep === 1 ? " : Información adicional" : " : Revisión y finalización");
  };

  const onNext = () => onChange(step + 1);
  const onPrevious = () => onChange(step - 1);

  useEffect(() => {
    loadDataApi();
  }, []);

  async function loadDataApi() {
    const areas = await GetAreas();
    const programas = await GetProgramas();
    const lugares = await GetLugarObs();
    const turnos = await GetTurnos();
    const proyectos = await GetProyectos();
    const preg = await GetPreguntas(2);
    const users = await GetUsuarios();
    setlistaAreas(areas);
    setlistaProgramas(programas);

    setlistaProyectos(proyectos);
    setlistaTurnos(turnos);
    setlistaLugarObs(lugares);
    setlistaPreguntas(preg);
    setListaUsuarios(users);
  }

  const saveASCL = handleSubmit((data) => {
    if (showForm === 0) {
      onNext();
    } else if (showForm === 1) {
      //console.log(data);
      getDatosPreview(data);
      onNext();
    } else if (showForm === 2) {
      save(data);
    }
  });

  async function save(data: any) {
    const datosDetalle = boxComponents.map((val: any) => ({
      idActLiderazgoAdicional: { idActLiderazAdic: null },
      //idAsclGeneral: { idAscl: 000000 },Este dato lo agarramos en el backend una vez registrado el proceso
      checkOption: data[`preg_${val.id}`],
      comentarios: data[`det_${val.id}`],
      descripcionObservacion: data[`desc_${val.id}`],
      accionObservacion: data[`acc_${val.id}`],
      idUsuarioResponsableEjecucion: { idUser: data[`user_${val.id}`] },
      imageObservacion: val.id + "_" + data[`imagen_${val.id}`][0].blobFile.name,
      statusAcslDet: 0,
      accionRealizadaCierre: "",
    }));
    //console.log(datosDetalle);

    const datos: _saveAsclType = {
      programa: { idPrograma: data.programa },
      fecha: data.fecha,
      proyecto: { idProyecto: data.proyecto },
      area: { idArea: data.area },
      lugarObservacion: { idLugarObser: data.lugarobs },
      turno: { idTurno: data.turno },
      statusAscl: 2,
      acslGeneralAct: { idListActLiderazgo: 2 },
      usuarios: { idUser: account.idUser },
      datosAsclDetalle: datosDetalle,
      datosAllMedia: null, //Las inspecciones planificadas no trabajaran con esta sección
    };
    //console.log(datos);

    const empleado = boxComponents.map((val: any) => ({
      idEmpleado: parseInt(data[`user_${val.id}`]),
    }));

    const resultSendEmpleado: ResultadoEmail[] = [];
    listaUsuarios.map((row) => {
      empleado.map((val) => {
        if (row.idEmpleado == val.idEmpleado) {
          resultSendEmpleado.push({ name: row.label, email: row.email });
        }
      });
    });
    resultSendEmpleado.push({ name: account.displayName, email: account.email });

    try {
      const response: reponseSaveAscl | undefined = await saveAsclFull(datos);

      if (response) {
        SweetNotifySuccesss({ message: "Documento registrado exitosamente" });
        onNext();
        const idIp = response.object.idAscl;
        setIdPrograma(idIp);
        uploadImages(idIp, data);
        sendEmail(resultSendEmpleado, idIp);
      } else {
        SweetNotifyError({
          message: "A ocurrido un error al cargar registrar el documento",
        });
      }
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
  }

  async function uploadImages(idIp: number, data: any) {
    const imagenes = boxComponents.map((val: any) => ({
      id: idIp + "_" + val.id,
      imageBlobFile: data[`imagen_${val.id}`][0].blobFile,
    }));
    await uploadGenericImagesS3(imagenes, ruta);
  }

  async function sendEmail(listArrayEmpleado: any[], idRegistro: number) {
    let subject: string = "ZAMI Notificaciónes";
    let proceso: string = "OPACI";
    await sendEmailSES(listArrayEmpleado, account.displayName, subject, proceso, idRegistro);
  }

  function getDatosPreview(data: any) {
    let preview = [
      {
        key: "Programa",
        value: listaProgramas.find((obj) => obj.value === data.programa)?.label,
      },
      {
        key: "Fecha de la Reunion",
        value: data.fecha,
      },
      {
        key: "Proyecto",
        value: listaProyectos.find((obj) => obj.value === data.proyecto)?.label,
      },
      {
        key: "Área Responsable",
        value: listaAreas.find((obj) => obj.value === data.area)?.label,
      },
      {
        key: "Lugar de la observación",
        value: listaLugarObs.find((obj) => obj.value === data.lugarobs)?.label,
      },
      {
        key: "Turno",
        value: listaTurnos.find((obj) => obj.value === data.turno)?.label,
      },

      {
        key: "Actividad de Liderazgo",
        value: "Observación Planeada de Actos y Condiciones Inseguras",
      },
      ,
    ];

    //console.log(data);
    setAlldatosForm(data);
    const imagenes = boxComponents.flatMap((val: any) => data[`imagen_${val.id}`] || []);
    setImagesPreview(imagenes);
    setDatosPreview(preview);
    //console.log("previer", preview);
    //console.log("imagespreview ", imagenes);
  }

  const showReporte = () => {
    new Promise(() => {
      setTimeout(() => {
        setShowReport(true);
      }, 1);
    });

    setShowReport(false);
  };

  const newRegister = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_HOST_URL}/pages/ssa/formip `;
    //route.push("/pages/ssa/formopt");
  };

  const addComponent = () => {
    setBoxComponent([...boxComponents, { id: nextId }]);
    setNexId(nextId + 1);
  };
  const removeComponent = (id: number) => {
    const newBoxComponentes = boxComponents.filter((val) => val.id != id);
    setBoxComponent(newBoxComponentes);

    //Este codigo me elimina el dato del estado del formulario del hock useForm() tomando en cuenta el componente eliminado.
    const updatedValues = Object.keys(getValues()).reduce((acc, key) => {
      if (
        !key.startsWith(`preg_${id}`) &&
        !key.startsWith(`det_${id}`) &&
        !key.startsWith(`user_${id}`) &&
        !key.startsWith(`desc_${id}`) &&
        !key.startsWith(`acc_${id}`) &&
        !key.startsWith(`imagen_${id}`)
      ) {
        acc[key] = getValues()[key];
      }
      return acc;
    }, {} as any);
    reset(updatedValues);
  };

  return (
    <PageContainer title="SSA - OPACI" description="Observación Planeada de Actos y Condiciones Inseguras">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Observación Planeada de Actos y Condiciones Inseguras</Typography>
        </Stack>
        <Divider sx={{ borderStyle: "revert", m: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <BaseCard title="">
              <Stack spacing={3}>
                <div>
                  <Box
                    component="form"
                    onSubmit={saveASCL}
                    sx={{
                      alignItems: "center",
                      //  maxWidth: 900,
                      mx: "auto",
                      mt: 2,
                    }}
                  >
                    <div>
                      <Steps current={step} small>
                        <Steps.Item title={step === 0 ? "Información General" : step === 1 || step === 2 ? "Finalizado" : "Por Completar"} />
                        <Steps.Item title={step === 1 ? "Información adicional" : step === 2 ? "Finalizado" : "Por Completar"} />
                        <Steps.Item title={step === 2 ? "Revisión y finalizar" : step === 3 ? "Finalizado" : "Por Completar"} />
                      </Steps>
                      <hr />

                      <Panel header={<Typography style={{ fontWeight: "bold", color: "#546E7A" }}></Typography>}>
                        {showForm == 0 && (
                          <Box component="section">
                            <Grid container spacing={3}>
                              <Grid item xs={12} sm={6} md={4}>
                                <DateCC _control={control} _setValue={setValue} label="Fechas" name="fecha" required={true} errors={errors} />
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>
                                <SelectSimple
                                  _control={control}
                                  _setValue={setValue}
                                  label=" Programa"
                                  name="programa"
                                  size="small"
                                  required={true}
                                  errors={errors}
                                  listaData={listaProgramas}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>
                                <SelectSimple
                                  _control={control}
                                  _setValue={setValue}
                                  label=" Proyecto"
                                  name="proyecto"
                                  size="small"
                                  required={true}
                                  errors={errors}
                                  listaData={listaProyectos}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>
                                <SelectSimple
                                  _control={control}
                                  _setValue={setValue}
                                  label=" Areas"
                                  name="area"
                                  size="small"
                                  required={true}
                                  errors={errors}
                                  listaData={listaAreas}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>
                                <SelectSimple
                                  _control={control}
                                  _setValue={setValue}
                                  label=" Lugar de Observacion"
                                  name="lugarobs"
                                  size="small"
                                  required={true}
                                  errors={errors}
                                  listaData={listaLugarObs}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>
                                <SelectSimple
                                  _control={control}
                                  _setValue={setValue}
                                  label=" Turno"
                                  name="turno"
                                  size="small"
                                  required={true}
                                  errors={errors}
                                  listaData={listaTurnos}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                        {showForm == 1 && (
                          <Box component="section">
                            <Grid container spacing={3}>
                              {boxComponents.map((box) => {
                                return (
                                  <React.Fragment key={box.id}>
                                    <Grid
                                      container
                                      spacing={2}
                                      style={{
                                        borderBottom: "1px solid #ccc",
                                        padding: "16px",
                                        marginBottom: "16px",
                                      }}
                                    >
                                      <Grid item xs={12} md={12}>
                                        <_InputRadiotCC
                                          register={register}
                                          label={` radio en sección ${box.id}`}
                                          name={`preg_${box.id}`}
                                          required={true}
                                          errors={errors}
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={12}>
                                        <InputTextAreaCC
                                          register={register}
                                          label="Detalle"
                                          icon={<FileCopy />}
                                          name={`det_${box.id}`}
                                          required={false}
                                          errors={errors}
                                          rows={1}
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={6}>
                                        <InputTextAreaCC
                                          register={register}
                                          label="Descripción"
                                          icon={<FileCopy />}
                                          name={`desc_${box.id}`}
                                          required={true}
                                          errors={errors}
                                          rows={3}
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={6}>
                                        <InputTextAreaCC
                                          register={register}
                                          label="Acción"
                                          icon={<FileCopy />}
                                          name={`acc_${box.id}`}
                                          required={true}
                                          errors={errors}
                                          rows={3}
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={6}>
                                        <SelectCC
                                          _control={control}
                                          _setValue={setValue}
                                          label=" Usuario responsable"
                                          name={`user_${box.id}`}
                                          size="large"
                                          required={true}
                                          errors={errors}
                                          listaData={listaUsuarios}
                                        />
                                      </Grid>
                                      <Grid item xs={12} md={6}>
                                        <UploaderCC
                                          _control={control}
                                          label=" Adjuntar fotografias"
                                          name={`imagen_${box.id}`}
                                          required={true}
                                          multiple={true}
                                          errors={errors}
                                          shouldFocus={false}
                                        />
                                      </Grid>
                                      {box.id > 0 && (
                                        <Grid item xs={12}>
                                          <Box display="flex" justifyContent="flex-end">
                                            <Button
                                              variant="contained"
                                              color="error"
                                              onClick={() => {
                                                removeComponent(box.id);
                                              }}
                                            >
                                              <RemoveCircleOutlineIcon />
                                            </Button>
                                          </Box>
                                        </Grid>
                                      )}
                                    </Grid>
                                  </React.Fragment>
                                );
                              })}
                              <Grid item xs={12}>
                                <Box display="flex" justifyContent="flex-start">
                                  <Button variant="outlined" color="primary" onClick={addComponent}>
                                    <AddCircleOutline />
                                  </Button>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                        {showForm == 2 && (
                          <Box component="section">
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={12}>
                                <TableContainer component={Paper}>
                                  <Table size="small" aria-label="a dense table">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell width="350px">
                                          <Typography variant="h6">
                                            <CheckCircleOutline />
                                            Datos Generales
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left"></TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {datospreview.map((val, index) => {
                                        return (
                                          <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                              {val.key}:
                                            </TableCell>
                                            <TableCell>{val.value}</TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                  <br />
                                  <Table aria-label="a dense table" size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell width="700px">
                                          <Typography variant="h6">
                                            <CheckCircleOutline />
                                            Observaciones
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {boxComponents.map((val, index) => {
                                        return (
                                          <TableRow key={index}>
                                            <TableCell>
                                              <Box sx={{ border: 3, borderColor: "gray" }} padding={2} borderRadius={1}>
                                                <Grid item xs={12} md={6}>
                                                  <Typography component={"span"} variant="subtitle1">
                                                    <Check />
                                                    Acto / Condición:
                                                    <Typography component={"span"} variant="subtitle2">
                                                      {alldatosform[`preg_${val.id}` as any]}
                                                    </Typography>
                                                  </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                  <Typography component={"span"} variant="subtitle1">
                                                    <Check />
                                                    Observación:
                                                    <Typography component={"span"} variant="subtitle2">
                                                      {alldatosform[`det_${val.id}` as any]}
                                                    </Typography>
                                                  </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                  <Typography component={"span"} variant="subtitle1">
                                                    <Check />
                                                    Responsable:
                                                    <Typography component={"span"} variant="subtitle2">
                                                      {listaUsuarios.find((obj) => obj.value == alldatosform[`user_${val.id}` as any])?.label}
                                                    </Typography>
                                                    <Typography component={"span"} variant="subtitle2">
                                                      {listaUsuarios.find((obj) => obj.value == alldatosform[`user_${val.id}` as any])?.email}
                                                    </Typography>
                                                  </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                  <Typography component={"span"} variant="subtitle1">
                                                    <Check />
                                                    Descripción de la observación:
                                                    <Typography component={"span"} variant="subtitle2">
                                                      {alldatosform[`desc_${val.id}` as any]}
                                                    </Typography>
                                                  </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                  <Typography component={"span"} variant="subtitle1">
                                                    <Check />
                                                    Acción de la observación:
                                                    <Typography component={"span"} variant="subtitle2">
                                                      {alldatosform[`acc_${val.id}` as any]}
                                                    </Typography>
                                                  </Typography>
                                                </Grid>
                                                <Grid item key={index} xs={12} sm={6} md={4}>
                                                  <CardMedia
                                                    component="img"
                                                    height="100"
                                                    image={URL.createObjectURL(imagespreview[index].blobFile)}
                                                    style={{
                                                      objectFit: "contain",
                                                    }}
                                                    alt={`imagen_${val.id}`}
                                                  />
                                                </Grid>
                                              </Box>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
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
                              Programa Registrado exitosamente
                            </Typography>
                            <br />
                            <Task sx={{ fontSize: 200, color: "#566573" }} />
                            <br />
                            <Button onClick={showReporte} variant="contained" color="primary">
                              <Article /> Ver Reporte
                            </Button>
                            {showReport && <PreviewReport idPrograma={idPrograma} />}
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
