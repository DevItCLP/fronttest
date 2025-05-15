interface DataSaveLugarObservacion {
    nameLugarObservacion: string;
    statusLugarObservacion: number;

  }
  interface DataUpdateLugarObservacion {
    nameLugarObservacion: string;
    statusLugarObservacion: number;

  }
  
  interface ResponseSaveLugarObservacion {
    message: string;
    status: string;
    object: {
      idUser: number;
      username: String;
    };
  }
  