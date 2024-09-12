/*
 * Created on Sat Aug 10 2024
 *
 * Copyright (c) 2024 CC
 *
 * Author Cristian R. Paz
 */

"use client";
import PageContainer from "@/app/components/container/PageContainer";
import UsersView from "@/app/sections/settings/users/viewUsers";

export default function mainUsers() {
  return (
    <PageContainer title="Usuarios" description="PAGE USERS">
      <UsersView />
    </PageContainer>
  );
}
