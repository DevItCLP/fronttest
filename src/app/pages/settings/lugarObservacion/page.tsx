"use client";
import PageContainer from "@/app/components/container/PageContainer";
import LugarObservacionView from "@/app/sections/settings/lugarObservacion/viewLugarObservacion";

export default function mainLugarObservacion() {
  return (
    <PageContainer title="Lugar Observacion" description="PAGE LUGAR OBSERVACION">
      <LugarObservacionView/>
    </PageContainer>
  );
}