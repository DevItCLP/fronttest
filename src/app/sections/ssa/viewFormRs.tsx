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
  FormatListNumbered,
  LastPage,
  NoteAdd,
  Task,
  TaskAlt,
} from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PageContainer from "../../components/container/PageContainer";
import { InputRadiotCC, InputTextAreaCC, InputTextCC } from "../../components/input";
import { DateCC } from "../../components/date-hour";

import { SelectCC, SelectSimple } from "../../components/select-option";
import { GetAreas, GetLugarObs, GetPreguntas, GetProgramas, GetProyectos, GetTurnos } from "@/app/api/dataApiComponents";
import { SweetNotifyError, SweetNotifySuccesss } from "@/app/components/sweet-notificacion";
import { Account } from "@/app/_mock/account";
import PreviewReport from "./reports/viewPreview";
import { MinutePicker } from "@/app/components/MinutePicker";
import { saveAsclFull, uploadImagesS3 } from "@/app/controllers/ssa/ControllerAscl";
//================================================================================================================================

export default function FormRS() {
  //=====================LISTAS STATE==============================================================================================
  const [listaAreas, setlistaAreas] = useState<any[]>([]);
  const [listaProgramas, setlistaProgramas] = useState<any[]>([]);
  const [listaProyectos, setlistaProyectos] = useState<any[]>([]);
  const [listaTurnos, setlistaTurnos] = useState<any[]>([]);
  const [listaLugarObs, setlistaLugarObs] = useState<any[]>([]);
  const [preguntas, setlistaPreguntas] = useState<any[]>([]);
  //----------------------------------------------------------------
  const [datospreview, setDatosPreview] = useState<any[]>([]);
  const [imagespreview, setImagesPreview] = useState<any[]>([]);
  const [alldatosform, setAlldatosForm] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(0);
  const [step, setStep] = useState(0);
  const [namePanel, setnamePanel] = useState(" : Información General");
  //-------------------------------------
  const [showReport, setShowReport] = useState(false);
  const [idPrograma, setIdPrograma] = useState<number>(0);

  //================================CONSTANTES GLOBALES===================================================================================
  const folderModule: string = "reu-seguimiento";
  const ruta: string = `${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/` + `${process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3}/` + folderModule;
  const account = Account();
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

  //==========================================FUNCIONES===================================================================================
  useEffect(() => {
    loadDataApi();
  }, []);

  async function loadDataApi() {
    const areas = await GetAreas();
    const programas = await GetProgramas();
    const lugares = await GetLugarObs();
    const turnos = await GetTurnos();
    const proyectos = await GetProyectos();
    const preg = await GetPreguntas(1);
    setlistaAreas(areas);
    setlistaProgramas(programas);
    setlistaProyectos(proyectos);
    setlistaTurnos(turnos);
    setlistaLugarObs(lugares);
    setlistaPreguntas(preg);
  }

  const saveASCL = handleSubmit((data) => {
    if (showForm === 0) {
      onNext();
    } else if (showForm === 1) {
      console.log(data);
      getDatosPreview(data);
      onNext();
    } else if (showForm === 2) {
      console.log(data);
      save(data);
    }
  });

  async function save(data: any) {
    const datosDetalle = preguntas.map((val: any) => ({
      idActLiderazgoAdicional: { idActLiderazAdic: val.id },
      //idAcslGeneral: { idAscl: 00000 },Este dato lo agarramos en el backend una vez registrado la entidad AcslGeneral
      checkOption: data[`preg_${val.id}`],
      comentarios: data[`coment_${val.id}`],
      statusAcslDet: 2,
    }));

    const datosMediaDet = data.imagenes.map((val: any) => ({
      s3Url: `/${ruta}/`,
      nameImg: val.blobFile.name,
      //idAllMedia: { idMedia: idMedia },Este dato lo agarramos en el backend una vez registrado la entidad AllMedia
    }));

    const datosMedia = {
      //idAcslGeneral: { idAscl: 00000 },Este dato lo agarramos en el backend una vez registrado la entidad AcslGeneral
      descripcionMedia: "N/A",
      accionMedia: "N/A",
      nesesidadMedia: "N/A",
      compromisoMedia: "N/A",
      statusMedia: "1",
      datosMediaDet: datosMediaDet,
    };

    const datos: _saveAsclType = {
      programa: { idPrograma: data.programa },
      fecha: data.fecha,
      duracion: data.duracion,
      proyecto: { idProyecto: data.proyecto },
      area: { idArea: data.area },
      lugarObservacion: { idLugarObser: data.lugarobs },
      turno: { idTurno: data.turno },
      areaEspecifica: data.areaespecifica,
      nroParticipantes: data.participantes,
      tema: "null",
      desarrolloInteraccion: "null",
      statusAscl: 2,
      acslGeneralAct: { idListActLiderazgo: 1 },
      usuarios: { idUser: account.idUser },
      datosAsclDetalle: datosDetalle,
      datosAllMedia: datosMedia,
    };

    try {
      const response: reponseSaveAscl | undefined = await saveAsclFull(datos);

      if (response) {
        SweetNotifySuccesss({ message: "Documento registrado exitosamente" });
        onNext();
        const idRs = response.object.idAscl;
        setIdPrograma(idRs);
        await uploadImagesS3(data.imagenes, idRs, ruta);
      } else {
        SweetNotifyError({
          message: "A ocurrido un error al cargar registrar el documento",
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
        key: "Hora del la Reunion",
        value: data.duracion,
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
        key: "Número de Participantes",
        value: data.participantes,
      },
      {
        key: "Actividad de Lideraszgo",
        value: "Dialogo Periódico de Seguridad",
      },
      ,
    ];
    setAlldatosForm(data);
    setImagesPreview(data.imagenes);
    setDatosPreview(preview);
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
    window.location.href = `${process.env.NEXT_PUBLIC_HOST_URL}/pages/ssa/formrs`;
  };

  let intervalHour: number = 180; //todo: 3 horas
  let intervalTime: number = 15; //todo: 15 minutos
  const minutePicker = MinutePicker(intervalHour, intervalTime);

  return (
    <PageContainer title="SSA - DPS" description="Dialogo Periódico de Seguridad">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Dialogo Periódico de Seguridad </Typography>
        </Stack>
        <Divider sx={{ borderStyle: "revert", m: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <BaseCard title="">
              <Stack spacing={3}>
                <Box
                  component="form"
                  onSubmit={saveASCL}
                  sx={{
                    alignItems: "center",
                    //   maxWidth: 900,
                    mx: "auto",
                    mt: "auto",
                  }}
                >
                  <Steps current={step} small>
                    <Steps.Item title={step === 0 ? "Paso 1" : step === 1 || step === 2 ? "Paso 1" : "Info. General"} />
                    <Steps.Item title={step === 1 ? "Paso 2" : step === 2 ? "Paso 2" : "Info. Adicional"} />
                    <Steps.Item title={step === 2 ? "Paso 3" : step === 3 ? "Paso 3" : "Finalizar"} />
                  </Steps>
                  <hr />

                  <Panel header={<Typography style={{ fontWeight: "bold", color: "#546E7A" }}>Paso {step + 1 + namePanel}</Typography>}>
                    {showForm == 0 && (
                      <Box component="section">
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6} md={4}>
                            <DateCC _control={control} _setValue={setValue} label="Fecha" name="fecha" required={true} errors={errors} />
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
                              label="Tiempo en minutos"
                              name="duracion"
                              size="small"
                              required={true}
                              errors={errors}
                              listaData={minutePicker}
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
                          <Grid item xs={12} sm={6} md={4}>
                            <InputTextCC
                              register={register}
                              label=" # Participantes"
                              icon={<FormatListNumbered />}
                              type="number"
                              name="participantes"
                              size="small"
                              required={true}
                              errors={errors}
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

                          <Grid item xs={12} md={12}>
                            <UploaderCC
                              _control={control}
                              label=" Adjuntar fotografias"
                              name="imagenes"
                              required={true}
                              multiple={true}
                              errors={errors}
                              shouldFocus={false}
                            />
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
                                  <TableRow>
                                    <TableCell colSpan={2}>
                                      <Grid container spacing={2} p={2}>
                                        {imagespreview.map((image, index) => (
                                          <Grid item key={index} xs={12} sm={6} md={4}>
                                            <CardMedia
                                              component="img"
                                              height="100"
                                              image={URL.createObjectURL(image.blobFile)}
                                              style={{
                                                objectFit: "contain",
                                              }} // Esto asegura que la imagen se ajuste al tamaño especificado
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
                          Registro exitosamente
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
                </Box>
              </Stack>
            </BaseCard>
          </Grid>
        </Grid>
      </Container>
    </PageContainer>
  );
}

//export async function getServerSideProps(){
/*export const getServerSideProps: GetServerSideProps<DataProps> = async (context) => {
  console.log('getServerSideProps')
  const dataAreas = await GetAreasSSR();
return {
  props: {
    dataAreas
  },
};


}*/

//export default FormRS;
