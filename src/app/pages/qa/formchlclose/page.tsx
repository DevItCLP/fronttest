/*
 * Created on Tue Jun 25 2024
 *
 * Copyright (c) 2024 CC
 *
 * Author Cristian R. Paz
 */

"use client";

import PageContainer from "@/app/components/container/PageContainer";
import FormChecklistClose from "@/app/sections/qa/viewFormChecklistClose";

export default function pageCheckList() {
  return (
    <PageContainer title="QA" description="PAGE CHECKLIST">
      <FormChecklistClose />
    </PageContainer>
  );
}
