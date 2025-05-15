import { Box, Button, CardMedia, Container, Grid, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import Image from "next/image";
import { DividerCenter } from "@/app/components/Divider";
import AppCurrentVisits from "@/app/components/dashboard/app-current-visits";
import AppWebsiteVisits from "@/app/components/dashboard/app-website-visits";

interface interFace<T> {
  listaOpaci: T[];
  listaOpaciCond: T[];

  listaGeneralOpaciCircle?: T[];
  listaGeneralOpaci?: T[];
  listaGeneralDAIOpaciCircle?: T[];
  listaGeneralDCIOpaciCircle?: T[];
}

const fechaActual = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(
  2,
  "0"
)}`;

export const DocModalOpaci: React.FC<interFace<any>> = ({
  listaOpaci,
  listaOpaciCond,
  listaGeneralOpaciCircle,
  listaGeneralOpaci,
  listaGeneralDAIOpaciCircle,
  listaGeneralDCIOpaciCircle,
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Box display="flex" justifyContent="space-between" p={1} borderBottom={1} borderColor="grey.500">
        <Box>
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" color="primary">
                <PrintIcon /> Imprimir Reporte
              </Button>
            )}
            content={() => componentRef.current}
          />
        </Box>
      </Box>

      <div ref={componentRef}>
        <Container sx={{ padding: 5 }}>
          <Box>
            <Table size="small" sx={{ border: 1 }}>
              <TableBody>
                <TableCell>
                  <TableCell sx={{ textAlign: "left", borderRight: 1, width: 200 }}>
                    <Image src="/images/logos/logo.png" alt="logo" width={100} height={100} />
                  </TableCell>
                </TableCell>

                <TableCell>
                  {/*  <TableCell>LOGO</TableCell> */}
                  <TableCell align="center" colSpan={3} sx={{ fontWeight: "bold", fontSize: "18px" }}>
                    Consolidado mensual Matriz de Reportes SISTEMA ZAMI de control (OPACI)
                    <br /> Observación de actos y condiciones inseguras Catering Las Peñas
                  </TableCell>
                </TableCell>
              </TableBody>
            </Table>

            <Table size="small" sx={{ border: 1 }}>
              <TableBody>
                <TableRow>
                  {/*  <TableCell>LOGO</TableCell> */}
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      width: "75%",
                      marginTop: "2",
                      borderRight: 1,
                    }}
                  >
                    Empresa: Catering Las Peñas
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>{`Fecha: ${fechaActual} `}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Table size="small" sx={{ border: 1, marginTop: 1 }}>
              <TableBody>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Reporte de Liderazgo REPORTE OPACI
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <DividerCenter texto="Actos Inseguros D.A.I" />
            <Table size="small" sx={{ border: 3, marginTop: 1 }}>
              <TableBody>
                <TableRow>
                  {/*  <TableCell>LOGO</TableCell> */}

                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      borderRight: 1,
                      width: 10,
                    }}
                  >
                    Fecha/Mes
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      borderRight: 1,
                      width: 10,
                    }}
                  >
                    Total Actos Reportados
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      borderRight: 1,
                      width: 10,
                    }}
                  >
                    Actos Pendientes
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      borderRight: 1,
                      width: 10,
                    }}
                  >
                    Actos en Proceso
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      borderRight: 1,
                      width: 10,
                    }}
                  >
                    Actos Gestionados
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      borderRight: 1,
                      width: 10,
                    }}
                  >
                    Porcentaje Gestionados
                  </TableCell>
                </TableRow>
              </TableBody>
              {listaOpaci.length > 0 ? (
                listaOpaci.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "left" }}>
                      {row.fechaMes}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {row.acto}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {row.totalPendiente}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {row.totalProceso}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {row.totalGestionado}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {row.porcentajeGestionado}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay datos disponibles
                  </TableCell>
                </TableRow>
              )}
            </Table>
            <DividerCenter texto="Condiciones Inseguras D.C.I" />
            <Table size="small" sx={{ border: 3, marginTop: 1 }}>
              <TableBody>
                <TableRow>
                  {/*  <TableCell>LOGO</TableCell> */}

                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      borderRight: 1,
                      width: 10,
                    }}
                  >
                    Fecha/Mes
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      borderRight: 1,
                      width: 10,
                    }}
                  >
                    Total Condiciones Reportados
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      borderRight: 1,
                      width: 10,
                    }}
                  >
                    Condiciones Pendientes
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      borderRight: 1,
                      width: 10,
                    }}
                  >
                    Condiciones en Proceso
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      borderRight: 1,
                      width: 10,
                    }}
                  >
                    Condiciones Gestionadas
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      borderRight: 1,
                      width: 10,
                    }}
                  >
                    Porcentaje Gestionados
                  </TableCell>
                </TableRow>
              </TableBody>
              {listaOpaciCond.length > 0 ? (
                listaOpaciCond.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "left" }}>
                      {row.fechaMes}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {row.condicion}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {row.totalPendiente}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {row.totalProceso}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {row.totalGestionado}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                      {row.porcentajeGestionado}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay datos disponibles
                  </TableCell>
                </TableRow>
              )}
            </Table>




            <AppCurrentVisits title="" chart={listaGeneralOpaciCircle} subheader="GRÁFICO DE TOTALES EN ACTOS Y CONDICIONES INSEGURAS" />
            <DividerCenter texto="" />
            <AppWebsiteVisits title="" chart={listaGeneralOpaci} subheader="GRÁFICO DE ACTOS Y CONDICIONES INSEGURAS POR DÍA" />
            <DividerCenter texto="" />
            <Grid container spacing={8} justifyContent={"center"}>
              <Grid item xs={6} md={6} lg={6}>
                <AppCurrentVisits title="" chart={listaGeneralDAIOpaciCircle} subheader="GRÁFICO RESUMEN DE ACTOS" />
              </Grid>
              <Grid item xs={6} md={6} lg={6}>
                <AppCurrentVisits title="" chart={listaGeneralDCIOpaciCircle} subheader="GRÁFICO RESUMEN DE CONDICIONES" />
              </Grid>
            </Grid>

            {/* <DividerCenter texto="Resultados Generales" /> */}
            {/*  <Table size="small" sx={{ border: 3, marginTop: 1 }}>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: 350 }}>Fecha Meses</TableCell>
                  <TableCell>{listaOpaci[0].fechaMes}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: 350 }}>Total DCI</TableCell>
                  <TableCell>{listaOpaci[0].condicion}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", width: 350 }}>Total DAI</TableCell>
                  <TableCell>{listaOpaci[0].acto}</TableCell>
                </TableRow>
              </TableBody>
            </Table> */}
          </Box>
        </Container>
      </div>
    </>
  );
};
