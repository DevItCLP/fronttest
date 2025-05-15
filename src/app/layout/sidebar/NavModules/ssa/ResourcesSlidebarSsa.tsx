import { uniqueId } from "lodash";
import { IconCircleDot, IconLayout, IconLayoutGrid, IconStar, IconTable } from "@tabler/icons-react";

export const headerSSA: headerMain[] = [
  {
    id: uniqueId(),
    header: "SSA",
    module: "Inicio",
    href: "/pages/ssa",
  },
];

export const subTitlesSsa: subTitles[] = [
  {
    id: uniqueId(),
    code: 1,
    header: "LIDERAZGO EN MARCHA CLP",
    //open:
  },
  {
    id: uniqueId(),
    code: 2,
    header: "INSPECCIONES",
  },
];

export const itemsssa: itemsTitles[] = [
  {
    id: uniqueId(),
    title: "DPS",
    icon: IconCircleDot,
    idSubTitles: 1,
    href: "/pages/ssa/formrs",
  },
  {
    id: uniqueId(),
    title: "OPACI",
    icon: IconTable,
    idSubTitles: 1,
    href: "/pages/ssa/formip",
  },
  {
    id: uniqueId(),
    title: "CERRAR OPACI",
    icon: IconTable,
    idSubTitles: 1,
    href: "/pages/ssa/formip/formcloseobs",
  },
  {
    id: uniqueId(),
    title: "ART",
    icon: IconStar,
    idSubTitles: 1,
    href: "/pages/ssa/formstl",
  },
  {
    id: uniqueId(),
    title: "REPORTES",
    icon: IconLayout,
    idSubTitles: 1,
    href: "/pages/ssa/reportes",
  },

  /*{
    id: uniqueId(),
    title: "EN DESARROLLO",
    icon: IconLayout,
    idSubTitles: 2,
    href: "/pages/ssa/#",
  }, */
  {
    id: uniqueId(),
    title: "GENERAR INSPECCIÓN",
    icon: IconLayout,
    idSubTitles: 2,
    href: "/pages/ssa/formcoc",
  },
  {
    id: uniqueId(),
    title: "CERRAR INSPECCIONES",
    icon: IconLayout,
    idSubTitles: 2,
    href: "/pages/ssa/reportesinspec/formcloseobs",
  },
  {
    id: uniqueId(),
    title: " REPORTES",
    icon: IconLayout,
    idSubTitles: 2,
    href: "/pages/ssa/reportesinspec",
  }, 
];
