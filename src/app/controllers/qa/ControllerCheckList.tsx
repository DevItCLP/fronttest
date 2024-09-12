import axios, { AxiosResponse } from "axios";

const authCredentials = {
  username: process.env.NEXT_PUBLIC_USER || "",
  password: process.env.NEXT_PUBLIC_PASS || "",
};

export async function GetOpcChecklist(valueParams: any) {
  try {
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/options-checlist-params/${valueParams.value}/1`, {
      auth: authCredentials,
    });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ idOptionChecklist, nombreOpcion }: { idOptionChecklist: number; nombreOpcion: string }) => ({
        label: nombreOpcion,
        value: idOptionChecklist.toString(),
      }));
    }
  } catch (error) {
    console.error("Error de comunicacion con el servicio ", error);
  }
}

export async function _saveCheckList(payload: SaveCheckListTipe) {
  try {
    const response: AxiosResponse<ResponseSaveCheckList> | undefined = await axios.post<ResponseSaveCheckList>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/save-checklist`,
      payload,
      {
        auth: authCredentials,
      }
    );
    let resp: ResponseSaveCheckList | undefined = response.data;
    return resp;
  } catch (error) {
    console.error("Error de comunicacion con el servicio amazonas", error);
  }
}

export async function getObservacionesEncontradas(payload: any) {
  try {
    const response: AxiosResponse<ResponseObsEncontradas> | undefined = await axios.post<ResponseObsEncontradas>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/show-observaciones-params`,
      payload,
      {
        auth: authCredentials,
      }
    );
    let resp: ResponseObsEncontradas | undefined = response.data;
    return resp;
  } catch (error) {
    console.error("Error de comunicacion con el servicio amazonas", error);
  }
}

export async function closeObsChecklist(payload: PayloadCloseObseEncontradas, key: number) {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/close-obs-checklist/${key}`, payload, {
      auth: authCredentials,
    });
    let resp: ResponseCloseObseEncontradas | undefined = response.data;
    return resp;
  } catch (error) {
    console.error("Error de comunicacion con el servicio amazonas", error);
  }
}

export async function uploadImageS3(image: imageType, id: string, ruta: string) {
  try {
    const formData: FormData = new FormData();
    formData.append("image", image.blobFile);
    formData.append("ruta", `${ruta}/`);
    formData.append("id", id);
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
}

export async function getCheclist() {
  const estado: number = 2;

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/show-checklist/${estado}`, {
      auth: authCredentials,
    });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ id }: { id: number }) => ({
        label: zfill(id, 6),
        value: id.toString(),
      }));
    }
  } catch (error) {
    console.error("Error de comunicacion con el servicio ", error);
  }
}

export async function getChecklists(payload: any) {
  try {
    const response: AxiosResponse<ResponseGetChecklist> | undefined = await axios.post<ResponseGetChecklist>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/show-checklist-params`,
      payload,
      {
        auth: authCredentials,
      }
    );

    let resp: ResponseGetChecklist | undefined = response.data;
    return resp;
  } catch (error) {
    console.error("Error de comunicacion con el servicio ", error);
  }
}

export async function getCheclistById(id: number) {
  try {
    const response: AxiosResponse<ResponseObsEncontradas> | undefined = await axios.get<ResponseObsEncontradas>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/show-checklistdet-id/${id}`,
      {
        auth: authCredentials,
      }
    );
    let resp: ResponseObsEncontradas | undefined = response.data;
    return resp;
  } catch (error) {
    console.error("Error de comunicacion con el servicio ", error);
  }
}

export async function GetTipoCheckList() {
  try {
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/tipos-checklist-estado/1`, { auth: authCredentials });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ idTipoChecklist, nombreTipo }: { idTipoChecklist: number; nombreTipo: string }) => ({
        label: nombreTipo,
        value: idTipoChecklist.toString(),
      }));
    }
  } catch (error) {
    console.error("Error de comunicacion con el servicio ", error);
  }
}

export async function reasignarResponsable(id: number | undefined, payload: { userNameEjecucion: number }) {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/update-responsable/${id}`, payload, {
      auth: authCredentials,
    });
    let resp: ResponseCloseObseEncontradas | undefined = response.data;
    return resp;
  } catch (error) {
    console.error("Error de comunicacion con el servicio amazonas", error);
  }
}

const zfill = (value: any, length: number) => {
  const str = value.toString();
  return str.padStart(length, "0");
};
