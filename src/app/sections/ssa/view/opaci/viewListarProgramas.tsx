/*
 * Created on Wed Apr 24 2024
 *
 * Copyright (c) 2024 CC
 * Author:  Cristian R. Paz  */

import { SelectStatusCC, SelectCC } from "@/app/components/select-option";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { DataRangeCC } from "@/app/components/date-hour";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axios from "axios";
import { GetActividadLiderazgo, GetProgramas, GetTurnos, GetLugarObs, GetProyectos, GetAreas } from "@/app/api/dataApiComponents";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { SweetNotifyWarning } from "@/app/components/sweet-notificacion";
import { DocModal } from "@/app/sections/ssa/reports/viewModal";
import { DocModalOpaci } from "@/app/sections/ssa/reports/viewModalOpaci";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { alpha } from "@mui/material/styles";

import Swal from "sweetalert2";
import { Account } from "@/app/_mock/account";
import {
  anularReportAscl,
  getObservacionesEncontradas,
  getRecordsParams,
  GetReportsOpaci,
  viewReportAascl,
} from "@/app/controllers/ssa/ControllerAscl";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { ModalViewCierre } from "../../reports/viewModalCierre";
import { useSession } from "next-auth/react";
import AppWebsiteVisits from "@/app/components/dashboard/app-website-visits";
import AppCurrentVisits from "@/app/components/dashboard/app-current-visits";
//-------------------------------------------------------------------

