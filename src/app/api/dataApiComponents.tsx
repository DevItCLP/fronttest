import axios from "axios";
import { handleApiError } from "../controllers/common/ControllerCommon";
//---------------------------------------------------------------

const authCredentials = {
  username: process.env.NEXT_PUBLIC_USER || "",
  password: process.env.NEXT_PUBLIC_PASS || "",
};

export async function GetProgramas(token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-all-programas`, { headers });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ idPrograma, descriptionPrograma }: { idPrograma: number; descriptionPrograma: string }) => ({
        label: descriptionPrograma,
        value: idPrograma.toString(),
      }));
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function GetAreas(token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-all-areas`, { headers });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ idArea, nameArea, statusArea }: { idArea: number; nameArea: string; statusArea: number }) => ({
        label: nameArea,
        value: idArea.toString(),
        nameArea: nameArea,
        statusArea: statusArea,
      }));
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function GetProyectos(token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-all-proyectos`, { headers });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ idProyecto, nameProyecto }: { idProyecto: number; nameProyecto: string }) => ({
        label: nameProyecto,
        value: idProyecto.toString(),
      }));
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function GetTurnos(token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-all-turno`, { headers });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ idTurno, nameTurno }: { idTurno: number; nameTurno: string }) => ({
        label: nameTurno,
        value: idTurno.toString(),
      }));
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function GetLugarObs(token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-all-place`, { headers });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(
        ({
          idLugarObser,
          nameLugarObservacion,
          statusLugarObservacion,
        }: {
          idLugarObser: number;
          nameLugarObservacion: string;
          statusLugarObservacion: number;
        }) => ({
          id: idLugarObser,
          nameLugarObservacion: nameLugarObservacion,
          statusLugarObservacion: statusLugarObservacion,

          label: nameLugarObservacion,
          value: idLugarObser.toString(),
        })
      );
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function GetPreguntas(id: number, token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-all-act-adicionales/${id}`, { headers });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      const lista = data.map(
        ({ idActLiderazAdic, descriptionActLiderazgoAdic }: { idActLiderazAdic: number; descriptionActLiderazgoAdic: string }) => ({
          label: descriptionActLiderazgoAdic,
          id: idActLiderazAdic.toString(),
        })
      );
      return lista;
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function GetActividadLiderazgo(token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-all-act-liderazgo`, { headers });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ idListActLiderazgo, nameListActLiderazgo }: { idListActLiderazgo: number; nameListActLiderazgo: string }) => ({
        label: nameListActLiderazgo,
        value: idListActLiderazgo.toString(),
      }));
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}
export async function GetUsuarios(token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/usuarios/show-usuarios/1`, { headers });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(
        ({ idUser, nombresUser, apellidosUser, emailUser }: { idUser: number; nombresUser: string; apellidosUser: string; emailUser: string }) => ({
          label: `${nombresUser} ${apellidosUser}`,
          idEmpleado: idUser,
          value: idUser.toString(),
          email: emailUser.toString(),
        })
      );
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}
export async function GetAllUsuarios(token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/usuarios/show-users`, { headers });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data;
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}

export async function GetRoles(token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/roles/show-roles/1`, { headers });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ idRol, nombreRol }: { idRol: number; nombreRol: string }) => ({
        label: nombreRol,
        value: idRol.toString(),
      }));
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}
export async function GetModulos(token: String) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    let { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/modulos/show-modules/1`, { headers });
    if (data) {
      const dataModulos = data.object;
      //alimento la constante lista
      return dataModulos.map(
        ({
          idModulo,
          nombreModulo,
          descripcionModulo,
          iconoModulo,
          pathUrl,
          colorModulo,
        }: {
          idModulo: number;
          nombreModulo: string;
          descripcionModulo: string;
          iconoModulo: string;
          pathUrl: string;
          colorModulo: string;
        }) => ({
          label: nombreModulo,
          value: idModulo.toString(),
          descripcionModulo: descripcionModulo,
          iconoModulo: iconoModulo,
          pathUrl: pathUrl,
          colorModulo: colorModulo,
        })
      );
    }
  } catch (error) {
    await handleApiError(error); // Reutiliza el manejo de errores
  }
}
