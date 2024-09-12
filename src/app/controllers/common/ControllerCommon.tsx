import axios from "axios";
import { generateHtmlTemplate } from "@/app/components/template/templateEmail";
import { generateHtmlCloseTemplate } from "@/app/components/template/templateEmailCierre";

const zfill = (value: any, length: number) => {
  const str = value.toString();
  return str.padStart(length, "0");
};

export async function sendEmailSES(listArrayEmpleado: ResultadoEmail[], userSendNotify: string, subject: string, proceso: string, idRegistro: any) {
  let _user = listArrayEmpleado.map((val) => val.name).join(", ");
  let _idRegistro = zfill(idRegistro, 5);
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  let usuarios = _user ? _user : "User default Zami";
  let proceso_ses = proceso ? proceso : "Process default Zami";
  let creado_por_ses = userSendNotify ? userSendNotify : "Created by default Zami";
  let date_time_ses = date + "- " + time;
  let idRegistro_ses = _idRegistro ? _idRegistro : "Code 9999 default Zami";

  let template = generateHtmlTemplate(usuarios, proceso_ses, creado_por_ses, date_time_ses, idRegistro_ses);

  let payload = {
    toAddress: listArrayEmpleado.map((val) => val.email),
    subject: subject,
    template: template,
  };
  const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST_URL}/api/ses`, payload);

  let resp: any | undefined = response.data;
  return resp;
}
export async function sendEmailCloseSES(
  listArrayEmpleado: ResultadoEmail[],
  userSendNotify: string,
  subject: string,
  proceso: string,
  idRegistro: string
) {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  let proceso_ses = proceso ? proceso : "Process default Zami";
  let creado_por_ses = userSendNotify ? userSendNotify : "Created by default Zami";
  let date_time_ses = date + "- " + time;
  let idRegistro_ses = idRegistro ? idRegistro : "Code 9999 default Zami";

  let template = generateHtmlCloseTemplate(proceso_ses, creado_por_ses, date_time_ses, idRegistro_ses);

  let payload = {
    toAddress: listArrayEmpleado.map((val) => val.email),
    subject: subject,
    template: template,
  };
  const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST_URL}/api/ses`, payload);

  let resp: any | undefined = response.data;
  return resp;
}
/* export async function sendEmailReasignaciónSES(
  listArrayEmpleado: ResultadoEmail[],
  userSendNotify: string,
  subject: string,
  proceso: string,
  idRegistro: string
) {
  let _user = listArrayEmpleado.map((val) => val.name).join(", ");
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  let usuarios = _user ? _user : "User default Zami";
  let proceso_ses = proceso ? proceso : "Process default Zami";
  let creado_por_ses = userSendNotify ? userSendNotify : "Created by default Zami";
  let date_time_ses = date + "- " + time;
  let idRegistro_ses = idRegistro ? idRegistro : "Code 9999 default Zami";

  let template = generateHtmlTemplate(usuarios, proceso_ses, creado_por_ses, date_time_ses, idRegistro_ses);

  let payload = {
    toAddress: listArrayEmpleado.map((val) => val.email),
    subject: subject,
    template: template,
  };
  const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST_URL}/api/ses`, payload);

  let resp: any | undefined = response.data;
  return resp;
}
 */
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
