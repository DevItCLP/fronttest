/*
 * Created on Wed Apr 24 2024
 *
 * Copyright (c) 2024 CC
 * Author:  Cristian R. Paz  */

import {
  FirstPage,
  LastPage,
  Checklist,
  PostAdd,
  FileCopy,
  FormatListNumbered,
  Check,
  CheckCircleOutline,
  Article,
  NoteAdd,
  Task,
  TaskAlt,
} from "@mui/icons-material";
import {
  Container,
  Stack,
  Typography,
  Divider,
  Box,
  Button,
  ButtonGroup,
  Grid,
  Paper,
  TableBody,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  CardMedia,
  Badge,
} from "@mui/material";
import { Steps, Panel } from "rsuite";
import BaseCard from "../../../../components/shared/BaseCard";
import { UploaderMinCC } from "../../../../components/uploader";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PageContainer from "../../../../components/container/PageContainer";
import { InputRadiotCC, InputTextAreaCC, InputTextCC } from "../../../../components/input";
import { DateCC } from "../../../../components/date-hour";
import { SelectCC, SelectSimple } from "../../../../components/select-option";
import { GetProgramas, GetTurnos, GetLugarObs, GetProyectos, GetAreas, GetPreguntas } from "@/app/api/dataApiComponents";
import { useResponsive } from "@/hooks/use-responsive";
import { Account } from "@/app/_mock/account";
import { SweetNotifyError, SweetNotifySuccess, SweetNotifySuccesss } from "@/app/components/sweet-notificacion";
import axios from "axios";
import PreviewReport from "../../reports/viewPreview";
import { saveAsclFull, uploadImagesS3 } from "@/app/controllers/ssa/ControllerAscl";
import { useSession } from "next-auth/react";

//---------------------------------------------------------

