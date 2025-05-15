import axios, { AxiosResponse } from "axios";
import { handleApiError } from "./ControllerCommon";

const authCredentials = {
  username: process.env.NEXT_PUBLIC_USER || "",
  password: process.env.NEXT_PUBLIC_PASS || "",
};

export async function saveArea(payload: DataSaveArea, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response: AxiosResponse<ResponseSaveArea> | undefined = await axios.post<ResponseSaveArea>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/save-area`,
      payload,
      {
        headers,
      }
    );

    let resp: ResponseSaveArea | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function updateArea(payload: DataUpdateArea, id: number | null, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log("id-->",id);
    console.log("data-->",payload);
    const response = await axios.put<ResponseSaveArea>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/update-area/${id}`, payload, {
      headers,
    });
    let resp = response.data;
    return resp;
  } catch (error) {
    // await handleApiError(error); // Reutiliza el manejo de errores
  }
}

