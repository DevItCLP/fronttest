"use client";
import PageContainer from "@/app/components/container/PageContainer";
import AreasView from "@/app/sections/settings/areas/viewArea";

export default function mainAreas() {
  return (
    <PageContainer title="Areas" description="PAGE AREAS">
      <AreasView />
    </PageContainer>
  );
}