interface DataSaveUser {
  username: string;
  password: string;
  nombresUser: string;
  apellidosUser: string;
  emailUser: string;
  telefonoUser: string;
  statusUser: number;
  idRol: number;
}
interface DataUpdateUser {
  username: string;
  nombresUser: string;
  apellidosUser: string;
  emailUser: string;
  telefonoUser: string;
  statusUser: number;
  idRol: number;
}
interface DataResetPassword {
  password: string;
  confirmPassword: string;
}

interface ResponseSaveUser {
  message: string;
  status: string;
  object: {
    idUser: number;
    username: String;
  };
}
