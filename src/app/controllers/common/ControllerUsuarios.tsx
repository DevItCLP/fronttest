import axios, { AxiosResponse } from "axios";

const authCredentials = {
  username: process.env.NEXT_PUBLIC_USER || "",
  password: process.env.NEXT_PUBLIC_PASS || "",
};

export async function saveUsuario(payload: DataSaveUser) {
  try {
    const response: AxiosResponse<ResponseSaveUser> | undefined = await axios.post<ResponseSaveUser>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/usuarios/save`,
      payload,
      {
        auth: authCredentials,
      }
    );

    let resp: ResponseSaveUser | undefined = response.data;
    return resp;
  } catch (error) {
    console.error("Error de comunicacion con el servicio amazonas", error);
  }
}
export async function updateUsuario(payload: DataUpdateUser, id: number | null) {
  try {
    const response = await axios.put<ResponseSaveUser>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/usuarios/update/${id}`, payload, {
      auth: authCredentials,
    });
    let resp = response.data;
    return resp;
  } catch (error) {
    console.error("Error de comunicacion con el servicio amazonas", error);
  }
}
export async function resetPassword(payload: DataResetPassword, id: number | null) {
  try {
    const response = await axios.put<ResponseSaveUser>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/usuarios/reset-password/${id}`, payload, {
      auth: authCredentials,
    });
    let resp = response.data;
    return resp;
  } catch (error) {
    console.error("Error de comunicacion con el servicio amazonas", error);
  }
}
