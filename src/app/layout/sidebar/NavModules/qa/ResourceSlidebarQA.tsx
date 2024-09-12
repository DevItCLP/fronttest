import { uniqueId } from "lodash";
import { IconChecklist, IconNews, IconFileAnalytics } from "@tabler/icons-react";

export const headerQA: headerMain[] = [
  {
    id: uniqueId(),
    header: "QA",
    module: "Inicio",
    href: "/pages/qa",
  },
];

export const subTitlesQA: subTitles[] = [
  {
    id: uniqueId(),
    code: 1,
    header: "Check List Operacion",
    //open:
  },
  {
    id: uniqueId(),
    code: 2,
    header: "Charlas",
  },
];

export const itemsqa: itemsTitles[] = [
  {
    id: uniqueId(),
    title: "Crear Check List",
    icon: IconNews,
    idSubTitles: 1,
    href: "/pages/qa/formchl",
  },
  {
    id: uniqueId(),
    title: "Cerrar Check List",
    icon: IconChecklist,
    idSubTitles: 1,
    href: "/pages/qa/formchlclose",
  },
  {
    id: uniqueId(),
    title: "Reportes Check List",
    icon: IconFileAnalytics,
    idSubTitles: 1,
    href: "/pages/qa/reportes",
  },
];