export default function FormSTL() {
  const account = Account();
  const { status } = useSession();

  const upLg = useResponsive("up", "lg");

  const [listaAreas, setlistaAreas] = useState<any[]>([]);
  const [listaProgramas, setlistaProgramas] = useState<any[]>([]);
  const [listaProyectos, setlistaProyectos] = useState<any[]>([]);
  const [listaTurnos, setlistaTurnos] = useState<any[]>([]);
  const [listaLugarObs, setlistaLugarObs] = useState<any[]>([]);
  const [preguntas, setlistaPreguntas] = useState<any[]>([]);
  //---------------------------------------------------------------------
  const [datospreview, setDatosPreview] = useState<any[]>([]);
  const [datospreview2, setDatosPreview2] = useState<any[]>([]);
  const [imagespreview, setImagesPreview] = useState<any[]>([]);
  const [alldatosform, setAlldatosForm] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(0);
  const [step, setStep] = useState(0);
  const [namePanel, setnamePanel] = useState(" : Información General");
  //-------------------------------------
  const [showReport, setShowReport] = useState(false);
  const [idPrograma, setIdPrograma] = useState(0);

  const folderModule: string = "stl";
  const ruta: string = `${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/` + `${process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3}/` + folderModule;
  const {
    register,
    control,
    setValue,
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
    if (status === "authenticated") {
      loadDataApi();
    }
  }, [status, account.token]);

  async function loadDataApi() {
    const areas = await GetAreas(account.token);
    const programas = await GetProgramas(account.token);
    const lugares = await GetLugarObs(account.token);
    const turnos = await GetTurnos(account.token);
    const proyectos = await GetProyectos(account.token);
    const preg = await GetPreguntas(4, account.token);
    setlistaAreas(areas);
    setlistaProyectos(proyectos);
    setlistaProgramas(programas);
    setlistaTurnos(turnos);
    setlistaLugarObs(lugares);
    setlistaPreguntas(preg);
  }

  const saveASCL = handleSubmit((data) => {
    if (showForm === 0) {
      onNext();
    } else if (showForm === 1) {
      //console.log(data);
      getDatosPreview(data);
      onNext();
    } else if (showForm === 2) {
      //console.log(data);
      save(data);
    }
  });

  async function save(data: any) {
    const datosMediaDet = data.imagenes.map((val: any) => ({
      s3Url: `/${ruta}/`,
      nameImg: val.blobFile.name,
      //idAllMedia: { idMedia: idMedia },Este dato lo agarramos en el backend una vez registrado la entidad AllMedia
    }));
    const datosMedia = {
      //idAsclGeneral: { idAscl: 000000 },Este dato lo agarramos en el backend una vez registrado el proceso
      descripcionMedia: "N/A",
      accionMedia: data.accion,
      nesesidadMedia: data.necesidad,
      compromisoMedia: data.compromiso,
      statusMedia: "1",
      datosMediaDet: datosMediaDet,
    };

    const datosDetalle = preguntas.map((val: any) => ({
      idActLiderazgoAdicional: { idActLiderazAdic: val.id },
      //idAsclGeneral: { idAscl: 000000 },Este dato lo agarramos en el backend una vez registrado el proceso
      checkOption: data[`preg_${val.id}`],
      comentarios: data[`coment_${val.id}`],
      statusAcslDet: 2,
    }));

    const datos: _saveAsclType = {
      programa: { idPrograma: data.programa },
      fecha: data.fecha,
      duracion: data.duracion,
      proyecto: { idProyecto: data.proyecto },
      area: { idArea: data.area },
      lugarObservacion: { idLugarObser: data.lugarobs },
      turno: { idTurno: data.turno },
      areaEspecifica: data.areaespecifica,
      tema: data.tema,
      desarrolloInteraccion: data.describeinteraccion,
      statusAscl: 2,
      acslGeneralAct: { idListActLiderazgo: 4 },
      usuarios: { idUser: account.idUser },
      datosAsclDetalle: datosDetalle,
      datosAllMedia: datosMedia,
    };
    try {
      const response: reponseSaveAscl | undefined = await saveAsclFull(datos, account.token);

      if (response) {
        SweetNotifySuccesss({ message: "Documento registrado exitosamente" });
        onNext();
        const idStl = response.object.idAscl;
        setIdPrograma(idStl);
        await uploadImagesS3(data.imagenes, idStl, ruta);
      } else {
        SweetNotifyError({
          message: "A ocurrido un error al registrar el documento",
        });
      }
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
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
        key: "Área específica",
        value: data.areaespecifica,
      },
      {
        key: "Tema",
        value: data.tema,
      },
      {
        key: "Desarrollo de la interacción",
        value: data.describeinteraccion,
      },
      {
        key: "Actividad de Lideraszgo",
        value: "Análisis de Riesgo de la Tarea",
      },
    ];
    let preview2 = [
      {
        key: "Necesidad",
        value: data.necesidad,
      },
      {
        key: "Accion",
        value: data.accion,
      },
      {
        key: "Compromiso ",
        value: data.compromiso,
      },
    ];
    setAlldatosForm(data);
    setImagesPreview(data.imagenes);
    setDatosPreview(preview);
    setDatosPreview2(preview2);
    //console.log("previer", preview);
    //console.log("imagespreview ", data.imagenes);
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
    window.location.href = `${process.env.NEXT_PUBLIC_HOST_URL}/pages/ssa/formstl `;
    //route.push("/pages/ssa/formopt");
  };

  return (
    <PageContainer title="SSA - ART" description="Análisis de Riesgo de la Tarea">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Análisis de Riesgo de la Tarea</Typography>
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

                      mx: "auto",
                      mt: 2,
                    }}
                  >
                    <div>
                      <Steps current={step} small>
                        <Steps.Item title={step === 0 ? "Información General" : step === 1 || step === 2 ? "Finalizado" : "Por completar"} />
                        <Steps.Item title={step === 1 ? "Información adicional" : step === 2 ? "Finalizado" : "Por completar"} />
                        <Steps.Item title={step === 2 ? "Revisión y finalizar" : step === 3 ? "Finalizado" : "Por completar"} />
                      </Steps>
                      <hr />

                      <Panel header={<Typography style={{ fontWeight: "bold", color: "#546E7A" }}>Sección {step + 1 + namePanel}</Typography>}>
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
                                  label=" Lugar de Observación"
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

                              <Grid item xs={12} sm={6} md={4}>
                                <InputTextCC
                                  register={register}
                                  label=" Área especifica"
                                  icon={<FileCopy />}
                                  type="text"
                                  name="areaespecifica"
                                  size="small"
                                  required={true}
                                  errors={errors}
                                />
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>
                                <InputTextCC
                                  register={register}
                                  label=" Tema"
                                  icon={<PostAdd />}
                                  type="text"
                                  name="tema"
                                  size="small"
                                  required={true}
                                  errors={errors}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <InputTextAreaCC
                                  register={register}
                                  label="Desarrollo de la interacción"
                                  icon={<FormatListNumbered />}
                                  name="describeinteraccion"
                                  size="small"
                                  required={true}
                                  errors={errors}
                                  rows={3}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                        {showForm == 1 && (
                          <Box component="section">
                            <Grid container spacing={3}>
                              {preguntas.map((data, index) => {
                                return (
                                  <Grid item xs={12} md={12} key={index}>
                                    <Grid item xs={12} md={12}>
                                      <InputRadiotCC
                                        register={register}
                                        label={data.label}
                                        icon={<FileCopy />}
                                        name={"preg_" + data.id}
                                        required={true}
                                        errors={errors}
                                      />
                                      <InputTextAreaCC
                                        register={register}
                                        label="Comentarios"
                                        icon={<FileCopy />}
                                        name={"coment_" + data.id}
                                        required={false}
                                        errors={errors}
                                        rows={1}
                                      />
                                    </Grid>
                                  </Grid>
                                );
                              })}
                              <Divider sx={{ borderStyle: "revert", m: 2 }} />
                              {upLg ? (
                                <TableContainer component={Paper} style={{ border: "1px solid #EBEDEF", padding: "5px" }}>
                                  <Table aria-label="a dense table">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>
                                          <Typography variant="h4">Necesidad identificada</Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography variant="h4">Acción</Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography variant="h4">Compromiso</Typography>
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>

                                    <TableBody>
                                      <TableRow>
                                        <TableCell>
                                          <InputTextAreaCC
                                            register={register}
                                            label="Necesidad"
                                            icon={<FileCopy />}
                                            name="necesidad"
                                            required={true}
                                            errors={errors}
                                            rows={3}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <InputTextAreaCC
                                            register={register}
                                            label="Acción"
                                            icon={<FileCopy />}
                                            name="accion"
                                            required={true}
                                            errors={errors}
                                            rows={3}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <InputTextAreaCC
                                            register={register}
                                            label="Compromiso"
                                            icon={<FileCopy />}
                                            name="compromiso"
                                            required={true}
                                            errors={errors}
                                            rows={3}
                                          />
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell colSpan={2}>
                                          Adjuntar Fotografías
                                          <Grid item xs={12} md={12}>
                                            <UploaderMinCC
                                              _control={control}
                                              label=" Adjuntar fotografias"
                                              name="imagenes"
                                              required={true}
                                              multiple={true}
                                              errors={errors}
                                              shouldFocus={false}
                                            />
                                          </Grid>
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              ) : (
                                <TableContainer component={Paper} style={{ border: "1px solid #EBEDEF", padding: "5px" }}>
                                  <Table aria-label="a dense table">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell colSpan={3}>
                                          <Typography variant="h4">Necesidad - Acción - Compromiso</Typography>
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>

                                    <TableBody>
                                      <TableRow>
                                        <TableCell>
                                          <InputTextAreaCC
                                            register={register}
                                            label="Necesidad"
                                            icon={<FileCopy />}
                                            name="necesidad"
                                            required={true}
                                            errors={errors}
                                            rows={3}
                                          />
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell>
                                          <InputTextAreaCC
                                            register={register}
                                            label="Acción"
                                            icon={<FileCopy />}
                                            name="accion"
                                            required={true}
                                            errors={errors}
                                            rows={3}
                                          />
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell>
                                          <InputTextAreaCC
                                            register={register}
                                            label="Compromiso"
                                            icon={<FileCopy />}
                                            name="compromiso"
                                            required={true}
                                            errors={errors}
                                            rows={3}
                                          />
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell colSpan={3}>
                                          Adjuntar Fotografías
                                          <Grid item xs={12} md={12}>
                                            <UploaderMinCC
                                              _control={control}
                                              label=" Adjuntar fotografias"
                                              name="imagenes"
                                              required={true}
                                              multiple={true}
                                              errors={errors}
                                              shouldFocus={false}
                                            />
                                          </Grid>
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              )}
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
                                            Acciones
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left"></TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {preguntas.map((val, index) => {
                                        return (
                                          <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                              <Typography>
                                                <Check />
                                                {val.label}:
                                              </Typography>
                                            </TableCell>
                                            <TableCell>
                                              {alldatosform[`preg_${val.id}` as any] == "SI" ? (
                                                <Badge badgeContent={alldatosform[`preg_${val.id}` as any]} color={"primary"}></Badge>
                                              ) : (
                                                ""
                                              )}
                                              {alldatosform[`preg_${val.id}` as any] == "NO" ? (
                                                <Badge badgeContent={alldatosform[`preg_${val.id}` as any]} color={"error"}></Badge>
                                              ) : (
                                                ""
                                              )}
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                      {datospreview2.map((val, index) => {
                                        return (
                                          <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                              {val.key}:
                                            </TableCell>
                                            <TableCell>{val.value}</TableCell>
                                          </TableRow>
                                        );
                                      })}
                                      <TableRow>
                                        <TableCell colSpan={2}>
                                          <Grid container spacing={2} p={2}>
                                            {imagespreview.map((image, index) => (
                                              <Grid item key={index} xs={12} sm={6} md={4}>
                                                <CardMedia
                                                  component="img"
                                                  height="100"
                                                  image={URL.createObjectURL(image.blobFile)}
                                                  style={{ objectFit: "contain" }} // Esto asegura que la imagen se ajuste al tamaño especificado
                                                  alt={image.name}
                                                />
                                              </Grid>
                                            ))}
                                          </Grid>
                                        </TableCell>
                                      </TableRow>
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
