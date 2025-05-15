/*
 * Created on Wed Mar 05 2025
 *
 * Copyright (c) 2025 CC
 *
 * Author Cristian R. Paz
 */

"use client";

import PageContainer from "@/app/components/container/PageContainer";
import ViewListarInspecciones from "@/app/sections/ssa/view/inspecciones/viewListarInspecciones";

export default function reportSSA() {
  return (
    <PageContainer title="SSA" description="CERRAR OBSERVACIONES">
      <ViewListarInspecciones />
    </PageContainer>
  );
}
