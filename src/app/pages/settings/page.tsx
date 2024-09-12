/*
 * Created on Sat Aug 10 2024
 *
 * Copyright (c) 2024 CC
 *
 * Author Cristian R. Paz
 */

"use client";

import PageContainer from "@/app/components/container/PageContainer";
import SettingsView from "@/app/sections/settings/view/viewSettings";

export default function mainSettings() {
  return (
    <PageContainer title="Settings" description="PAGE SETTINGS">
      <SettingsView />
    </PageContainer>
  );
}