export default function ReportSSA() {
  type MenuState = {
    [key: string]: HTMLElement | null;
  };
  //========================LISTAS===============================================
  const [showTable, setShowTable] = useState(false);
  const [showTableOpaci, setShowTableOpaci] = useState(false);
  const [listaProgramas, setlistaProgramas] = useState<any[]>([]);
  const [listaActividades, setlistaActividades] = useState<any[]>([]);
  const [listaAreas, setlistaAreas] = useState<any[]>([]);
  const [listaProyectos, setlistaProyectos] = useState<any[]>([]);
  const [listaTurnos, setlistaTurnos] = useState<any[]>([]);
  const [listaLugarObs, setlistaLugarObs] = useState<any[]>([]);

  const [datRows, setlistaRegistros] = useState<any[]>([]);
  const [datRows1, setlistaOpaci] = useState<any[]>([]);

  const [listaGeneral, setListaGeneral] = useState<any[]>([]);
  const [listaPreguntas, setListaPreguntas] = useState<any[]>([]);
  const [listaImagenes, setListaImagenes] = useState<any[]>([]);
  //Llenar la tabla del pdf
 // const [listaOpaci, setListaOpaciRow] = useState<any[]>([]);
  const [actosList, setActosList] = useState<any[]>([]);
  const [condicionesList, setCondicionesList] = useState<any[]>([]);
  
  //Abrir los diferentes modales
  const [openOpaci, setOpenOpaci] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [listaDataReporte, setListaDataReporte] = useState<any[]>([]);
  //Es del chartreportOpaci(barras/circulo)
  const [listaGeneralOpaci, setListaGeneralOpaci] = useState<any>();
  const [listaGeneralOpaciCircle, setListaGeneralOpaciCircle] = useState<any>();
  const [listaGeneralDCIOpaciCircle, setListaGeneraDCIOpaciCircle] = useState<any>();
  const [listaGeneralDAIOpaciCircle, setListaGeneraDAIOpaciCircle] = useState<any>();
  const [selectActividad, setSelectActividad] = useState<any>();

  //====================CONSTANTES GLOBALES=====================================
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenOpaci = () => setOpenOpaci(true);
  const handleCloseOpaci = () => setOpenOpaci(false);

  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  const [menuAnchors, setMenuAnchors] = useState<MenuState>({});

  const handleClickBtn = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setMenuAnchors((prev) => ({ ...prev, [id]: event.currentTarget }));
  };
  const handleCloseBtn = (id: number) => {
    setMenuAnchors((prev) => ({ ...prev, [id]: null }));
  };

  const authCredentials = {
    username: process.env.NEXT_PUBLIC_USER || "",
    password: process.env.NEXT_PUBLIC_PASS || "",
  };
  const account = Account();
  const { status } = useSession();
  const {
    control,
    setValue,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  //============================FUNCIONES============================================
  useEffect(() => {
    if (status === "authenticated") {
      loadDataApi();
    }
  }, [status, account.token]);

  async function loadDataApi() {
    const areas = await GetAreas(account.token);
    const lugares = await GetLugarObs(account.token);
    const turnos = await GetTurnos(account.token);
    const proyectos = await GetProyectos(account.token);
    const programas = await GetProgramas(account.token);
    const actividad = await GetActividadLiderazgo(account.token);

    setlistaAreas(areas);
    setlistaProyectos(proyectos);
    setlistaTurnos(turnos);
    setlistaLugarObs(lugares);
    setlistaProgramas(programas);
    setlistaActividades(actividad);
  }

  type DataItem = {
    total: number;
    check_option: "D.A.I" | "D.C.I";
    status_acsl_det: number;
    fechaMes: string;
  };

  const getRegistros = handleSubmit(async (data: any) => {
    let datos: any = {};
    if (data.actividad != undefined) {
      datos.acslGeneralAct = data.actividad;
    }
    if (data.area != undefined) {
      datos.area = data.area;
    }
    if (data.estado != undefined) {
      datos.statusAscl = data.estado;
    }
    if (data.lugobservacion != undefined) {
      datos.lugarObservacion = data.lugobservacion;
    }
    if (data.proyecto != undefined) {
      datos.proyecto = data.proyecto;
    }
    if (data.turno != undefined) {
      datos.turno = data.turno;
    }
    if (data.fechas) {
      datos.fDesde = data.fechas[0];
      datos.fHasta = data.fechas[1];
    }
    setSelectActividad(datos.acslGeneralAct);
    //console.log(datos);
    const response = await getRecordsParams(datos, account.token);
    const resp = await GetReportsOpaci(datos, account.token);

    //console.log("lista Opaci ----",listaOpaci)

    if (response?.status === "success") {
      setShowTable(true);
      setShowTableOpaci(false);
      const listaData = response?.object;
      setlistaRegistros(listaData);

      const totalRegistroOpaci = getReportsOpaciForBarDiagram(resp);
      setListaGeneralOpaci(totalRegistroOpaci);
      const totaRegsitroOpaciCircle = getReportsOpaciForBarDiagramCircle(resp);
      const totalDCIDiagramCircle = getAllDCIOpaciForDiagramCircle(resp);
      const totalDAIDiagramCircle = getAllDAIOpaciForDiagramCircle(resp);
      setListaGeneraDCIOpaciCircle(totalDCIDiagramCircle);
      setListaGeneraDAIOpaciCircle(totalDAIDiagramCircle);

      setListaGeneralOpaciCircle(totaRegsitroOpaciCircle);
      //console.log("respuestDataAPI--->>>", resp);
      //setListaOpaciRow(transformDataToRows(resp));
      //setlistaOpaci(transformDataToRows(resp));
      
      if(data.fechas){
        const { actosResult, condicionesResult } = getActosCondicionesRows(resp);
        setActosList(actosResult);
        setCondicionesList(condicionesResult);
        setShowTableOpaci(true);
      }

    } else {
      setShowTable(false);
      SweetNotifyWarning({
        message: response?.message,
      });
    }
  });

  //FUNCION PARA LLENAR DIAGRAMA DE BARRAS
  const getReportsOpaciForBarDiagram = (data: DataItem[]) => {
    const groupedData: Record<string, { DAI: number; DCI: number }> = {};

    data.forEach(({ total, check_option, fechaMes }) => {
      if (!groupedData[fechaMes]) {
        groupedData[fechaMes] = { DAI: 0, DCI: 0 };
      }
      if (check_option === "D.A.I") {
        groupedData[fechaMes].DAI += total;
      } else if (check_option === "D.C.I") {
        groupedData[fechaMes].DCI += total;
      }
    });

    return {
      labels: Object.keys(groupedData), // Fechas
      series: [
        {
          name: "Actos", // D.A.I
          type: "column",
          fill: "solid",
          data: Object.keys(groupedData).map((fechaMes) => groupedData[fechaMes].DAI),
          color: "rgba(54, 162, 235, 0.7)",
        },
        {
          name: "Condiciones", // D.C.I
          type: "column",
          fill: "solid",
          data: Object.keys(groupedData).map((fechaMes) => groupedData[fechaMes].DCI),
          color: "rgb(248, 153, 168)",
        },
      ],
    };
  };

  const zfill = (value: any, length: number) => {
    const str = value.toString();
    return str.padStart(length, "0");
  };

  //fUNCION pARA LLENAR GRAFICA CIRCULAR
  const getReportsOpaciForBarDiagramCircle = (data: DataItem[]) => {
    if (!data || data.length === 0) return null;

    // Usamos reduce() para calcular los totales de "D.C.I" y "D.A.I"
    const totals = data.reduce(
      (acc, item) => {
        if (item.check_option === "D.A.I") acc.acto += item.total;
        if (item.check_option === "D.C.I") acc.condicion += item.total;
        return acc;
      },
      { acto: 0, condicion: 0 }
    );

    return {
      series: [
        { label: "Acto", value: totals.acto },
        {
          label: "Condición",
          value: totals.condicion,
        },
      ],
      colors: ["rgba(54, 162, 235, 0.7)", "rgba(255, 99, 132,1)"],
    };
  };

  //DCI
  const getAllDCIOpaciForDiagramCircle = (data: DataItem[]) => {
    if (!data || data.length === 0) {
      return null;
    }
    const total = data.reduce(
      (acc, item) => {
        if (item.check_option === "D.C.I") {
          if (item.status_acsl_det === 0) acc.pendiente += item.total;
          if (item.status_acsl_det === 1) acc.en_proceso += item.total;
          if (item.status_acsl_det === 2) acc.cerrado += item.total;
          if (item.status_acsl_det === 3) acc.gestionado += item.total;
        }
        return acc;
      },
      { pendiente: 0, en_proceso: 0, cerrado: 0, gestionado: 0 }
    );

    return {
      series: [
        {
          label: "Pendiente",
          value: total.pendiente,
        },
        {
          label: "En Proceso",
          value: total.en_proceso,
        },
        {
          label: "Cerrado",
          value: total.cerrado,
        },
        {
          label: "Gestionado",
          value: total.gestionado,
        },
      ],
      colors: ["rgb(248, 153, 168)", "rgba(54, 162, 235, 0.7)", "rgba(90, 211, 96, 0.7)", "rgba(23, 165, 137, 0.7)"],
    };
  };

  //DAI
  const getAllDAIOpaciForDiagramCircle = (data: DataItem[]) => {
    if (!data || data.length === 0) {
      return null;
    }
    const total = data.reduce(
      (acc, item) => {
        if (item.check_option === "D.A.I") {
          if (item.status_acsl_det === 0) acc.pendiente += item.total;
          if (item.status_acsl_det === 1) acc.en_proceso += item.total;
          if (item.status_acsl_det === 2) acc.cerrado += item.total;
          if (item.status_acsl_det === 3) acc.gestionado += item.total;
        }
        return acc;
      },
      { pendiente: 0, en_proceso: 0, cerrado: 0, gestionado: 0 }
    );
    return {
      series: [
        {
          label: "Pendiente",
          value: total.pendiente,
        },
        {
          label: "En Proceso",
          value: total.en_proceso,
        },
        {
          label: "Cerrado",
          value: total.cerrado,
        },
        {
          label: "Gestionado",
          value: total.gestionado,
        },
      ],
      colors: ["rgb(248, 153, 168)", "rgba(54, 162, 235, 0.7)", "rgba(90, 211, 96, 0.7)", "rgba(23, 165, 137, 0.7)"],
    };
  };


  //LLENAR TABLA PDF
  interface ActosInterface {
    id: number;
    acto: number;
    fechaMes: string;
    totalProceso?: number;
    totalPendiente?: number;
    totalGestionado?: number;
    porcentajeGestionado?: number;
    
  }

  interface CondicionesInterface {
    id: number;
    condicion: number;
    fechaMes: string;
    totalProceso?: number;
    totalPendiente?: number;
    totalGestionado?: number;
    porcentajeGestionado?: number;
  }

  const getActosCondicionesRows = (
    data: any[]
  ): {
    actosResult: ActosInterface[];
    condicionesResult: CondicionesInterface[];
  } => {
    // Agrupar por mes y status_acsl_det

    const actosGroupedData: Record<string, ActosInterface> = {};

    const condicionesGroupedData: Record<string, CondicionesInterface> = {};

    const mesesMap: Record<string, string> = {
      "01": "Enero",
      "02": "Febrero",
      "03": "Marzo",
      "04": "Abril",
      "05": "Mayo",
      "06": "Junio",
      "07": "Julio",
      "08": "Agosto",
      "09": "Septiembre",
      "10": "Octubre",
      "11": "Noviembre",
      "12": "Diciembre",
    };
    let totalActo = 0;
    let totalCondicion = 0;
    // const actosInseguros = data.filter(item => item.check_option = "D.A.I")

    data.forEach((item) => {
      const [year, mesNumero] = item.fechaMes.split("-"); // Extraemos solo el "YYYY-MM"
      const fechaMes = `${mesesMap[mesNumero]} ${year}`; // Convertimos el número a nombre del mes

      const total = item.total || 0;
      const checkOption = item.check_option;
      const status = item.status_acsl_det || 0;

      // Inicializamos la estructura si no existe
      if (!actosGroupedData[fechaMes]) {
        actosGroupedData[fechaMes] = {
          acto: 0,
          totalPendiente: 0,
          totalProceso: 0,
          totalGestionado: 0,
          porcentajeGestionado: 0,
        } as ActosInterface;
      }

      if (!condicionesGroupedData[fechaMes]) {
        condicionesGroupedData[fechaMes] = {
          condicion: 0,
          totalPendiente: 0,
          totalProceso: 0,
          totalGestionado: 0,
          porcentajeGestionado: 0,
        } as CondicionesInterface;
      }

      if (checkOption === "D.A.I") {
        totalActo += total;
        actosGroupedData[fechaMes].acto += total;
        actosGroupedData[fechaMes].totalPendiente += status === 0 ? total : 0;
        actosGroupedData[fechaMes].totalProceso += status === 1 ? total : 0;
        actosGroupedData[fechaMes].totalGestionado += status === 2 ? total : 0;
        //actosGroupedData[fechaMes].porcentajeGestionado = `${((actosGroupedData[fechaMes].totalGestionado || 0) / actosGroupedData[fechaMes].acto) * 100} %`;
        actosGroupedData[fechaMes].porcentajeGestionado = +(((actosGroupedData[fechaMes].totalGestionado || 0) / (actosGroupedData[fechaMes].acto || 1)) * 100).toFixed(2);
        

      } else if (checkOption === "D.C.I") {
        totalCondicion += total;
        condicionesGroupedData[fechaMes].condicion += total;
        condicionesGroupedData[fechaMes].totalPendiente += status === 0 ? total : 0;
        condicionesGroupedData[fechaMes].totalProceso += status === 1 ? total : 0;
        condicionesGroupedData[fechaMes].totalGestionado += status === 2 ? total : 0;
        //condicionesGroupedData[fechaMes].porcentajeGestionado = `${((condicionesGroupedData[fechaMes].totalGestionado || 0) / condicionesGroupedData[fechaMes].condicion) * 100} %`;
        condicionesGroupedData[fechaMes].porcentajeGestionado = +(((condicionesGroupedData[fechaMes].totalGestionado || 0) / (condicionesGroupedData[fechaMes].condicion || 1)) * 100).toFixed(2);

      }
    });
    // Convertimos el objeto agrupado en un array para la presentación
    const actosResult: ActosInterface[] = [];
    const condicionesResult: CondicionesInterface[] = [];
    let idCounter = 1;

    Object.keys(actosGroupedData).forEach((fechaMes) => {
      actosResult.push({
        id: idCounter++,
        fechaMes,
        acto: actosGroupedData[fechaMes].acto,
        totalPendiente: actosGroupedData[fechaMes].totalPendiente,
        totalProceso: actosGroupedData[fechaMes].totalProceso,
        totalGestionado: actosGroupedData[fechaMes].totalGestionado,
        porcentajeGestionado: actosGroupedData[fechaMes].porcentajeGestionado,
      });
    });

    Object.keys(condicionesGroupedData).forEach((fechaMes) => {
      condicionesResult.push({
        id: idCounter++,
        fechaMes,
        condicion: condicionesGroupedData[fechaMes].condicion,
        totalPendiente: condicionesGroupedData[fechaMes].totalPendiente,
        totalProceso: condicionesGroupedData[fechaMes].totalProceso,
        totalGestionado: condicionesGroupedData[fechaMes].totalGestionado,
        porcentajeGestionado: condicionesGroupedData[fechaMes].porcentajeGestionado,
      });
    });

    actosResult.push({
      id: idCounter++,
      fechaMes: "Total Actos",
      acto: totalActo,
      //totalPendiente: 0,
      //totalProceso: 0,
      //totalGestionado: 0
    });

    condicionesResult.push({
      id: idCounter++,
      fechaMes: "Total Condiciones",
      condicion: totalCondicion,
      //totalPendiente: 0,
      //totalProceso: 0,
      //totalGestionado: 0
    });

    return { actosResult, condicionesResult };
  };

  const dataColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      renderCell: (params) => <>{zfill(params.value, 5)}</>,
    },
    {
      field: "acslGeneralActividad",
      headerName: "ACTIVIDAD LIDERAZGO",
      width: 350,
      renderCell: (params) => (
        <>
          <Box
            sx={{
              backgroundColor: params.row.colorActividad,
              padding: "8px",
              borderRadius: "5px",
              width: "100%",
            }}
          >
            <Typography>{params.value}</Typography>
          </Box>
        </>
      ),
    },
    { field: "fecha", headerName: "FECHA", width: 170 },
    { field: "area", headerName: "ÁREA", width: 200 },
    {
      field: "lugarObservacion",
      headerName: "LUGAR OBSERVACIÓN",
      width: 250,
    },
    { field: "turno", headerName: "TURNO", width: 120 },
    { field: "duracion", headerName: "DURACIÓN", width: 120 },

    {
      field: "actions",
      headerName: "ACCIONES",
      width: 200,
      sortable: false,
      renderCell: (params: any) => (
        <Box>
          <Tooltip title="Más opciones">
            <IconButton aria-label="more" onClick={(event) => handleClickBtn(event, params.row.id)}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>

          {params.row.statusAscl == 2 && (
            <Menu
              id={`menu_${params.row.id}`}
              anchorEl={menuAnchors[params.row.id]}
              open={Boolean(menuAnchors[params.row.id])}
              onClose={() => handleCloseBtn(params.row.id)}
            >
              <MenuItem onClick={() => viewReporte(params.row.id)}>
                <ListItemIcon>
                  <RemoveRedEyeIcon />
                </ListItemIcon>
                <ListItemText primary="Reporte ASCL" />
              </MenuItem>
              <MenuItem onClick={() => viewReportObsCierre(params.row.id)}>
                <ListItemIcon>
                  <NoteAltIcon />
                </ListItemIcon>
                <ListItemText primary="Cierre de Observaciones" />
              </MenuItem>

              {(account.role === "root" || account.role === "admin") && (
                <MenuItem onClick={() => anularReport(params.row.id)}>
                  <ListItemIcon>
                    <DeleteSweepIcon />
                  </ListItemIcon>
                  <ListItemText primary="Anular Registro" />
                </MenuItem>
              )}
            </Menu>
          )}
          {params.row.statusAscl == 0 && (
            <Menu
              id={`menu_${params.row.id}`}
              anchorEl={menuAnchors[params.row.id]}
              open={Boolean(menuAnchors[params.row.id])}
              onClose={() => handleCloseBtn(params.row.id)}
            >
              <MenuItem onClick={() => viewReporte(params.row.id)}>
                <ListItemIcon>
                  <NoteAltIcon />
                </ListItemIcon>
                <ListItemText primary="Reporte ASCL" />
              </MenuItem>
            </Menu>
          )}
        </Box>
      ),
    },
  ];

  const dataColumnsActos = (
    opaci: string,
    tituloOpaci: string
  ): GridColDef[] => [
    {
      field: "fechaMes",
      headerName: "FECHA/MESES",
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: opaci,
      headerName: tituloOpaci,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalPendiente",
      headerName: "PENDIENTES",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "totalProceso",
      headerName: "EN PROCESO",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "totalGestionado",
      headerName: "GESTIONADOS",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "porcentajeGestionado",
      headerName: "% GESTIONADO",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];

  const viewReporte = async (id: number) => {
    handleCloseBtn(id);
    const response = await viewReportAascl(id, account.token);
    if (response.status == "success") {
      const { listaDataGeneral, listaDataPreguntas, listaDataImages } = response.object;
      setListaGeneral(listaDataGeneral);
      setListaPreguntas(listaDataPreguntas);
      setListaImagenes(listaDataImages);
      //setlistaOpaci(listaOpaci);
      handleOpen();
    }
  };

  async function viewReportObsCierre(id: any) {
    handleCloseBtn(id);
    handleOpen2();
    const datos = {
      idAscl: id,
    };
    try {
      const response: ResponseObsEncontradasIp | undefined = await getObservacionesEncontradas(datos, account.token);
      setListaDataReporte(response?.object ? response?.object : []);
      //console.log("response", response);
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }
  }

  async function anularReport(id: any) {
    handleCloseBtn(id);

    try {
      await anularReportAscl(id, account.token);
    } catch (error) {
      console.error("Error de comunicacion con el servicio amazonas", error);
    }

    /*  Swal.fire({
      title: "Atención?",
      html: "<h5>Esta seguro que desea anular el documento?</h5>",
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `Cancelar`,
      icon: "question",
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        let response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/anular-doc/${id}`, "", { auth: authCredentials });
        if (response.data.status == "success") {
          Swal.fire("OK", response.data.message, "success");
        }
      }
    }); */
  }

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
          <DialogContent dividers>
            <DocModal listaGeneral={listaGeneral} listaPreguntas={listaPreguntas} listaImagenes={listaImagenes} />
          </DialogContent>
        </Dialog>
      </Modal>

      <Modal open={openOpaci} onClose={handleCloseOpaci}>
        <Dialog open={openOpaci} onClose={handleCloseOpaci} maxWidth="lg" fullWidth>
          <DialogContent dividers>
            <DocModalOpaci
              listaOpaci={actosList}
              listaOpaciCond={condicionesList}
              //carga grafica pdf
              listaGeneralOpaciCircle={listaGeneralOpaciCircle}
              listaGeneralOpaci={listaGeneralOpaci}
              listaGeneralDAIOpaciCircle={listaGeneralDAIOpaciCircle}
              listaGeneralDCIOpaciCircle={listaGeneralDCIOpaciCircle}
            />
          </DialogContent>
        </Dialog>
      </Modal>

      <ModalViewCierre open={open2} handleClose={handleClose2} listaDataReporte={listaDataReporte} />

      <Box my={3} component="form" onSubmit={getRegistros}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={2} lg={2}>
            <SelectCC
              _control={control}
              _setValue={setValue}
              label=" Actividad de liderazgo"
              name="actividad"
              size="small"
              required={false}
              errors={errors}
              listaData={listaActividades}
            />
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
            <DataRangeCC _setValue={setValue} label=" date" icon={<CalendarMonthIcon />} name="fechas" />
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
            <SelectCC
              _control={control}
              _setValue={setValue}
              label=" Proyecto"
              name="proyecto"
              size="small"
              required={false}
              errors={errors}
              listaData={listaProyectos}
            />
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
            <SelectCC
              _control={control}
              _setValue={setValue}
              label=" Área"
              name="area"
              size="small"
              required={false}
              errors={errors}
              listaData={listaAreas}
            />
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
            <SelectCC
              _control={control}
              _setValue={setValue}
              label=" Turno"
              name="turno"
              size="small"
              required={false}
              errors={errors}
              listaData={listaTurnos}
            />
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
            <SelectCC
              _control={control}
              _setValue={setValue}
              label=" Lugar de Observación"
              name="lugobservacion"
              size="small"
              required={false}
              errors={errors}
              listaData={listaLugarObs}
            />
          </Grid>

          <Grid item xs={12} md={2} lg={2}>
            <SelectStatusCC register={register} label=" Estado" name="estado" size="small" required={false} errors={errors} />
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
            <Button type="submit" variant="contained" color="primary">
              <ManageSearchIcon />
               Generar Reporte
            </Button>
          </Grid>
        </Grid>
      </Box>
      <hr />
      {showTable && (
        <Box
          sx={{
            overflowX: { xs: "auto", sm: "hidden" },
            overflowY: { xs: "hidden", sm: "auto" },
          }}
        >
          <DataGrid
            rows={datRows}
            columns={dataColumns}
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
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 7 },
              },
            }}
            pageSizeOptions={[7, 10]}
            autoHeight
            slots={{ toolbar: GridToolbar }}
          />

          <hr />
          {showTableOpaci && (
            <>
             <Grid>
             <span
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  display: "block",
                }}
              >
                ACTOS INSEGUROS
              </span>
              <Button
                onClick={handleOpenOpaci}
                variant="contained"
                color="primary"
              >
                <PictureAsPdfIcon />
                EXPORTAR PDF
              </Button>
              <p />
              <DataGrid
                rows={actosList}
                columns={dataColumnsActos("acto", "TOTAL ACTOS REPORTADOS")}
                autoHeight
                slots={{ toolbar: GridToolbar }}
              />
              <span
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  display: "block",
                }}
              >
                CONDICIONES INSEGURAS
              </span>
              <DataGrid
                rows={condicionesList}
                columns={dataColumnsActos(
                  "condicion",
                  "TOTAL CONDICIONES REPORTADOS"
                )}
                autoHeight
                slots={{ toolbar: GridToolbar }}
              />
             </Grid>

              <hr />
              <Box mt={2} display={"flex"} justifyContent={"center"} justifyItems={"center"}>
                <Grid container spacing={8} justifyContent={"center"}>
                  <Divider sx={{ borderStyle: "revert", m: 4, width: "100%" }} />
                  <Grid item xs={12} md={6} lg={6}>
                    <AppWebsiteVisits title="" chart={listaGeneralOpaci} subheader="GRÁFICO DE ACTOS Y CONDICIONES INSEGURAS POR DÍA" />
                  </Grid>

                  <Grid item xs={12} md={6} lg={4}>
                    <AppCurrentVisits title="" chart={listaGeneralOpaciCircle} subheader="GRÁFICO DE TOTALES EN ACTOS Y CONDICIONES INSEGURAS" />
                  </Grid>
                </Grid>
              </Box>
              <Box mt={2} display={"flex"} justifyContent={"center"} justifyItems={"center"}>
                <Grid container spacing={8} justifyContent={"center"}>
                  <Divider sx={{ borderStyle: "revert", m: 4, width: "100%" }} />
                  <Grid item xs={12} md={6} lg={4}>
                    {/*   <SalesOverview /> */}
                    <AppCurrentVisits title="" chart={listaGeneralDAIOpaciCircle} subheader="GRÁFICO RESUMEN DE ACTOS" />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    {/*   <SalesOverview /> */}
                    <AppCurrentVisits title="" chart={listaGeneralDCIOpaciCircle} subheader="GRÁFICO RESUMEN DE CONDICIONES" />
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
}
