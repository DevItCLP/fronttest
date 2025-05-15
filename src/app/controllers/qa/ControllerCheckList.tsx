import axios, { AxiosResponse } from "axios";
import { handleApiError } from "../common/ControllerCommon";
import Swal from "sweetalert2";

/* const authCredentials = {
  username: process.env.NEXT_PUBLIC_USER || "",
  password: process.env.NEXT_PUBLIC_PASS || "",
}; */

export async function GetOpcChecklist(valueParams: any, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/options-checlist-params/${valueParams.value}/1`,
      {
        headers,
      }
    );
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(
        ({
          idOptionChecklist,
          nombreOpcion,
          idCategoria,
          nombreCategoria,
        }: {
          idOptionChecklist: number;
          nombreOpcion: string;
          idCategoria: number;
          nombreCategoria: string;
        }) => ({
          label: nombreOpcion,
          value: idOptionChecklist.toString(),
          idCategoria: idCategoria,
          nombreCategoria: nombreCategoria,
        })
      );
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function _saveCheckList(
  payload: SaveCheckListTipe,
  token: String
) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response: AxiosResponse<ResponseSaveCheckList> | undefined =
      await axios.post<ResponseSaveCheckList>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/save-checklist`,
        payload,
        {
          headers,
        }
      );
    let resp: ResponseSaveCheckList | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function getObservacionesEncontradas(payload: any, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response: AxiosResponse<ResponseObsEncontradas> | undefined =
      await axios.post<ResponseObsEncontradas>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/show-observaciones-params`,
        payload,
        {
          headers,
        }
      );
    let resp: ResponseObsEncontradas | undefined = response.data;
    //console.log("sdsdsadas", resp);
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function closeObsChecklist(
  payload: PayloadCloseObseEncontradas,
  key: number,
  token: String
) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/close-obs-checklist/${key}`,
      payload,
      {
        headers,
      }
    );
    let resp: ResponseCloseObseEncontradas | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function closeChecklist(
  payload: PayloadCloseObseEncontradas,
  id: number,
  token: String
) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/close-checklist/${id}`,
      payload,
      {
        headers,
      }
    );
    let resp: ResponseCloseObseEncontradas | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error);
  }
}

export async function uploadImageS3(
  image: imageType,
  id: string,
  ruta: string
) {
  try {
    const formData: FormData = new FormData();
    formData.append("image", image.blobFile);
    formData.append("ruta", `${ruta}/`);
    formData.append("id", id);
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const { data } = await axios.post<reponseGeneric>(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/s3`,
      formData,
      { headers }
    );
    //Pongo este fragmento de código temporalmente para ver si se carga la imagen y obtener la URL de la misma
    if (data.success) {
      console.log(data.message, data.data.url);
    }
  } catch (error) {
    return { error: "Error al comunicarse con s3" };
  }
}

export async function getCheclist(token: String) {
  const estado: number = 2;

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/show-checklist/${estado}`,
      {
        headers,
      }
    );
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ id }: { id: number }) => ({
        label: zfill(id, 6),
        value: id.toString(),
      }));
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function getChecklists(payload: any, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response: AxiosResponse<ResponseGetChecklist> | undefined =
      await axios.post<ResponseGetChecklist>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/show-checklist-params`,
        payload,
        {
          headers,
        }
      );

    let resp: ResponseGetChecklist | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function getCheclistById(id: number, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response: AxiosResponse<ResponseObsEncontradas> | undefined =
      await axios.get<ResponseObsEncontradas>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/show-checklistdet-id/${id}`,
        {
          headers,
        }
      );
    let resp: ResponseObsEncontradas | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function GetTipoCheckList(token: String, idModulo: number) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/tipos-checklist-estado/1/${idModulo}`,
      { headers }
    );
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(
        ({
          idTipoChecklist,
          nombreTipo,
        }: {
          idTipoChecklist: number;
          nombreTipo: string;
        }) => ({
          label: nombreTipo,
          value: idTipoChecklist.toString(),
        })
      );
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function reasignarResponsable(
  id: number | undefined,
  payload: { userNameEjecucion: number },
  token: String
) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/update-responsable/${id}`,
      payload,
      {
        headers,
      }
    );
    let resp: ResponseCloseObseEncontradas | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function getCheckListPendiente(token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response: AxiosResponse<any> = await axios.get<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/show-checklist-pendiente`,
      {
        headers,
      }
    );
    let resp: any | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function GetCheckListInsp(token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let response = await axios.get<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/tipos-checklist`,
      { headers }
    );
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(
        ({
          idTipoChecklist,
          nombreTipo,
        }: {
          idTipoChecklist: number;
          nombreTipo: string;
        }) => ({
          label: nombreTipo,
          value: idTipoChecklist,
        })
      );
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function GetCheckListInspeccion(params:any, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response: AxiosResponse<ResponseObsEncontradas> =
      await axios.get<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/show-check-list`,
        { headers, params},
      );
    let resp: ResponseObsEncontradas | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function anularReport(id: number, token: string) {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    Swal.fire({
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
        let response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/inspecciones/anular-check-list/${id}`, "", {
          headers,
        });
        if (response.data.status == "success") {
          Swal.fire("OK", response.data.message, "success");
        }
      }
    });
  } catch (error) {
    await handleApiError(error);
  }
}

const zfill = (value: any, length: number) => {
  const str = value.toString();
  return str.padStart(length, "0");
};
