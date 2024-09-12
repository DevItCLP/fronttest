import axios, { AxiosResponse } from "axios";

const authCredentials = {
  username: process.env.NEXT_PUBLIC_USER || "",
  password: process.env.NEXT_PUBLIC_PASS || "",
};

export async function uploadGenericImagesS3(images: imagesGenericType[], ruta: string) {
  images.map(async (val) => {
    try {
      const formData: FormData = new FormData();
      formData.append("image", val.imageBlobFile);
      formData.append("ruta", `${ruta}/`);
      formData.append("id", val.id);
      const headers = {
        "Content-Type": "multipart/form-data",
      };
      const { data } = await axios.post<reponseGeneric>(`${process.env.NEXT_PUBLIC_HOST_URL}/api/s3`, formData, { headers });
      //Pongo este fragmento de código temporalmente para ver si se carga la imagen y obtener la URL de la misma
      if (data.success) {
        console.log(data.message, data.data.url);
      }
    } catch (error) {
      return { error: "Error al comunicarse con s3" };
    }
  });
}

export async function uploadImagesS3(images: imagesType[], id: number, ruta: string) {
  images.map(async (val) => {
    try {
      const formData: FormData = new FormData();
      formData.append("image", val.blobFile);
      formData.append("ruta", `${ruta}/`);
      formData.append("id", id.toString());
      const headers = {
        "Content-Type": "multipart/form-data",
      };
      const { data } = await axios.post<reponseGeneric>(`${process.env.NEXT_PUBLIC_HOST_URL}/api/s3`, formData, { headers });
      //Pongo este fragmento de código temporalmente para ver si se carga la imagen y obtener la URL de la misma
      if (data.success) {
        console.log(data.message, data.data.url);
      }
    } catch (error) {
      return { error: "Error al comunicarse con s3" };
    }
  });
}

export async function saveAsclFull(payload: saveAsclType) {
  try {
    const response: AxiosResponse<reponseSaveAscl> | undefined = await axios.post<reponseSaveAscl>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/save-ascl2`,
      payload,
      { auth: authCredentials }
    );
    let res: reponseSaveAscl | undefined = response.data;
    return res;
  } catch (error) {
    console.error("Error de comunicacion con el servicio amazonas", error);
  }
}

export async function getInspPlanificadas(actividad: number) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-insp-planificadas/${actividad}`, {
      auth: authCredentials,
    });
    if (response.data) {
      const data = response.data.object;
      return data.map(({ idAscl }: { idAscl: number }) => ({
        label: zfill(idAscl, 6),
        value: idAscl.toString(),
      }));
    }
  } catch (error) {
    console.error("Error de comunicacion con el servicio ", error);
  }
}

export async function getObservacionesEncontradas(payload: any) {
  try {
    const response: AxiosResponse<ResponseObsEncontradasIp> | undefined = await axios.post<ResponseObsEncontradasIp>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-observaciones-encontradas`,
      payload,
      {
        auth: authCredentials,
      }
    );
    let resp: ResponseObsEncontradasIp | undefined = response.data;
    return resp;
  } catch (error) {
    console.error("Error de comunicacion con el servicio amazonas", error);
  }
}

export async function closeObservaciones(payload: PayloadCloseIP, key: number) {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/close-observaciones-encontradas/${key}`, payload, {
      auth: authCredentials,
    });
    let resp: ResponseCloseObseEncontradas | undefined = response.data;
    return resp;
  } catch (error) {
    console.error("Error de comunicacion con el servicio amazonas", error);
  }
}

export async function reasignarResponsable(id: number | undefined, payload: { usuarioEjecucion: number }) {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/update-responsable/${id}`, payload, {
      auth: authCredentials,
    });
    let resp: ResponseCloseObseEncontradas | undefined = response.data;
    return resp;
  } catch (error) {
    console.error("Error de comunicacion con el servicio amazonas", error);
  }
}

export async function getRecordsParams(payload: PayloadResponseSearch) {
  try {
    const response: AxiosResponse<any> = await axios.post<any>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-records-params`, payload, {
      auth: authCredentials,
    });
    let resp: any | undefined = response.data;
    return resp;
  } catch (error) {
    console.error("Error de comunicacion con el servicio amazonas", error);
  }
}

export async function viewReportAascl(id: number) {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-record-id/${id}`, { auth: authCredentials });
  let resp = response.data;
  return resp;
}

const zfill = (value: any, length: number) => {
  const str = value.toString();
  return str.padStart(length, "0");
};
