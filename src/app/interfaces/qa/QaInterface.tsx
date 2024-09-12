interface SaveCheckListTipe {
  fecha: String;
  fechaRegistro: String;
  observaciones: String;
  lugarObservacion: { idLugarObser: Number };
  estado: Number;
  responsableControl: { idUser: Number };
  datosDetalleChecklist: any;
}

interface ResponseSaveCheckList {
  message: string;
  status: string;
  object: {
    idChecklist: number;
    observaciones: String;
  };
}

interface ResponseObsEncontradas {
  message: string;
  object: ObjectData[];
}

interface ObjectData {
  id: number;
  accionInmediata: string;
  imagenObservacion: string;
  observacionEncontrada: string;
  checkOption: number;
  nombreOpcion: string;
  idChecklist: number;
  userNameControl: string;
  userNameEjecucion: string;
  estadoObservacionCierre: string;
  accionRealizadaCierre: string;
  imagenObservacionCierre: string;
  estado: number;
  fechaRegistro: string;
}

interface PayloadCloseObseEncontradas {
  id: number;
  idChecklist: number;
  estadoObservacionCierre: number;
  accionRealizadaCierre: string;
  imagenObservacionCierre: string;
}

interface ResponseCloseObseEncontradas {
  message: string;
  status: string;
}

interface OptionCheclist {
  label: string;
  value: number;
}

interface imageType {
  blobFile: File;
}

interface reponseGeneric {
  message: string;
  success: boolean;
  data: {
    url: string;
  };
}

interface ResponseGetChecklist {
  message: string;
  object: ObjectData2[];
}
interface ObjectData2 {
  id: number;
  fechaRegistro: string;
  estado: number;
  observaciones: string;
  userResponsableControl: string;
  nameLugarObservacion: string;
}
