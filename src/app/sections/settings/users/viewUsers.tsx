/*
 * Created on Tue Aug 13 2024
 *
 * Copyright (c) 2024 CC
 *
 * Author Cristian R. Paz
 */

import { Account } from "@/app/_mock/account";
import { GetAllUsuarios, GetRoles } from "@/app/api/dataApiComponents";
import PageContainer from "@/app/components/container/PageContainer";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  SelectChangeEvent,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar, GridToolbarProps } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoIcon from "@mui/icons-material/Info";
import LockResetIcon from "@mui/icons-material/LockReset";
import { CustomToolbar } from "@/app/components/CustomToolbar";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { InputPassCC, InputTextCC } from "@/app/components/input";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import PersonIcon from "@mui/icons-material/Person";
import { SelectSimple } from "@/app/components/select-option";
import { resetPassword, saveUsuario, updateUsuario } from "@/app/controllers/common/ControllerUsuarios";
import { SweetNotifyError, SweetNotifySuccesss } from "@/app/components/sweet-notificacion";
import { alpha } from "@mui/material/styles";
import { ViewAddUser } from "./viewAddUser";
import { ViewResetPassword } from "./viewResetPassword";

export default function UsersView() {
  type MenuState = {
    [key: string]: HTMLElement | null;
  };

  /*--------------------------------------------------REACT HOCK FORM ---------------------------------------*/
  const {
    register,
    control,
    reset,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();
  /*----------------------------------------LISTAS USE STATE-----------------------------------------------*/
  const [dataRows, setlistaUsuarios] = useState<ObjectData[]>([]);
  const [listaRoles, setListaRoles] = useState<ObjectData[]>([]);
  const [menuAnchors, setMenuAnchors] = useState<MenuState>({});

  const [openmodal, setOpenModal] = useState(false);
  const [openmodal2, setOpenModal2] = useState(false);
  const [estadosave, setEstadoSave] = useState<number>(1);
  const [idUpdate, setIdUpdate] = useState<number | null>(null);
  const [statusPaasword, setStatusPaasword] = useState<boolean>(false);

  /*-------------------DATOS DE INICIO DE SESION Y CONSTANTES GLOBALES --------------------------------*/
  const account = Account();
  const defaulValues = {
    username: "",
    password: "",
    nombreUsuario: "",
    apellidoUsuario: "",
    emailUser: "",
    telefonoUser: "",
    statusUser: 1,
    idRol: "",
  };
  const defaulValuesResetPassword = {
    newPassword: "",
    confirmNewPassword: "",
  };
  /*------------------------------FUNCIONES------------------------------------------*/

  useEffect(() => {
    getAllUsers();
  }, []);
  const zfill = (value: any, length: number) => {
    const str = value.toString();
    return str.padStart(length, "0");
  };
  async function getAllUsers() {
    const usuarios = await GetAllUsuarios();
    const roles = await GetRoles();
    setlistaUsuarios(usuarios);
    setListaRoles(roles);
  }

  const handleClickClose = () => {
    reset(defaulValues); //LIMPIO EL FORMULARIO
    setEstadoSave(1); //LE DIGO QUE SE PONGA EN ESTADO PARA GUARDAR
    setIdUpdate(null); //ENCERO EL ID QUE LO ALMACENO PARA UN UPDATE
    setOpenModal(false); //CAMBIO EL ESTADO DEL MODAL A FALSE (CERRADO)
  };
  const handleClickClose2 = () => {
    reset(defaulValuesResetPassword); //LIMPIO EL FORMULARIO DE RESET
    setIdUpdate(null); //ENCERO EL ID QUE LO ALMACENO PARA EL UPDATE DE PASSWORD
    setOpenModal2(false); //CAMBIO EL ESTADO DEL MODAL A FALSE (CERRADO)
    setStatusPaasword(false); //Este se activa cuando las contraseñas no coinciden
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setMenuAnchors((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  const handleClose = (id: string) => {
    setMenuAnchors((prev) => ({ ...prev, [id]: null }));
  };

  const loadModalAddUser = () => {
    setOpenModal(true);
  };
  const registrarUsuario = handleSubmit(async (data: any) => {
    const datos: DataSaveUser = {
      username: data.username,
      password: data.password,
      nombresUser: data.nombreUsuario,
      apellidosUser: data.apellidoUsuario,
      emailUser: data.emailUser,
      telefonoUser: data.telefonoUser,
      statusUser: data.statusUser ? 1 : 0,
      idRol: data.idRol,
    };
    try {
      let response = null;
      if (estadosave == 1) {
        response = await saveUsuario(datos);
      } else {
        response = await updateUsuario(datos, idUpdate);
      }

      if (response) {
        handleClickClose();
        const usuarios = await GetAllUsuarios();
        setlistaUsuarios(usuarios);
        reset();
        SweetNotifySuccesss({ message: `Usuario ${data.nombreUsuario} ${data.apellidoUsuario}  registrado exitosamente` });
      } else {
        SweetNotifyError({
          message: "A ocurrido un error al cargar registrar el documento",
        });
      }
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
  });

  const loadUsuario = (data: any) => {
    setEstadoSave(0);
    handleClose(data.id);
    loadModalAddUser();
    const datos = {
      username: data.username,
      password: data.password,
      nombreUsuario: data.nombresUser,
      apellidoUsuario: data.apellidosUser,
      emailUser: data.emailUser,
      telefonoUser: data.telefonoUser,
      statusUser: data.statusUser ? 1 : 0,
      idRol: data.idRol,
    };
    setIdUpdate(data.id);
    reset(datos);
  };

  const restablecerPassword = handleSubmit(async (data: any) => {
    const datos: DataResetPassword = {
      password: data.newPassword,
      confirmPassword: data.confirmNewPassword,
    };
    if (datos.password != datos.confirmPassword) {
      setStatusPaasword(true);
      return false;
    }
    try {
      const response = await resetPassword(datos, idUpdate);
      if (response) {
        handleClickClose2();
        reset();
        SweetNotifySuccesss({ message: "Contraseña restablecida exitosamente" });
      } else {
        SweetNotifyError({
          message: "A ocurrido un error al cargar registrar el documento",
        });
      }
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
  });
  const loadModalResetPassword = (data: any) => {
    setOpenModal2(true);
    handleClose(data.id);
    setIdUpdate(data.id);
  };
  const dataColumns: GridColDef<(typeof dataRows)[number]>[] = [
    { field: "id", headerName: "ID", width: 60, valueGetter: (value, row: any) => `${zfill(row.id, 3)}` },
    {
      field: "nombresUser",
      headerName: "NOMBRES",
      width: 250,
      renderCell: (params: any) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sizes="small" alt={params.row.nombresUser} />
            {params.row.nombresUser} {params.row.apellidosUser}
        </Stack>
      ),
    },
    { field: "username", headerName: "USUARIO", width: 130 },
    { field: "emailUser", headerName: "EMAIL", width: 250 },
    { field: "telefonoUser", headerName: "TELÉFONO", width: 200 },
    { field: "nombreRol", headerName: "ROL", width: 200 },
    {
      field: "statusUser",
      headerName: "ESTADO",
      width: 200,
      renderCell: (params: any) => (
        <>
          {params.row.statusUser == 1 ? (
            <Chip label="✅ ACTIVO" size="small" color="primary" />
          ) : (
            <Chip label="INACTIVO" size="small" color="error" />
          )}
        </>
      ),
    },
    {
      field: "actions",
      headerName: "ACCIONES",
      width: 150,
      sortable: false,
      align: "center",
      renderCell: (params: any) => (
        <Box>
          <IconButton aria-label="more" aria-controls={params.row.id} aria-haspopup="true" onClick={(event) => handleClick(event, params.row.id)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            id={`menu_${params.row.id}`}
            anchorEl={menuAnchors[params.row.id]}
            open={Boolean(menuAnchors[params.row.id])}
            onClose={() => {
              handleClose(params.row.id);
            }}
          >
            <List>
              <ListItem
                component="a"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  loadUsuario(params.row);
                }}
              >
                <ListItemIcon>
                  <NoteAltIcon />
                </ListItemIcon>
                <ListItemText primary="Editar" />
              </ListItem>

              <ListItem
                component="a"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  loadModalResetPassword(params.row);
                }}
              >
                <ListItemIcon>
                  <LockResetIcon />
                </ListItemIcon>
                <ListItemText primary="Resetear Password" />
              </ListItem>
            </List>
          </Menu>
        </Box>
      ),
    },
  ];

  return (
    <PageContainer title="QA - CheckList" description="Cierre de Observaciones">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Gestión - Usuarios</Typography>
        </Stack>

        <ViewAddUser
          open={openmodal}
          onClose={handleClickClose}
          onSubmit={registrarUsuario}
          estadosave={estadosave}
          register={register}
          control={control}
          setValue={setValue}
          errors={errors}
          listaRoles={listaRoles}
        />
        <ViewResetPassword
          open={openmodal2}
          onClose={handleClickClose2}
          onSubmit={restablecerPassword}
          register={register}
          errors={errors}
          statusPaasword={statusPaasword}
        />

        <Divider sx={{ borderStyle: "revert", m: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Box
              sx={{
                overflowX: { xs: "auto", sm: "hidden" },
                overflowY: { xs: "hidden", sm: "auto" },
              }}
            >
              <DataGrid
                rows={dataRows}
                columns={dataColumns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 7 },
                  },
                }}
                pageSizeOptions={[7, 10]}
                autoHeight
                slots={{
                  toolbar: (props) => <CustomToolbar {...props} onAddClick={loadModalAddUser} label="usuario" />,
                }}
                rowHeight={80}
                disableRowSelectionOnClick
                disableColumnMenu
                sx={{
                  "& .MuiDataGrid-cell": {
                    border: "1px solid #e0e0e0",
                  },
                  "& .MuiDataGrid-row": {
                    maxHeight: "none !important",
                  },

                  "& .MuiDataGrid-columnHeader": {
                    border: "1px solid #e0e0e0",
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 1),
                    fontWeight: "bold",
                  },

                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                    color: "#fff",
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </PageContainer>
  );
}
