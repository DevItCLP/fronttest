/*
 * Created on Tue Mar 04 2025
 *
 * Copyright (c) 2025 CC
 *
 * Author Cristian R. Paz
 */

"use client";
import PageContainer from "@/app/components/container/PageContainer";
import FormCoc from "@/app/sections/ssa/view/inspecciones/viewFormCoc";
export default function pageFormCoc() {
  return (
    <PageContainer title="SSA" description="PAGE CHECKLIST COCINA">
      <FormCoc />
    </PageContainer>
  );
}
