/*
 * Created on Tue Aug 13 2024
 *
 * Copyright (c) 2024 CC
 *
 * Author Cristian R. Paz
 */

import { InputTextCC, InputPassCC } from "@/app/components/input";
import { SelectSimple } from "@/app/components/select-option";
import { Dialog, DialogTitle, Typography, DialogContent, FormControlLabel, Switch, DialogActions, IconButton, Grid, Button } from "@mui/material";
import React, { FormEvent } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

interface UserModalProps<T> {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLDivElement>) => void;
  estadosave: number;
  register: any;
  control: any;
  setValue: any;
  errors: any;
  listaRoles: T[];
}

export const ViewAddUser: React.FC<UserModalProps<any>> = ({
  open,
  onClose,
  onSubmit,
  estadosave,
  register,
  control,
  setValue,
  errors,
  listaRoles,
}) => {
  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose} component="form" onSubmit={onSubmit}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <PersonAddIcon
            sx={{
              position: "absolute",
              left: 10,
              top: 18,
              color: (theme: any) => theme.palette.grey[500],
            }}
          />
          <Typography variant="button" sx={{ fontWeight: "bold", color: (theme) => theme.palette.grey[500] }}>
            {estadosave == 1 ? "      Nuevo Usuario" : "      Actualizar Usuario"}
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
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InputTextCC
                register={register}
                label=" Nombres"
                icon={<PersonIcon />}
                type="text"
                name="nombreUsuario"
                size="small"
                required={true}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputTextCC
                register={register}
                label=" Apellidos"
                icon={<PersonIcon />}
                type="text"
                name="apellidoUsuario"
                size="small"
                required={true}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputTextCC
                register={register}
                label=" Email"
                icon={<MarkEmailReadIcon />}
                type="email"
                name="emailUser"
                size="small"
                required={true}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputTextCC
                register={register}
                label=" Telefono"
                icon={<PhoneAndroidIcon />}
                type="number"
                name="telefonoUser"
                size="small"
                required={true}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputTextCC
                register={register}
                label=" Usuario"
                icon={<AccountCircleIcon />}
                type="text"
                name="username"
                size="small"
                required={true}
                errors={errors}
              />
            </Grid>
            {estadosave == 1 && (
              <Grid item xs={12} md={6}>
                <InputPassCC register={register} label="Password" name="password" size="small" required={true} errors={errors}></InputPassCC>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <SelectSimple
                _control={control}
                _setValue={setValue}
                label=" Roles"
                name="idRol"
                size="small"
                required={true}
                errors={errors}
                listaData={listaRoles}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                label="Estado"
                labelPlacement="start"
                control={<Switch {...register("statusUser")} name="statusUser" defaultChecked />}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="error" autoFocus onClick={onClose}>
            CANCELAR
          </Button>
          <Button type="submit" autoFocus>
            {estadosave == 1 ? "GUARDAR" : "ACTUALIZAR"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
