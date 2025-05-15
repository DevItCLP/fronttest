/*
 * Created on Mon Jul 22 2024
 *
 * Copyright (c) 2024 CC
 *
 * Author Cristian R. Paz
 */

import {
  Box,
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactToPrint from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Image from "next/image";
import { DividerCenter } from "@/app/components/Divider";
import { useRef } from "react";
import ArticleIcon from "@mui/icons-material/Article";
interface interFace<T> {
  open: boolean;
  handleClose: any;
  listaDataReporte: T[];
}
export const ModalViewCierre: React.FC<interFace<any>> = ({ open, handleClose, listaDataReporte }) => {
  //----------------------------------CONSTANTES-----------------------------------------------------

  const componentRef = useRef<HTMLDivElement>(null);
  const folderModule: string = "inspecciones-planificadas";
  const fechaActual = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(
    2,
    "0"
  )}`;
  const ModalDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
    "& .MuiPaper-root": {
      width: "70%",
      maxWidth: "none",
    },
  }));

  //-----------------------------------------FUNCIONES----------------------------------------------------

  const zfill = (value: number, length: number) => {
    const str = value.toString();
    return str.padStart(length, "0");
  };
  return (
    <>
      {open && (
        <ModalDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
          <Box display="flex" justifyContent="space-between" p={1} borderBottom={1} borderColor="grey.500">
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              <ArticleIcon /> REPORTE DE CIERRE DE OBSERVACIONES
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogContent dividers>
            <div ref={componentRef}>
              {listaDataReporte && listaDataReporte.length > 0 && (
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" width={200} rowSpan={5}>
                        <Image src="/images/logos/logo.png" alt="logo" width={100} height={100} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          CÓDIGO: <Typography component={"span"}>{zfill(listaDataReporte[0].idAscl, 6)}</Typography>
                        </Typography>
                      </TableCell>
                      {/*  <TableCell>
                        <Typography variant="subtitle2">
                          TIPO DE CHECKLIST: <Typography component={"span"}>{listaDataReporte[0].nameTipoCheckList}</Typography>
                        </Typography>
                      </TableCell> */}
                      <TableCell>
                        <Typography variant="subtitle2">
                          LUGAR DE OBSERVACIÓN: <Typography component={"span"}>{listaDataReporte[0].lugarObservacion}</Typography>
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      {/*  <TableCell>LOGO</TableCell> */}
                      <TableCell>
                        <Typography variant="subtitle2">
                          RESPONSABLE DE CONTROL: <Typography component={"span"}>{listaDataReporte[0].usuarioControl}</Typography>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          FECHA DE REGISTRO: <Typography component={"span"}>{listaDataReporte[0].fechaRegistro}</Typography>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
              <hr />
              <TableContainer>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <TableCell>CÓDIGO</TableCell>
                      <TableCell align="left">ACTO-CONDICIÓN</TableCell>
                      <TableCell align="left">OBSERVACIÓN ENCONTRADA</TableCell>
                      <TableCell width={300} align="left">
                        EVIDENCIA DE OBSERVACIÓN
                      </TableCell>
                      <TableCell align="left">ACCIÓN REALIZADA</TableCell>
                      <TableCell width={300} align="left">
                        EVIDENCIA DE CIERRE
                      </TableCell>
                      <TableCell align="left">USUARIO CONTROLADOR</TableCell>
                      <TableCell align="left">USUARIO EJECUTOR</TableCell>
                      <TableCell align="left">ESTADO</TableCell>
                      <TableCell align="left">F. CIERRE</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listaDataReporte.map((data) => {
                      return (
                        <TableRow key={data.id}>
                          <TableCell>
                            {zfill(data.idAscl, 5)}-{data.id}
                          </TableCell>
                          <TableCell>{data.checkOption}</TableCell>
                          <TableCell>{data.comentarios}</TableCell>
                          <TableCell>
                            <CardMedia
                              key={`image`}
                              component="img"
                              height="100"
                              image={`${process.env.NEXT_PUBLIC_URL_MEDIA}/${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/${process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3}/${folderModule}/${data.imageObservacion}`}
                              alt={data.imageObservacion}
                            />
                          </TableCell>
                          <TableCell>{data.accionRealizadaCierre}</TableCell>
                          <TableCell>
                            {/*   <CardMedia
                              key={`image`}
                              component="img"
                              height="100"
                              image={`${process.env.NEXT_PUBLIC_URL_MEDIA}/${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/${process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3}/${folderModule}/${data.imagenAccionRealizadaCierre}`}
                              alt={data.imagenAccionRealizadaCierre}
                            /> */}
                            {data.imagenAccionRealizadaCierre &&
                              data.imagenAccionRealizadaCierre.split(", ").map((data: string, index: number) => {
                                const isPDF = data.toLowerCase().endsWith(".pdf");
                                const fileUrl = `${process.env.NEXT_PUBLIC_URL_MEDIA}/${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/${process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3}/inspecciones-planificadas/${data}`;

                                return isPDF ? (
                                  <a key={index} href={fileUrl} target="_blank" rel="noopener noreferrer">
                                    📄 Descargar Informe {data}
                                  </a>
                                ) : (
                                  <CardMedia key={index} component="img" height="300" image={fileUrl} style={{ objectFit: "contain" }} alt={data} />
                                );
                              })}
                          </TableCell>
                          <TableCell>{data.usuarioControl}</TableCell>
                          <TableCell>{data.usuarioEjecucion}</TableCell>
                          <TableCell>
                            {data.statusAcslDet == 0 && <Typography color={"#F4D03F"}> ⚠️ ABIERTO</Typography>}
                            {data.statusAcslDet == 1 && <Typography color={"#2196F3"}> 📶EN PROCESO</Typography>}
                            {data.statusAcslDet == 2 && <Typography color={"#52BE80"}> ✅ CERRADO</Typography>}
                            {data.statusAcslDet == 3 && <Typography color={"#17a589"}> ✅ GESTIONADO</Typography>}
                          </TableCell>
                          <TableCell>{data.fechaObservacionCierre}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </DialogContent>
          <DialogActions>
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
          </DialogActions>
        </ModalDialog>
      )}
    </>
  );
};
