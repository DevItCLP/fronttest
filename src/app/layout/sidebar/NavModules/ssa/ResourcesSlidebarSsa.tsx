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
    header: "Liderazgo Visible",
    //open:
  },
  {
    id: uniqueId(),
    code: 2,
    header: "VLP",
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
    title: "Cerrar OPACI",
    icon: IconTable,
    idSubTitles: 1,
    href: "/pages/ssa/formip/formcloseobs",
  },
  /*  {
    id: uniqueId(),
    title: "OPS",
    icon: IconLayoutGrid,
    idSubTitles: 1,
    href: "/pages/ssa/formopt",
  }, */
  {
    id: uniqueId(),
    title: "ART",
    icon: IconStar,
    idSubTitles: 1,
    href: "/pages/ssa/formstl",
  },
  {
    id: uniqueId(),
    title: "Reportes",
    icon: IconLayout,
    idSubTitles: 1,
    href: "/pages/ssa/reportes",
  },

  {
    id: uniqueId(),
    title: "Registrar VLP",
    icon: IconLayout,
    idSubTitles: 2,
    href: "/pages/ssa/reportes",
  },
];
