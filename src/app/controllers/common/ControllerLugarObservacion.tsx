import axios, { AxiosResponse } from "axios";
import { handleApiError } from "./ControllerCommon";

const authCredentials = {
  username: process.env.NEXT_PUBLIC_USER || "",
  password: process.env.NEXT_PUBLIC_PASS || "",
};

export async function saveLugarObservacion(payload: DataSaveLugarObservacion, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response: AxiosResponse<ResponseSaveLugarObservacion> | undefined = await axios.post<ResponseSaveLugarObservacion>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/save-lugar-observacion`,
      payload,
      {
        headers,
      }
    );

    let resp: ResponseSaveLugarObservacion | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}
export async function updateLugarObservacion(payload: DataUpdateLugarObservacion, id: number | null, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`, 
    };
    console.log("id-->",id);
    console.log("data-->",payload);
    const response = await axios.put<ResponseSaveLugarObservacion>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/update-lugar-observacion/${id}`, payload, {
      headers,
    });
    let resp = response.data;
    return resp;
  } catch (error) {
    // await handleApiError(error); // Reutiliza el manejo de errores
  }
}

