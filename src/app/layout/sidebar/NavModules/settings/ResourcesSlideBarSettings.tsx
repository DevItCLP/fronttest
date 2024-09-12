import { uniqueId } from "lodash";
import { IconChecklist, IconNews, IconFileAnalytics } from "@tabler/icons-react";

export const headerSettings: headerMain[] = [
  {
    id: uniqueId(),
    header: "Panel de control",
    module: "Inicio",
    href: "/pages/settings",
  },
];

export const subTitlesSettings: subTitles[] = [
  {
    id: uniqueId(),
    code: 1,
    header: "Gestión",
    //open:
  },
];

export const itemssettings: itemsTitles[] = [
  {
    id: uniqueId(),
    title: "Usuarios",
    icon: IconNews,
    idSubTitles: 1,
    href: "/pages/settings/users",
  },
  {
    id: uniqueId(),
    title: "Áreas",
    icon: IconChecklist,
    idSubTitles: 1,
    href: "#",
  },
  {
    id: uniqueId(),
    title: "Lugar de Observación",
    icon: IconFileAnalytics,
    idSubTitles: 1,
    href: "#",
  },
];
