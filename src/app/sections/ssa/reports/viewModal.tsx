/*
 * Created on Sat May 25 2024
 *
 * Copyright (c) 2024 CC
 *
 * Author: Cristian R. Paz
 */

import { DividerCenter } from "@/app/components/Divider";
import { Box, Button, CardMedia, Container, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import ReactToPrint from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import Image from "next/image";
import { useRef } from "react";
import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

interface interFace<T> {
  listaGeneral: T[];
  listaPreguntas: T[];
  listaImagenes: T[];
}
const zfill = (value: any, length: number) => {
  const str = value.toString();
  return str.padStart(length, "0");
};

const fechaActual = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(
  2,
  "0"
)}`;

export const DocModal: React.FC<interFace<any>> = ({ listaGeneral, listaPreguntas, listaImagenes }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Box display="flex" justifyContent="space-between" p={1} borderBottom={1} borderColor="grey.500">
        <Box>
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" color="primary">
                <PrintIcon />  Imprimir Reporte
              </Button>
            )}
            content={() => componentRef.current}
          />
        </Box>
        <Box>
          {listaGeneral[0].statusAscl == 2 ? (
            <Typography variant="h5" color="#00A76F">
              <CheckCircleOutlineIcon /> Documento Archivado
            </Typography>
          ) : (
            <Typography variant="h5" color="error">
              <RemoveCircleIcon />
              Documento Anulado
            </Typography>
          )}
        </Box>
      </Box>
      <div ref={componentRef}>
        <Container sx={{ padding: 5 }}>
          <Box>
            <Table size="small" sx={{ border: 1 }}>
              <TableBody>
                <TableRow>
                  <TableCell align="center" width={200} rowSpan={5}>
                    <Image src="/images/logos/logo.png" alt="logo" width={100} height={100} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Empresa</TableCell>
                  <TableCell>Catering Las Peñas</TableCell>
                </TableRow>
                <TableRow>
                  {/*  <TableCell>LOGO</TableCell> */}
                  <TableCell sx={{ fontWeight: "bold" }}>Tipo de Documento</TableCell>
                  <TableCell>Reporte de Actividades de Liderazgo de Seguridad en Campo</TableCell>
                </TableRow>
                <TableRow>
                  {/*  <TableCell>LOGO</TableCell> */}
                  <TableCell sx={{ fontWeight: "bold" }}>Programa</TableCell>
                  <TableCell>{`${listaGeneral[0].descriptionPrograma}  -   #${zfill(listaGeneral[0].id, 5)}`}</TableCell>
                </TableRow>

                <TableRow>
                  {/*   <TableCell>LOGO</TableCell> */}
                  <TableCell sx={{ fontWeight: "bold" }}>Fecha de Generación</TableCell>
                  <TableCell>{`${fechaActual} `}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <DividerCenter texto="Datos Generales" />

            <Table size="small" sx={{ border: 1 }}>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: 350 }}>Fecha de creación</TableCell>
                  <TableCell>{listaGeneral[0].fechaCreacion}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: 350 }}>Tipo de Actividad de Liderazgo</TableCell>
                  <TableCell>{listaGeneral[0].acslGeneralActividad}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: 350 }}>Fecha de Reporte Actividades de Liderazgo de Seguridad en Campo</TableCell>
                  <TableCell>{listaGeneral[0].fecha}</TableCell>
                </TableRow>
                {listaGeneral[0].duracion && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", width: 350 }}>Duracion de Actividades de Liderazgo </TableCell>
                    <TableCell>{`${listaGeneral[0].duracion} Horas`}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: 350 }}>Reportado Por</TableCell>
                  <TableCell>{`${listaGeneral[0].nombresUser} ${listaGeneral[0].apellidosUser}`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: 350 }}>Área Responsable</TableCell>
                  <TableCell>{listaGeneral[0].area}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: 350 }}>Lugar de Observación</TableCell>
                  <TableCell>{listaGeneral[0].lugarObservacion}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: 350 }}>Turno</TableCell>
                  <TableCell>{listaGeneral[0].turno}</TableCell>
                </TableRow>

                {listaGeneral[0].areaEspecifica && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", width: 350 }}>Área especifica</TableCell>
                    <TableCell>{listaGeneral[0].areaEspecifica}</TableCell>
                  </TableRow>
                )}

                {listaGeneral[0].nroParticipantes && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", width: 350 }}>Número de Participantes</TableCell>
                    <TableCell>{`${listaGeneral[0].nroParticipantes} Personas`}</TableCell>
                  </TableRow>
                )}

                {listaGeneral[0].tema && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Tema</TableCell>
                    <TableCell>{listaGeneral[0].tema}</TableCell>
                  </TableRow>
                )}

                {listaGeneral[0].desarrolloInteraccion && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Describa el desarrollo de la interacción</TableCell>
                    <TableCell>{listaGeneral[0].desarrolloInteraccion}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {listaPreguntas.length > 0 && listaGeneral[0].idListActLiderazgo == 2 ? (
              <DividerCenter texto=" Observaciones Encontradas" />
            ) : (
              <DividerCenter texto="Preguntas y Respuestas" />
            )}

            {listaPreguntas.map((val, index) => (
              <React.Fragment key={index}>
                {listaGeneral[0].idListActLiderazgo == 2 ? (
                  <Table key={index} size="small" sx={{ border: 1 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ textAlign: "left", borderRight: 0.5, width: 150 }}>
                          <Typography component={"span"} variant="h6">
                            {val.checkOption}:
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography component={"span"} variant="h6" fontWeight={"bold"}>
                            {val.comentarios}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ textAlign: "left", borderRight: 0.5, width: 150 }}>
                          <Typography fontWeight={"bold"}>Detalle de la Observación: </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{val.descripcionObservacion}</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ textAlign: "left", borderRight: 0.5, width: 150 }}>
                          <Typography fontWeight={"bold"}>Acción a Realizar: </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{val.accioObservacion}</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ textAlign: "left", borderRight: 0.5, width: 150 }}>
                          <Typography fontWeight={"bold"}>Responsable: </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{val.responsableControl}</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Grid item key={index} xs={12} sm={6} md={6}>
                            <CardMedia
                              key={`image-${index}`}
                              component="img"
                              height="300"
                              image={`${process.env.NEXT_PUBLIC_URL_MEDIA}/${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/${process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3}/inspecciones-planificadas/${val.imageObservacion}`}
                              style={{ objectFit: "contain" }}
                              alt={val.imageObservacion}
                            />
                          </Grid>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <Table size="small" sx={{ border: 1 }}>
                    <TableBody>
                      <TableRow key={index}>
                        <TableCell sx={{ fontWeight: "bold", backgroundColor: "#EBEDEF" }} colSpan={2}>
                          {val.preguntas}
                        </TableCell>
                      </TableRow>
                      <TableRow key={`opcion-${index}`}>
                        <TableCell sx={{ textAlign: "center", borderRight: 0.5, width: 150 }}>{val.checkOption}</TableCell>
                        <TableCell>{val.comentarios}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
                <hr />
              </React.Fragment>
            ))}

            {/*   {listaGeneral[0].idListActLiderazgo == 2 && (
              <Table size="small" sx={{ border: 1 }}>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", borderRight: 0.5, width: 150 }}>Descripción</TableCell>
                    <TableCell>{listaGeneral[0].descripcionMedia}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", borderRight: 0.5, width: 150 }}>Acción</TableCell>
                    <TableCell>{listaGeneral[0].accionMedia}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )} */}

            {listaGeneral[0].idListActLiderazgo == 3 ||
              (listaGeneral[0].idListActLiderazgo == 4 && (
                <>
                  <br />
                  <Table size="small" sx={{ border: 1 }}>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", borderRight: 0.5, width: 150 }}>Nesesidad Identificada</TableCell>
                        <TableCell>{listaGeneral[0].nesesidadMedia}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", borderRight: 0.5, width: 150 }}>Acción</TableCell>
                        <TableCell>{listaGeneral[0].accionMedia}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", borderRight: 0.5, width: 150 }}>Compromiso</TableCell>
                        <TableCell>{listaGeneral[0].compromisoMedia}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </>
              ))}

            {listaGeneral[0].idListActLiderazgo != 2 ? <DividerCenter texto="Imágenes" /> : ""}

            <Table size="small">
              <TableBody>
                <TableRow key={194}>
                  <TableCell>
                    <Grid container spacing={2} p={2}>
                      {listaImagenes.map((image, index) => (
                        <Grid item key={index} xs={12} sm={6} md={6}>
                          <CardMedia
                            key={`image-${index}`}
                            component="img"
                            height="300"
                            image={`${process.env.NEXT_PUBLIC_URL_MEDIA}${image.s3Url}${image.nameImage}`}
                            style={{ objectFit: "contain" }}
                            alt={image.name}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Container>
      </div>
    </>
  );
};
