/*
 * Created on Wed Apr 24 2024
 *
 * Copyright (c) 2024 CC
 * Author:  Cristian R. Paz  */

import { FirstPage, LastPage, Checklist, Article, FileCopy, Task, CheckCircleOutline, TaskAlt, NoteAdd } from "@mui/icons-material";
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
} from "@mui/material";
import { Steps, Panel } from "rsuite";
import BaseCard from "../../components/shared/BaseCard";
import { UploaderCC, UploaderMinCC } from "../../components/uploader";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PageContainer from "../../components/container/PageContainer";
import { InputTextAreaCC } from "../../components/input";
import { DateCC } from "../../components/date-hour";
import { SelectCC, SelectSimple, SelectStatusCC } from "../../components/select-option";
import { GetProgramas, GetTurnos, GetLugarObs, GetProyectos, GetAreas } from "@/app/api/dataApiComponents";
import { useResponsive } from "@/hooks/use-responsive";
import { Account } from "@/app/_mock/account";
import { SweetNotifyError, SweetNotifySuccesss } from "@/app/components/sweet-notificacion";
import PreviewReport from "./reports/viewPreview";
import { useRouter } from "next/navigation";
import { saveAsclFull, uploadImagesS3 } from "@/app/controllers/ssa/ControllerAscl";

//-=========================================================================================================================================

