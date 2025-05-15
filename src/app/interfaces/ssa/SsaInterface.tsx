interface imagesType {
  blobFile: File;
}
interface imagesGenericType {
  imageBlobFile: File;
  id: string;
}

interface saveAsclType {
  area: { idArea: number };
  acslGeneralAct: { idListActLiderazgo: number };
  programa: { idPrograma: number };
  proyecto: { idProyecto: number };
  turno: { idTurno: number };
  usuarios: { idUser: number };
  fecha: string;
  statusAscl: number;
  lugarObservacion: { idLugarObser: number };

  tema?: string;
  duracion?: string;
  desarrolloInteraccion?: string;
  nroParticipantes?: number;
  areaEspecifica?: string;
}
interface _saveAsclType {
  area: { idArea: number };
  acslGeneralAct: { idListActLiderazgo: number };
  programa: { idPrograma: number };
  proyecto: { idProyecto: number };
  turno: { idTurno: number };
  usuarios: { idUser: number };
  fecha: string;
  statusAscl: number;
  lugarObservacion: { idLugarObser: number };

  tema?: string;
  duracion?: string;
  desarrolloInteraccion?: string;
  nroParticipantes?: number;
  areaEspecifica?: string;

  datosAsclDetalle: any;
  datosAllMedia: any;
}

interface reponseSaveAscl {
  object: {
    areaEspecifica: string;
    duracion: string;
    idAscl: number;
    nroParticipantes: string;
    statusAscl: number;
  };
}

interface responseMedia {
  object: {
    idMedia: number;
    statusMedia: number;
  };
}

interface reponseGeneric {
  message: string;
  success: boolean;
  data: {
    url: string;
  };
}

interface ResponseObsEncontradasIp {
  message: string;
  object: ObjectDataIp[];
}

interface ObjectDataIp {
  id: number;
  checkOption: string;
  comentarios: string;
  statusAcslDet: number;
  imageObservacion: string;
  descripcionObservacion: string;
  accionObservacion: string;
  usuarioControl: string;
  usuarioEjecucion: string;
  idAscl: number;
  accionRealizadaCierre: string;
  imagenAccionRealizadaCierre: string;
}

interface PayloadCloseIP {
  id: number;
  idAscl: number;
  statusAcslDet: number;
  accionRealizadaCierre: string;
  imagenAccionRealizadaCierre: string;
}
interface PayloadCloseOPACI {
  idObservacion: number;
  statusAcslDet: number;
  accionRealizadaCierre: string;
  imagenAccionRealizadaCierre: string;
}

interface PayloadResponseSearch {
  acslGeneralAct: number;
  area: number;
  statusAscl: number;
  lugarObservacion: number;
  proyecto: number;
  turno: number;
  fDesde: string;
  fHasta: string;
}

interface PayloadEmail {
  email: string;
  subject: string;
  name: string;
  proceso: string;
  creado_por?: string;
}

interface ResultadoEmail {
  name: string;
  email: string;
}

interface ResponseDataGeneric {
  message: string;
  object: ObjectDataUserOpaci[];
}

interface ObjectDataUserOpaci {
  id: number;
  usuario: String;
  cantidad: number;
}

interface ResponseDataCat {
  message: string;
  object: CategoriaOption[];
}

interface CategoriaOption {
  idCategoria: number;
  nombreCategoria: String;
}
