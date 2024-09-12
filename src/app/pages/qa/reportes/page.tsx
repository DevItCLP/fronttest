"use client";

import PageContainer from "@/app/components/container/PageContainer";
import FormListarChecklist from "@/app/sections/qa/viewListarChecklist";

export default function pageCheckList() {
  return (
    <PageContainer title="QA" description="PAGE CHECKLIST">
      <FormListarChecklist />
    </PageContainer>
  );
}
