/*
 * Created on Mon Jul 22 2024
 *
 * Copyright (c) 2024 CC
 *
 * Author Cristian R. Paz
 */

"use client";

import PageContainer from "@/app/components/container/PageContainer";
import FormIpClose from "@/app/sections/ssa/view/opaci/viewFormIpClose";

export default function pageCheckList() {
  return (
    <PageContainer title="QA" description="PAGE CHECKLIST">
      <FormIpClose />
    </PageContainer>
  );
}
