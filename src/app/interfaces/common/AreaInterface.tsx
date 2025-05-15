interface DataSaveArea {
    nameArea: string;
    statusArea: number;
  }
  interface DataUpdateArea {
    nameArea: string;
    statusArea: number;
  }
  
  interface ResponseSaveArea {
    message: string;
    status: string;
    object: {
      id: number;
      nameArea: String;
    };
  }
  