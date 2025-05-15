import { Account } from "@/app/_mock/account";
import { GetAreas, GetLugarObs } from "@/app/api/dataApiComponents";
import PageContainer from "@/app/components/container/PageContainer";
import {
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LockResetIcon from "@mui/icons-material/LockReset";
import { CustomToolbar } from "@/app/components/CustomToolbar";

import { SweetNotifyError, SweetNotifySuccesss } from "@/app/components/sweet-notificacion";
import { alpha } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { ViewAddLugarObs }  from "../lugarObservacion/viewAddLugarObservacion";
import { saveLugarObservacion, updateLugarObservacion } from "@/app/controllers/common/ControllerLugarObservacion";

export default function AreasView() {
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
  const [dataRows, setlistaAreas] = useState<ObjectData[]>([]);
  const [menuAnchors, setMenuAnchors] = useState<MenuState>({});
  const [openmodal, setOpenModal] = useState(false);
  const [openmodal2, setOpenModal2] = useState(false);
  const [estadosave, setEstadoSave] = useState<number>(1);
  const [idUpdate, setIdUpdate] = useState<number | null>(null);

  /*-------------------DATOS DE INICIO DE SESION Y CONSTANTES GLOBALES --------------------------------*/

  const defaulValues = {
    nameLugarObservacion: "",
    statusLugarObservacion: 1,
  };
 
  const account = Account();
  const { status } = useSession();

  /*------------------------------FUNCIONES------------------------------------------*/

  useEffect(() => {
    if (status === "authenticated") {
      getAllLugarObservacion();
    }
  }, [status, account.token]);

  const zfill = (value: any, length: number) => {
    const str = value.toString();
    return str.padStart(length, "0");
  };
  async function getAllLugarObservacion() {
    const lugarObservacion = await GetLugarObs(account.token);
    setlistaAreas(lugarObservacion);
    //console.log("lugarObserv------>",lugarObservacion)
  }

  const handleClickClose = () => {
    reset(defaulValues); //LIMPIO EL FORMULARIO
    setEstadoSave(1); //LE DIGO QUE SE PONGA EN ESTADO PARA GUARDAR
    setIdUpdate(null); //ENCERO EL ID QUE LO ALMACENO PARA UN UPDATE
    setOpenModal(false); //CAMBIO EL ESTADO DEL MODAL A FALSE (CERRADO)
  };
  const handleClickClose2 = () => {
    setIdUpdate(null); //ENCERO EL ID QUE LO ALMACENO PARA EL UPDATE DE PASSWORD
    setOpenModal2(false); //CAMBIO EL ESTADO DEL MODAL A FALSE (CERRADO)
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setMenuAnchors((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  const handleClose = (id: string) => {
    setMenuAnchors((prev) => ({ ...prev, [id]: null }));
  };

  const loadModalAddLugarObservacion = () => {
    setOpenModal(true);
  };
  const registrarLugarObservacion = handleSubmit(async (data: any) => {
    const datos: DataSaveLugarObservacion = {
      nameLugarObservacion: data.nameLugarObservacion,
      statusLugarObservacion: data.statusLugarObservacion ? 1 : 0,
    };
    try {
      let response = null;
      let txtMsg = "";
      if (estadosave == 1) {
        response = await saveLugarObservacion(datos, account.token);
        txtMsg = "registrado exitosamente";
      } else {
        response = await updateLugarObservacion(datos, idUpdate, account.token);
        txtMsg = "actualizado exitosamente";
      }

      if (response) {
        handleClickClose();
        const lugarObservacion = await GetLugarObs(account.token);
        setlistaAreas(lugarObservacion);
        reset();
        SweetNotifySuccesss({ message: `Usuario ${data.nameArea} ${txtMsg}` });
      } else {
        SweetNotifyError({
          message: "A ocurrido un error al cargar registrar el documento",
        });
      }
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
  });

  const loadModalLugarObs = (data: any) => {
    setEstadoSave(0);
    handleClose(data.id);
    loadModalAddLugarObservacion();
    const datos = {
      nameLugarObservacion: data.nameLugarObservacion,
      statusLugarObservacion: data.statusLugarObservacion ? 1 : 0,
    };
    setIdUpdate(data.id);
    //console.log("sdsdsdsd",data.id)
    reset(datos);
  };

  const dataColumns: GridColDef<(typeof dataRows)[number]>[] = [
    { field: "id", display: 'flex', headerName: "ID", width: 150, valueGetter: (value, row: any) => `${zfill(row.id, 3)}` },
    
    { field: "nameLugarObservacion", display: 'flex',  headerName: "LUGAR OBSERVACIÓN", width: 500 },
    {
      field: "statusLugarObservacion",
      headerName: "ESTADO",
      width: 400,
      display: 'flex',
      renderCell: (params: any) => (
        <>
          {params.row.statusLugarObservacion == 1 ? (
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
      width: 400,
      sortable: false,
      align: "center",
      display: 'flex',
      renderCell: (params: any) => (
        <Box>
          <Tooltip title="Más opciones">
            <IconButton aria-label="more" aria-controls={params.row.id} aria-haspopup="true" onClick={(event) => handleClick(event, params.row.id)}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>

          <Menu
            id={`menu_${params.row.id}`}
            anchorEl={menuAnchors[params.row.id]}
            open={Boolean(menuAnchors[params.row.id])}
            onClose={() => handleClose(params.row.id)}
          >
            <MenuItem onClick={() => loadModalLugarObs(params.row)}>
              <ListItemIcon>
                <NoteAltIcon />
              </ListItemIcon>
              <ListItemText primary="Editar" />
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  return (
    <PageContainer title="Lugar Observación - Gestión" description="Gestión de Lugar de observación">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Gestión - Lugar Observación</Typography>
        </Stack>

        <ViewAddLugarObs
          open={openmodal}
          onClose={handleClickClose}
          onSubmit={registrarLugarObservacion}
          estadosave={estadosave}
          register={register}
          control={control}
          setValue={setValue}
          errors={errors}
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
                  toolbar: (props) => <CustomToolbar {...props} onAddClick={loadModalAddLugarObservacion} label="Lugar Observación" />,
                }}
                rowHeight={80}
                disableRowSelectionOnClick
                disableColumnMenu
                sx={{
                  "& .MuiDataGrid-row": {
                    maxHeight: "none !important",
                  },

                  "& .MuiDataGrid-columnHeader": {
                    border: "1px solid #e0e0e0",
                    bgcolor: (theme) => alpha(theme.palette.grey[400], 1),
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
