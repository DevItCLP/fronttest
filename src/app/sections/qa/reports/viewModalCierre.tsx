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
  const folderModule: string = "inspecciones-qa";
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
                          CODIGO: <Typography component={"span"}>{zfill(listaDataReporte[0].idChecklist, 6)}</Typography>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          TIPO DE CHECKLIST: <Typography component={"span"}>{listaDataReporte[0].nameTipoCheckList}</Typography>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          ÁREA: <Typography component={"span"}>{listaDataReporte[0].nameLugarObservacion}</Typography>
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      {/*  <TableCell>LOGO</TableCell> */}
                      <TableCell>
                        <Typography variant="subtitle2">
                          RESPONSABLE DE CONTROL: <Typography component={"span"}>{listaDataReporte[0].userNameControl}</Typography>
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
                      <TableCell align="left">OBSERVACIÓN ENCONTRADA</TableCell>
                      <TableCell width={300} align="left">
                        EVIDENCIA OBSERVACIÓN
                      </TableCell>
                      <TableCell align="left">ACCIÓN REALIZADA</TableCell>
                      <TableCell width={300} align="left">
                        EVIDENCIA CIERRE
                      </TableCell>
                      <TableCell align="left">USUARIO CONTROLADOR</TableCell>
                      <TableCell align="left">USUARIO EJECUTOR</TableCell>
                      <TableCell align="left">ESTADO</TableCell>
                      <TableCell align="left">F. CIERRE</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listaDataReporte
                      .filter((val) => val.checkOption == 1 && val.estadoObservacionCierre != -1)
                      .map((data) => {
                        return (
                          <TableRow key={data.id}>
                            <TableCell>
                              {zfill(data.idChecklist, 5)}-{data.id}
                            </TableCell>
                            <TableCell>{data.observacionEncontrada}</TableCell>
                            <TableCell>
                              <CardMedia
                                key={`image`}
                                component="img"
                                height="100"
                                image={`${process.env.NEXT_PUBLIC_URL_MEDIA}/${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/${process.env.NEXT_PUBLIC_URL_FOLDER_QA_S3}/${folderModule}/${data.imagenObservacion}`}
                                alt={data.imagenObservacion}
                              />
                            </TableCell>
                            <TableCell>{data.accionRealizadaCierre}</TableCell>
                            <TableCell>
                              <CardMedia
                                key={`image`}
                                component="img"
                                height="100"
                                image={`${process.env.NEXT_PUBLIC_URL_MEDIA}/${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/${process.env.NEXT_PUBLIC_URL_FOLDER_QA_S3}/${folderModule}/${data.imagenObservacionCierre}`}
                                alt={data.imagenObservacionCierre}
                              />
                            </TableCell>
                            <TableCell>{data.userNameControl}</TableCell>
                            <TableCell>{data.userNameEjecucion}</TableCell>
                            <TableCell>
                              {data.estadoObservacionCierre == 0 && <Typography color={"#F4D03F"}> ⚠️ ABIERTO</Typography>}
                              {data.estadoObservacionCierre == 1 && <Typography color={"#2196F3"}> 📶EN PROCESO</Typography>}
                              {data.estadoObservacionCierre == 2 && <Typography color={"#52BE80"}> ✅ CERRADO</Typography>}
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
