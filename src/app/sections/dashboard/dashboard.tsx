/*
 * Created on Wed Apr 24 2024
 *
 * Copyright (c) 2024 CC
 * Author:  Cristian R. Paz  */

import { Grid, Box, Divider, alpha } from "@mui/material";
import DailyActivity from "@/app/components/dashboard/DailyActivity";
import ProductPerformance from "@/app/components/dashboard/ProductPerformance";
import BlogCard from "@/app/components/dashboard/Blog";
import AppWidgetSummary from "@/app/components/container/app-widget-summary";
import Link from "next/link";
import Image from "next/image";
import AppWebsiteVisits from "@/app/components/dashboard/app-website-visits";
import AppCurrentVisits from "@/app/components/dashboard/app-current-visits";
import { Account } from "@/app/_mock/account";
import { useEffect, useState } from "react";
import { GetModulos } from "@/app/api/dataApiComponents";
import { useSession } from "next-auth/react";
import React from "react";
import iconMap from "../../../../public/assets/icons/iconsMui";
import FolderIcon from "@mui/icons-material/Folder";

//---------------------------------------------------------------------

const Dashboard = () => {
  //========================constantes globales===========================
  const account = Account();
  const { status } = useSession();

  //=============================LISTAS===================================

  const [listaModulos, setListaModulos] = useState<any[]>([]);

  //============================Metodo que carga con el sistema================================
  useEffect(() => {
    if (status === "authenticated") {
      loadDataApi();
    }
  }, [status, account.token]);

  //===========================Funciones===========================================
  async function loadDataApi() {
    const modulos = await GetModulos(account.token);

    if (modulos) {
      const modulosUser = modulos.filter((data: any) => data.value != 3);
      account.role == "root" ? setListaModulos(modulos) : setListaModulos(modulosUser);
    }
  }

  return (
    <>
      <h3>Hola, Bienvenido a los Modulos ZamiCLP 👋</h3>
      <Box mt={3}>
        <Grid container spacing={4}>
          {listaModulos.map((val, index) => {
            return (
              <Grid item md={3} sm={6} xs={12} key={index}>
                <Link href={val.pathUrl} style={{ textDecoration: "none" }}>
                  <AppWidgetSummary
                    title={val.label}
                    legend="Módulo"
                    color={val.colorModulo}
                    icon={React.createElement(iconMap[val.iconoModulo] || FolderIcon, {
                      sx: { fontSize: "45px", color: (theme) => alpha(val.colorModulo, 0.8) },
                    })}
                  />
                </Link>
              </Grid>
            );
          })}

          <Divider sx={{ borderStyle: "revert", m: 2 }} />
          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Visitas al sitio web"
              subheader="(+43%) than last year"
              chart={{
                labels: [
                  "01/01/2003",
                  "02/01/2003",
                  "03/01/2003",
                  "04/01/2003",
                  "05/01/2003",
                  "06/01/2003",
                  "07/01/2003",
                  "08/01/2003",
                  "09/01/2003",
                  "10/01/2003",
                  "11/01/2003",
                ],
                series: [
                  {
                    name: "Team A",
                    type: "column",
                    fill: "solid",
                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                  },
                  {
                    name: "Team B",
                    type: "area",
                    fill: "gradient",
                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                  },
                  {
                    name: "Team C",
                    type: "line",
                    fill: "solid",
                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                  },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {/*   <SalesOverview /> */}
            <AppCurrentVisits
              title="Visitas actuales"
              chart={{
                series: [
                  { label: "America", value: 4344 },
                  { label: "Asia", value: 5435 },
                  { label: "Europe", value: 1443 },
                  { label: "Africa", value: 4443 },
                ],
              }}
              subheader={undefined}
            />
          </Grid>

          {/* ------------------------- row 1 ------------------------- */}
          {/*  <Grid item xs={12} lg={4}>
            <DailyActivity />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
          <Grid item xs={12} lg={12}>
            <BlogCard />
          </Grid> */}
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
