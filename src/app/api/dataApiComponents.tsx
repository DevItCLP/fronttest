import axios from "axios";

//---------------------------------------------------------------

const authCredentials = {
  username: process.env.NEXT_PUBLIC_USER || "",
  password: process.env.NEXT_PUBLIC_PASS || "",
};

// Define authentication credentials
const username = process.env.NEXT_PUBLIC_USER; // Store your username in an environment variable
const password = process.env.NEXT_PUBLIC_PASS; // Store your password in an environment variable

// Encode credentials in base64
const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

export async function GetProgramas() {
  try {
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-all-programas`, { auth: authCredentials });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ idPrograma, descriptionPrograma }: { idPrograma: number; descriptionPrograma: string }) => ({
        label: descriptionPrograma,
        value: idPrograma.toString(),
      }));
    }
  } catch (error) {
    console.error("Error de comunicacion con el servicio ", error);
  }
}

export async function GetAreas() {
  try {
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-all-areas`, { auth: authCredentials });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ idArea, nameArea }: { idArea: number; nameArea: string }) => ({
        label: nameArea,
        value: idArea.toString(),
      }));
    }
  } catch (error) {
    console.error("Error de comunicacion con el servicio", error);
  }
}

export async function GetProyectos() {
  try {
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-all-proyectos`, { auth: authCredentials });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ idProyecto, nameProyecto }: { idProyecto: number; nameProyecto: string }) => ({
        label: nameProyecto,
        value: idProyecto.toString(),
      }));
    }
  } catch (error) {
    console.error("Error de comunicacion con el servicio ", error);
  }
}

export async function GetTurnos() {
  try {
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-all-turno`, { auth: authCredentials });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ idTurno, nameTurno }: { idTurno: number; nameTurno: string }) => ({
        label: nameTurno,
        value: idTurno.toString(),
      }));
    }
  } catch (error) {
    console.error("Error de comunicacion con el servicio ", error);
  }
}

export async function GetLugarObs() {
  try {
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-all-place`, { auth: authCredentials });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ idLugarObser, nameLugarObservacion }: { idLugarObser: number; nameLugarObservacion: string }) => ({
        label: nameLugarObservacion,
        value: idLugarObser.toString(),
      }));
    }
  } catch (error) {
    console.error("Error de comunicacion con el servicio ", error);
  }
}

export async function GetPreguntas(id: number) {
  try {
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-all-act-adicionales/${id}`, { auth: authCredentials });
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
    console.error("Error de comunicacion con el servicio ", error);
  }
}

export async function GetActividadLiderazgo() {
  try {
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-all-act-liderazgo`, { auth: authCredentials });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ idListActLiderazgo, nameListActLiderazgo }: { idListActLiderazgo: number; nameListActLiderazgo: string }) => ({
        label: nameListActLiderazgo,
        value: idListActLiderazgo.toString(),
      }));
    }
  } catch (error) {
    console.error("Error de comunicacion con el servicio ", error);
  }
}
export async function GetUsuarios() {
  try {
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/usuarios/show-usuarios/1`, { auth: authCredentials });
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
    console.error("Error de comunicacion con el servicio ", error);
  }
}
export async function GetAllUsuarios() {
  try {
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/usuarios/show-users`, { auth: authCredentials });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data;
    }
  } catch (error) {
    console.error("Error de comunicacion con el servicio ", error);
  }
}

export async function GetRoles() {
  try {
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/roles/show-roles/1`, { auth: authCredentials });
    if (response.data) {
      const data = response.data.object;
      //alimento la constante lista
      return data.map(({ idRol, nombreRol }: { idRol: number; nombreRol: string }) => ({
        label: nombreRol,
        value: idRol.toString(),
      }));
    }
  } catch (error) {
    console.error("Error de comunicacion con el servicio ", error);
  }
}