export default function FormOPT() {
  //==================================================LISTAS STATE===================================================================
  const [listaAreas, setlistaAreas] = useState<any[]>([]);
  const [listaProgramas, setlistaProgramas] = useState<any[]>([]);

  const [listaProyectos, setlistaProyectos] = useState<any[]>([]);
  const [listaTurnos, setlistaTurnos] = useState<any[]>([]);
  const [listaLugarObs, setlistaLugarObs] = useState<any[]>([]);
  //--------------------------------------------------------------------
  const [datospreview, setDatosPreview] = useState<any[]>([]);
  const [datospreview2, setDatosPreview2] = useState<any[]>([]);
  const [imagespreview, setImagesPreview] = useState<any[]>([]);
  const [alldatosform, setAlldatosForm] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(0);
  const [step, setStep] = useState(0);
  const [namePanel, setnamePanel] = useState(" : Información General");

  //-------------------------------------------------------------------
  const [showReport, setShowReport] = useState(false);
  const [idPrograma, setIdPrograma] = useState(0);

  //=============================================CONSTANTES GLOBALES==============================================================
  const account = Account();

  const authCredentials = {
    username: process.env.NEXT_PUBLIC_USER || "",
    password: process.env.NEXT_PUBLIC_PASS || "",
  };
  const route = useRouter();
  const upLg = useResponsive("up", "lg");
  const folderModule: string = "opt";
  const ruta: string = `${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/` + `${process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3}/` + folderModule;

  const {
    register,
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();

  //==========================================================FUNCIONES====================================================================

  const onChange = (nextStep: any) => {
    setStep(nextStep < 0 ? 0 : nextStep > 1 ? 1 : nextStep);
    setShowForm(nextStep);
    setnamePanel(nextStep === 0 ? " : Información General" : " : Revisión y finalización");
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
    setlistaAreas(areas);
    setlistaProgramas(programas);
    setlistaProyectos(proyectos);
    setlistaTurnos(turnos);
    setlistaLugarObs(lugares);
  }

  const saveASCL = handleSubmit((data) => {
    if (showForm === 0) {
      getDatosPreview(data);
      onNext();
    } else if (showForm === 1) {
      // console.log(data);
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
      //idAcslGeneral: { idAscl: 00000 },Este dato lo agarramos en el backend una vez registrado la entidad AcslGeneral
      descripcionMedia: "N/A",
      accionMedia: data.accion,
      nesesidadMedia: data.necesidad,
      compromisoMedia: data.compromiso,
      statusMedia: "1",
      datosMediaDet: datosMediaDet,
    };
    const datos = {
      programa: { idPrograma: data.programa },
      fecha: data.fecha,
      proyecto: { idProyecto: data.proyecto },
      area: { idArea: data.area },
      lugarObservacion: { idLugarObser: data.lugarobs },
      turno: { idTurno: data.turno },
      statusAscl: 2,
      acslGeneralAct: { idListActLiderazgo: 3 },
      usuarios: { idUser: account.idUser },
      datosAsclDetalle: null,
      datosAllMedia: datosMedia,
    };
    try {
      const response: reponseSaveAscl | undefined = await saveAsclFull(datos);

      if (response) {
        SweetNotifySuccesss({ message: "Documento registrado exitosamente" });
        onNext();
        const idOpt = response.object.idAscl;
        setIdPrograma(idOpt);
        await uploadImagesS3(data.imagenes, idOpt, ruta);
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
    //console.log("data: ", data);
    //console.log("lista proyectos", listaProyectos);
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
        value: "Observacion Planificada de Seguridad",
      },
    ];
    let preview2 = [
      {
        key: "Necesidad",
        value: data.necesidad,
      },
      {
        key: "Acción",
        value: data.accion,
      },
      {
        key: "Compromiso",
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
    window.location.href = `${process.env.NEXT_PUBLIC_HOST_URL}/pages/ssa/formopt `;
    //route.push("/pages/ssa/formopt");
  };

  return (
    <PageContainer title="SSA - OPS" description="Observacion Planificada de Seguridad">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h5">Observacion Planificada de Seguridad </Typography>
        </Stack>
        <Divider sx={{ borderStyle: "revert", m: 2 }} />

        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <BaseCard title="">
              <Stack spacing={3}>
                <div>
                  <Box
                    component="form"
                    onSubmit={saveASCL}
                    sx={{
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <Steps current={step} small>
                        <Steps.Item title={step === 0 ? "Info General" : step === 1 ? "Finalizado" : "Por completar"} />
                        <Steps.Item title={step === 1 ? "Revisión y finalizar" : step === 2 ? "Finalizado" : "Por completar"} />
                      </Steps>

                      <hr />

                      <Panel header={<Typography style={{ fontWeight: "bold", color: "#546E7A" }}> Sección {step + 1 + namePanel}</Typography>}>
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
                                  label="Programa"
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
                                  label="Lugar de Observacion"
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
                            <Divider sx={{ borderStyle: "revert", m: 2 }} />
                            {upLg ? (
                              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                <TableContainer sx={{ maxHeight: 440 }}>
                                  <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>
                                          <Typography variant="h6"> Datos Generales</Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography variant="h6">Acción</Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography variant="h6">Compromiso</Typography>
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
                                        <TableCell colSpan={3}>
                                          <Grid item xs={12} sm={6} md={4} lg={4}>
                                            <UploaderCC
                                              _control={control}
                                              label=" Adjuntar fotografías"
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
                              </Paper>
                            ) : (
                              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                <TableContainer sx={{ maxHeight: 640 }}>
                                  <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>
                                          <Typography variant="h6">Necesidad identificada - Acción- Compromiso</Typography>
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
                                        <TableCell>
                                          <Grid item xs={12}>
                                            <UploaderCC
                                              _control={control}
                                              label=" Adjuntar fotografías"
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
                              </Paper>
                            )}
                          </Box>
                        )}
                        {showForm == 1 && (
                          <Box component="section">
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <TableContainer component={Paper}>
                                  <Table size="small" aria-label="a dense table">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>
                                          <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                                            <CheckCircleOutline fontSize="small" /> Datos Generales
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
                                        <TableCell>
                                          <Typography variant="h6">
                                            <CheckCircleOutline />
                                            Acciones
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="left"></TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
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
                                              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
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
                        {showForm == 2 && (
                          <Box sx={{ textAlign: "center", padding: 2 }}>
                            <TaskAlt sx={{ fontSize: 70, color: "#00A76F" }} />
                            <Typography variant="h3" color="#00A76F">
                              Programa registrado exitosamente
                            </Typography>
                            <br />
                            <Task sx={{ fontSize: 200, color: "#566573" }} />
                            <br />
                            <Button onClick={showReporte} variant="contained" color="primary">
                              <Article /> Ver reporte
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
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          {showForm < 2 && (
                            <div>
                              <ButtonGroup>
                                <Button color="primary" onClick={onPrevious} disabled={step === 0} startIcon={<FirstPage />}>
                                  Regresar
                                </Button>
                                <Button type="submit" color="primary" disabled={step === 1} endIcon={<LastPage />}>
                                  Siguiente
                                </Button>
                              </ButtonGroup>
                            </div>
                          )}
                          <div>
                            {showForm == 1 && (
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
