/*
 * Created on Tue Jun 25 2024
 *
 * Copyright (c) 2024 CC
 *
 * Author Cristian R. Paz
 */

"use client";

import PageContainer from "@/app/components/container/PageContainer";
import FormChecklist from "@/app/sections/qa/viewFormChecklist";

export default function pageCheckList() {
  return (
    <PageContainer title="QA" description="PAGE CHECKLIST">
      <FormChecklist />
    </PageContainer>
  );
}
