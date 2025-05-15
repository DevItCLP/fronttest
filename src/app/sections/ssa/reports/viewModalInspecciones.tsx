/*
 * Created on Wed Mar 05 2025
 *
 * Copyright (c) 2025 CC
 *
 * Author Cristian R. Paz
 */
import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
interface CategoriaOption {
  idCategoria: number;
  nombreCategoria: string;
}

interface OptionChecklist {
  fkCategoriaOption?: CategoriaOption; // Puede ser undefined si falta
}

interface ChecklistItem {
  id: number;
  observacionEncontrada: string;
  checkOption: number;
  nombreOpcion: string;
  idChecklist: number;
  userNameControl: string;
  estadoObservacionCierre: number;
  accionRealizadaCierre: string;
  nameTipoCheckList: string;
  nameLugarObservacion: string;
  estadoChecklist: number;
  fechaRegistro: string;
  optionChecklist?: OptionChecklist; // Puede ser undefined si no tiene categoría
}

interface GroupedCategory {
  idCategoria: number;
  nombreCategoria: string;
  values: ChecklistItem[];
}

type GroupedChecklistData = GroupedCategory[];

function groupByCategory(data: ChecklistItem[]): GroupedChecklistData {
  return Object.values(
    data.reduce<Record<number, GroupedCategory>>((acc, item) => {
      const categoria = item.optionChecklist?.fkCategoriaOption;

      if (categoria) {
        const { idCategoria, nombreCategoria } = categoria;

        if (!acc[idCategoria]) {
          acc[idCategoria] = {
            idCategoria,
            nombreCategoria,
            values: [],
          };
        }

        acc[idCategoria].values.push(item);
      }

      return acc;
    }, {})
  );
}

export const ModalView: React.FC<interFace<any>> = ({
  open,
  handleClose,
  listaDataReporte,
}) => {
  const groupedData = groupByCategory(listaDataReporte);

  const componentRef = useRef<HTMLDivElement>(null);
  const lsize = listaDataReporte.length + 1;
  const checkOk = listaDataReporte.filter((data) => data.checkOption == 0);
  //console.log("sdaaaa=====>>>>", listaDataReporte);
  const cumple = (checkOk.length * 100) / lsize;
  const nocumple = 100 - cumple;

  const zfill = (value: number, length: number) => {
    const str = value.toString();
    return str.padStart(length, "0");
  };

  const fechaActual = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

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

  return (
    <>
      {open && (
        <ModalDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            p={1}
            borderBottom={1}
            borderColor="grey.500"
          >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              <ArticleIcon /> REPORTE DE CHECK LIST
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

            {listaDataReporte && listaDataReporte.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  right: 60,
                  top: 20,
                }}
              >
                {listaDataReporte[0].estadoChecklist == 2 ? (
                  <Typography variant="h5" color="#00A76F">
                    <CheckCircleOutlineIcon /> Documento Registrado
                  </Typography>
                ) : (
                  <Typography variant="h5" color="error">
                    <RemoveCircleIcon />
                    Documento Anulado
                  </Typography>
                )}
              </Box>
            )}
          </Box>
          <DialogContent dividers>
            <div ref={componentRef}>
              {listaDataReporte && listaDataReporte.length > 0 && (
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" width={200} rowSpan={5}>
                        <Image
                          src="/images/logos/logo.png"
                          alt="logo"
                          width={100}
                          height={100}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          CODIGO:{" "}
                          <Typography component={"span"}>
                            {zfill(listaDataReporte[0].idChecklist, 6)}
                          </Typography>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          TIPO DE CHECKLIST:{" "}
                          <Typography component={"span"}>
                            {listaDataReporte[0].nameTipoCheckList}
                          </Typography>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          ÁREA:{" "}
                          <Typography component={"span"}>
                            {listaDataReporte[0].nameLugarObservacion}
                          </Typography>
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      {/*  <TableCell>LOGO</TableCell> */}
                      <TableCell>
                        <Typography variant="subtitle2">
                          RESPONSABLE DE CONTROL:{" "}
                          <Typography component={"span"}>
                            {listaDataReporte[0].userNameControl}
                          </Typography>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          FECHA:{" "}
                          <Typography component={"span"}>
                            {listaDataReporte[0].fechaRegistro}
                          </Typography>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}

              <DividerCenter texto="Datos Generales" />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="h6">
                          OPCIONES DEL CHECKLIST
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>OPCIÓN</TableCell>
                      <TableCell align="left">ESTADO</TableCell>
                      <TableCell align="left">OBSERVACIÓN</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedData.map((categoria) => {
                      const totalChecksRealizados = categoria.values.filter(
                        (data) => data.checkOption === 0
                      ).length;
                      return (
                        <React.Fragment key={categoria.idCategoria}>
                          {/* 🔹 Nombre de la categoría como encabezado */}
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              style={{
                                backgroundColor: "#f0f0f0",
                                fontWeight: "bold",
                              }}
                            >
                              {categoria.nombreCategoria}
                            </TableCell>
                          </TableRow>
                          {/* 🔹 Opciones dentro de la categoría */}
                          {categoria.values.map((data) => (
                            <TableRow key={data.id}>
                              <TableCell>{data.nombreOpcion}</TableCell>
                              <TableCell>
                                {data.checkOption === 0 ? "✅" : "⚠️"}
                              </TableCell>
                              <TableCell>
                                {data.observacionEncontrada || "S/N"}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              align="left"
                              sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}
                            >
                              Total Checks Realizados (cumplidos):{" "}
                              {totalChecksRealizados}
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <DividerCenter texto="Porcentaje de Cumplimiento" />
              <Box sx={{ width: 300 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography variant="subtitle1">
                          PORCENTAJE DE CUMPLIMIENTO
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2" color="#00A76F">
                          ✅ CUMPLE:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" color="#00A76F">
                          {cumple.toFixed(2)}%
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2" color="RED">
                          ⚠️ NO CUMPLE:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" color="RED">
                          {nocumple.toFixed(2)}%
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
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
