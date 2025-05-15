/*
 * Created on Wed Mar 05 2025
 *
 * Copyright (c) 2025 CC
 *
 * Author Cristian R. Paz
 */
"use client";

import PageContainer from "@/app/components/container/PageContainer";
import ViewInspeccionesClose from "@/app/sections/ssa/view/inspecciones/viewInspeccionesClose";

export default function reportSSA() {
  return (
    <PageContainer title="SSA" description="REPORTE DE INSPECCIONES">
      <ViewInspeccionesClose />
    </PageContainer>
  );
}
