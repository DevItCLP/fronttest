/*
 * Created on Tue Aug 13 2024
 *
 * Copyright (c) 2024 CC
 *
 * Author Cristian R. Paz
 */

import { InputTextCC } from "@/app/components/input";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from "@mui/material";
import React, { FormEvent } from "react";
import CloseIcon from "@mui/icons-material/Close";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import KeyIcon from "@mui/icons-material/Key";

interface DataReset {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLDivElement>) => void;
  register: any;
  errors: any;
  statusPaasword: boolean;
}
export const ViewResetPassword: React.FC<DataReset> = ({ open, onClose, onSubmit, register, errors, statusPaasword }) => {
  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose} component="form" onSubmit={onSubmit}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <LockOpenIcon
            sx={{
              position: "absolute",
              left: 10,
              top: 18,
              color: (theme: any) => theme.palette.grey[500],
            }}
          />
          <Typography variant="button" sx={{ fontWeight: "bold", color: (theme) => theme.palette.grey[500] }}>
                  Restablecer Contraseña
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
            <Grid item xs={12} md={12}>
              <InputTextCC
                register={register}
                label=" Nueva contraseña"
                icon={<KeyIcon />}
                type="password"
                name="newPassword"
                size="small"
                required={true}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <InputTextCC
                register={register}
                label=" Confirme la nueva contraseña"
                icon={<KeyIcon />}
                type="password"
                name="confirmNewPassword"
                size="small"
                required={true}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              {statusPaasword && (
                <Alert variant="filled" severity="error">
                  Las contraseñas no coinciden
                </Alert>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="error" autoFocus onClick={onClose}>
            CANCELAR
          </Button>
          <Button type="submit" autoFocus>
            RESTABLECER
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
