import { useSession } from "next-auth/react";

export function Account() {
  const { data: session, status } = useSession();

  if (status === "loading" || !session) {
    return {
      displayName: "",
      email: "",
      photoURL: "/assets/images/avatars/avatar_25.jpg",
      role: "",
      cellphone: "",
      idUser: "",
      token: "",
      isLoading: true,
    };
  }

  const account = {
    displayName: session?.user?.name || "",
    email: session?.user?.email || "",
    photoURL: "/assets/images/avatars/avatar_25.jpg",
    role: session?.user?.rol || "",
    cellphone: session?.user?.telefono || "",
    idUser: session?.user?.id?.toString() || "",
    token: session?.user?.token?.toString() || "",
  };
  return account;
}
