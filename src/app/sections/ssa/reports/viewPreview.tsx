import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, Modal } from "@mui/material";
import { DocModal } from "./viewModal";
import { Account } from "@/app/_mock/account";
import { handleApiError } from "@/app/controllers/common/ControllerCommon";

export default function PreviewReport({ idPrograma }: { idPrograma: number }) {
  const authCredentials = {
    username: process.env.NEXT_PUBLIC_USER || "",
    password: process.env.NEXT_PUBLIC_PASS || "",
  };

  const account = Account();

  const [listaGeneral, setListaGeneral] = useState<any[]>([]);
  const [listaPreguntas, setListaPreguntas] = useState<any[]>([]);
  const [listaImagenes, setListaImagenes] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    viewReport(idPrograma);
  }, []);

  async function viewReport(id: any) {
    try {
      const headers = {
        Authorization: `Bearer ${account.token}`,
      };
      let response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ascl/show-record-id/${id}`, { headers });

      if (response.data.status == "success") {
        const { listaDataGeneral, listaDataPreguntas, listaDataImages } = response.data.object;

        setListaGeneral(listaDataGeneral);
        setListaPreguntas(listaDataPreguntas);
        setListaImagenes(listaDataImages);
        handleOpen();
      }
    } catch (error) {
      await handleApiError(error); // Reutiliza el manejo de errores
    }
  }

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
          <DialogContent dividers>
            <DocModal listaGeneral={listaGeneral} listaPreguntas={listaPreguntas} listaImagenes={listaImagenes} />
          </DialogContent>
        </Dialog>
      </Modal>
    </>
  );
}
