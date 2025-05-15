//=======================================LIBRERIAS======================================================

import axios, { AxiosResponse } from "axios";
import imageCompression from "browser-image-compression";
import { handleApiError } from "../common/ControllerCommon";
import Swal from "sweetalert2";

//=======================================METODOS=========================================================

export async function uploadGenericImagesS3(images: imagesGenericType[], ruta: string) {
  const compressImage = await Promise.all(
    images.map(async (val) => {
      try {
        //Metodo para comprimir el tamaño de la imagen
        const compressedBlob = await imageCompression(val.imageBlobFile, { maxSizeMB: 0.6, maxWidthOrHeight: 1920, useWebWorker: true });
        const compressedFile = new File([compressedBlob], val.imageBlobFile.name, {
          type: val.imageBlobFile.type,
          lastModified: Date.now(),
        });
        //Cierro metodo de comprimir imagen

        const formData: FormData = new FormData();
        formData.append("image", compressedFile);
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
    })
  );

  return compressImage;
}

export async function uploadImagesS3(images: imagesType[], id: number, ruta: string) {
  const compressImage = await Promise.all(
    images.map(async (val) => {
      try {
        //Metodo para comprimir el tamaño de la imagen
        const compressedBlob = await imageCompression(val.blobFile, { maxSizeMB: 0.6, maxWidthOrHeight: 1920, useWebWorker: true });
        const compressedFile = new File([compressedBlob], val.blobFile.name, {
          type: val.blobFile.type,
          lastModified: Date.now(),
        });
        //Cierro metodo de comprimir imagen

        const formData: FormData = new FormData();
        formData.append("image", compressedFile);
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
    })
  );
  return compressImage;
}

export async function saveAsclFull(payload: saveAsclType, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response: AxiosResponse<reponseSaveAscl> | undefined = await axios.post<reponseSaveAscl>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/save-ascl2`,
      payload,
      { headers }
    );
    let res: reponseSaveAscl | undefined = response.data;
    return res;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function getInspPlanificadas(actividad: number, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-insp-planificadas/${actividad}`, {
      headers,
    });
    if (response.data) {
      const data = response.data.object;
      return data.map(({ idAscl }: { idAscl: number }) => ({
        label: zfill(idAscl, 6),
        value: idAscl.toString(),
      }));
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function getObservacionesEncontradas(payload: any, token: String) {
  //console.log(payload);
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response: AxiosResponse<ResponseObsEncontradasIp> | undefined = await axios.post<ResponseObsEncontradasIp>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-observaciones-encontradas`,
      payload,
      {
        headers,
      }
    );
    let resp: ResponseObsEncontradasIp | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function closeObservaciones(payload: PayloadCloseIP, key: number, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/close-observaciones-encontradas/${key}`, payload, {
      headers,
    });
    let resp: ResponseCloseObseEncontradas | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}
export async function closeObsOpaci(payload: PayloadCloseOPACI, id: number, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/close-obs-opaci/${id}`, payload, {
      headers,
    });
    let resp: ResponseCloseObseEncontradas | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function reasignarResponsable(id: number | undefined, payload: { usuarioEjecucion: number }, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/update-responsable/${id}`, payload, {
      headers,
    });
    let resp: ResponseCloseObseEncontradas | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function getRecordsParams(payload: PayloadResponseSearch, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response: AxiosResponse<any> = await axios.post<any>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-records-params`, payload, {
      headers,
    });
    let resp: any | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function viewReportAascl(id: number, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-record-id/${id}`, { headers });
    let resp = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

const zfill = (value: any, length: number) => {
  const str = value.toString();
  return str.padStart(length, "0");
};

export async function getAsclDetalle(idActividad: number, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response: AxiosResponse<any> = await axios.get<any>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-ascl-detalle/${idActividad}`, {
      headers,
    });
    let resp: any | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function GetReportsOpaci(payload: PayloadResponseSearch, token: string) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (!payload.fDesde || !payload.fHasta) {
      return []; // Si faltan fechas, retorna un array vacío o maneja el error adecuadamente
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/conteo-por-mes-opaci`, {
      headers,
      params: { startDate: payload.fDesde, endDate: payload.fHasta },
    });

    if (response.data && Array.isArray(response.data.object)) {
      const data = response.data.object;
      return data;
    } else {
      console.error("No se recibieron datos válidos:", response.data);
      return []; // Devuelve un array vacío si la respuesta no es válida
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}
export async function getUsuariosOpaci(fecha: String, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response: AxiosResponse<ResponseDataGeneric> = await axios.get<ResponseDataGeneric>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/users-cant-opaci/${fecha}`,
      {
        headers,
      }
    );
    const resp: ResponseDataGeneric | undefined = response.data;
    return resp.object;
  } catch (error) {
    await handleApiError(error);
  }
}

export async function anularReportAscl(id: number, token: string) {
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
        let response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/anular-doc/${id}`, "", {
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

export async function GetCategoriasOption(token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response: AxiosResponse<ResponseDataCat> = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-categorias/1`, { headers });
    if (response.data) {
      const resp: ResponseDataCat | undefined = response.data;
      return resp.object;
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}
