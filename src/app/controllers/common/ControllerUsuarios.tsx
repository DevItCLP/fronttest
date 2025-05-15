import axios, { AxiosResponse } from "axios";
import { handleApiError } from "./ControllerCommon";

const authCredentials = {
  username: process.env.NEXT_PUBLIC_USER || "",
  password: process.env.NEXT_PUBLIC_PASS || "",
};

export async function saveUsuario(payload: DataSaveUser, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response: AxiosResponse<ResponseSaveUser> | undefined = await axios.post<ResponseSaveUser>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/usuarios/save`,
      payload,
      {
        headers,
      }
    );

    let resp: ResponseSaveUser | undefined = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}
export async function updateUsuario(payload: DataUpdateUser, id: number | null, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.put<ResponseSaveUser>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/usuarios/update/${id}`, payload, {
      headers,
    });
    let resp = response.data;
    return resp;
  } catch (error) {
    // await handleApiError(error); // Reutiliza el manejo de errores
  }
}
export async function resetPassword(payload: DataResetPassword, id: number | null, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await axios.put<ResponseSaveUser>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/usuarios/reset-password/${id}`, payload, {
      headers,
    });
    let resp = response.data;
    return resp;
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}
