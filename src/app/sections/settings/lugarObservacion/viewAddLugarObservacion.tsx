import { InputTextCC, InputPassCC } from "@/app/components/input";
import { Dialog, DialogTitle, Typography, DialogContent, FormControlLabel, Switch, DialogActions, IconButton, Grid, Button } from "@mui/material";
import React, { FormEvent } from "react";
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
}

export const ViewAddLugarObs: React.FC<UserModalProps<any>> = ({
  open,
  onClose,
  onSubmit,
  estadosave,
  register,
  control,
  setValue,
  errors,
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
            {estadosave == 1 ? "      Nuevo Lugar Observación" : "      Actualizar Lugar Observación"}
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
                label="Lugar Observación"
                icon={<PersonIcon />}
                type="text"
                name="nameLugarObservacion"
                size="small"
                required={true}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
            <FormControlLabel
                label="Estado"
                labelPlacement="start"
                control={<Switch {...register("statusLugarObservacion")} name="statusLugarObservacion" defaultChecked />}
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
