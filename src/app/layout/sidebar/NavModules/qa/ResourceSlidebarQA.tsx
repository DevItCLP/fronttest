import { uniqueId } from "lodash";
import { IconChecklist, IconNews, IconFileAnalytics } from "@tabler/icons-react";

export const headerQA: headerMain[] = [
  {
    id: uniqueId(),
    header: "QA",
    module: "INICIO",
    href: "/pages/qa",
  },
];

export const subTitlesQA: subTitles[] = [
  {
    id: uniqueId(),
    code: 1,
    header: "INSPECCIONES",
    //open:
  },
  {
    id: uniqueId(),
    code: 2,
    header: "CHARLAS",
  },
];

export const itemsqa: itemsTitles[] = [
  {
    id: uniqueId(),
    title: "GENERAR CHECKLIST",
    icon: IconNews,
    idSubTitles: 1,
    href: "/pages/qa/formchl",
  },
  {
    id: uniqueId(),
    title: "CERRAR CHECKLIST",
    icon: IconChecklist,
    idSubTitles: 1,
    href: "/pages/qa/formchlclose",
  },
  {
    id: uniqueId(),
    title: "REPORTES",
    icon: IconFileAnalytics,
    idSubTitles: 1,
    href: "/pages/qa/reportes",
  },
];
