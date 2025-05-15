/*
 * Created on Thu Oct 10 2024
 *
 * Copyright (c) 2024 CC
 *
 * Author Cristian R. Paz
 */

import { InputTextAreaCC } from "@/app/components/input";
import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Button,
  MenuItem,
  FormControl,
  Select,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Table,
  CardMedia,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FormEvent } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { UploaderAvatar, UploaderCC } from "@/app/components/uploader";
import { PhotoCamera, RuleFolder, SaveAs, DoDisturbOn, HourglassBottom, DoneAll, WarningAmber } from "@mui/icons-material";
import { Controller } from "react-hook-form";
import { DividerCenter } from "@/app/components/Divider";

interface CloseObservacionProps<T> {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLDivElement>) => void;
  register: any;
  control: any;
  setValue: any;
  errors: any;
  dataParams: any;
  watch: any;
  //listaRoles: T[];
}

export const CloseInspeccion: React.FC<CloseObservacionProps<any>> = ({
  open,
  onClose,
  onSubmit,
  register,
  control,
  setValue,
  errors,
  dataParams,
  watch,
}) => {
  const [indexcolor, setIndexcolor] = useState<any>();

  const folderModule: string = "inspecciones-ssa";

  const colorOptions: any = {
    "0": "#F4D03F", // Naranja ABIERTO
    "1": "#2196F3", // Azul EN PROCESO
    "2": "#52BE80", // Verde CERRADO
    "3": "#17a589", // Verde fuerte CIERRE APROBADO
  };
  //const [files, setFiles] = useState();

  const setColor = (evt: any) => {
    setIndexcolor(evt.target.value);
    setValue("estadoCierre", evt.target.value);
  };
  const estadoCierre = watch("estadoCierre");

  /*   function splitFiles() {
    console.log(dataParams.row);
    const filesOpaci = dataParams.row;
    const filesArray = filesOpaci.split(", ").map((name: string) => ({ name }));
    setFiles(filesArray);
  } */

  useEffect(() => {
    setIndexcolor(estadoCierre);
  }, [estadoCierre]);

  return (
    <React.Fragment>
      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            minHeight: "600px", // Altura mínima
            minWidth: "70%", // Ancho mínimo
          },
        }}
        open={open}
        onClose={onClose}
        component="form"
        onSubmit={onSubmit}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <RuleFolder
            sx={{
              position: "absolute",
              left: 10,
              top: 18,
              color: (theme: any) => theme.palette.grey[900],
            }}
          />
          <Typography variant="button" sx={{ fontWeight: "bold", color: (theme) => theme.palette.grey[900] }}>
                  Cerrar observación encontrada. Doc: {dataParams.row?.id}
          </Typography>
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: (theme) => theme.palette.grey[500] }}>
                Observación encontrada
              </Typography>
              <hr />
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: "left", width: 150 }}>
                      <Typography component={"span"} variant="h6">
                        {watch("checkList")}:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography component={"span"} variant="h6" fontWeight={"bold"}>
                        {watch("observacionEncontrada")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ textAlign: "left", width: 150 }}>
                      <Typography fontWeight={"bold"}>Lugar </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{watch("lugarObservacion")}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: "left", width: 150 }}>
                      <Typography fontWeight={"bold"}>Detalle: </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{watch("nombreOpcion")}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: "left", width: 150 }}>
                      <Typography fontWeight={"bold"}>Acción a realizar: </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{watch("accionInmediata")}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: "left", width: 150 }}>
                      <Typography fontWeight={"bold"}>Fecha de Observación: </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{watch("fechaRegistro")}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: "left", width: 150 }}>
                      <Typography fontWeight={"bold"}>Asignado Por: </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{watch("userNameControl")}</Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={2}>
                      <Grid item xs={12} sm={6} md={6}>
                        <CardMedia
                          component="img"
                          height="300"
                          image={`${process.env.NEXT_PUBLIC_URL_MEDIA}/${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/${
                            process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3
                          }/inspecciones-ssa/${watch("imagenObservacion")}`}
                        />
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: "grid", alignItems: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: (theme) => theme.palette.grey[500] }}>
                Acción Realizada
              </Typography>
              <br />
              <Grid item xs={12} md={12}>
                <InputTextAreaCC
                  register={register}
                  label=" Detalle la acción realizada"
                  name="accionRealizada"
                  required={true}
                  errors={errors}
                  rows={3}
                  disabled={watch("estadoObservacionCierre") == "2" ? true : false}
                />
              </Grid>
              <br />
              <Grid item xs={12} md={6}>
                {/* <UploaderAvatar
                  _control={control}
                  name="images"
                  icon={<PhotoCamera />}
                  required={false}
                  multiple={false}
                  errors={errors}
                  shouldFocus={false}
                  imagePreview={
                    dataParams.row?.imagenAccionRealizadaCierre
                      ? `${process.env.NEXT_PUBLIC_URL_MEDIA}/${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/${process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3}/${folderModule}/${dataParams.row.imagenAccionRealizadaCierre}`
                      : ""
                  }
                  disabled={watch("estadoCierre") == "2" ? true : false}
                /> */}

                <UploaderCC
                  _control={control}
                  label=" Adjuntar Evidencias"
                  name="images"
                  required={true}
                  multiple={true}
                  errors={errors}
                  shouldFocus={false}
                  disabled={watch("estadoCierre") == "2" ? true : false}
                />
              </Grid>
              <DividerCenter texto="Evidencia de cierre" />
              <Grid container spacing={3} justifyContent={"center"}>
                {watch("imagenObservacionCierre") &&
                  watch("imagenObservacionCierre")
                    .split(", ")
                    .map((data: string, index: number) => {
                      const isPDF = data.toLowerCase().endsWith(".pdf");
                      const fileUrl = `${process.env.NEXT_PUBLIC_URL_MEDIA}/${process.env.NEXT_PUBLIC_URL_FOLDER_MAIN_S3}/${process.env.NEXT_PUBLIC_URL_FOLDER_SSA_S3}/inspecciones-ssa/${data}`;

                      return isPDF ? (
                        <Grid item xs={12} sm={6} md={6}>
                          <a key={index} href={fileUrl} target="_blank" rel="noopener noreferrer">
                            📄 Descargar Informe {data}
                          </a>
                        </Grid>
                      ) : (
                        <Grid item xs={12} sm={6} md={6}>
                          <CardMedia key={index} component="img" height="300" image={fileUrl} style={{ objectFit: "contain" }} alt={data} />
                        </Grid>
                      );
                    })}
              </Grid>
              <DividerCenter texto="Cambio de estado" />
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ textAlign: "center" }}>
                  <Controller
                    name={`estadoCierre`}
                    control={control}
                    rules={{ required: { value: false, message: `estado is required` } }}
                    render={({ field }) => (
                      <Select
                        fullWidth
                        {...field}
                        onChange={(evt) => {
                          setColor(evt);
                        }}
                        sx={{
                          backgroundColor: colorOptions[indexcolor] || "initial",
                          color: "#FFFFFF",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                        }}
                      >
                        {watch("estadoCierre") == "3"
                          ? [
                              <MenuItem key="3" sx={{ color: colorOptions[3] }} value={3}>
                                <DoneAll /> CIERRE APROBADO
                              </MenuItem>,
                            ]
                          : [
                              <MenuItem key="0" sx={{ color: colorOptions[0] }} value={0}>
                                <WarningAmber /> ABIERTO
                              </MenuItem>,
                              <MenuItem key="1" sx={{ color: colorOptions[1] }} value={1}>
                                <HourglassBottom /> EN PROCESO
                              </MenuItem>,
                              <MenuItem key="2" sx={{ color: colorOptions[2] }} value={2}>
                                <DoneAll /> CERRADO
                              </MenuItem>,
                            ]}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button disabled={watch("estadoCierre") == "3" ? true : false} color="error" autoFocus onClick={onClose}>
            <DoDisturbOn />
            CANCELAR
          </Button>
          <Button disabled={watch("estadoCierre") == "3" ? true : false} type="submit" autoFocus>
            <SaveAs />
            REGISTRAR CIERRE
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
