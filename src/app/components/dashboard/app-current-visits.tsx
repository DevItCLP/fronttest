import PropTypes from "prop-types";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { styled, useTheme } from "@mui/material/styles";

import { fNumber } from "@/utils/format-number";

import Chart, { useChart } from "@/app/components/chart";
import { Button } from "@mui/material";

import { useRef } from "react";
import { AlignHorizontalCenter } from "@mui/icons-material";

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400;

const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  "& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject": {
    height: `100% !important`,
  },
  "& .apexcharts-legend": {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

export default function AppCurrentVisits({ title, subheader, chart, ...other }: { title: string; subheader: any; chart: any }) {
  const theme = useTheme();
  const chartRef = useRef<HTMLDivElement>(null);

  const { series = [], options = {}, colors = [] } = chart || {};

  const chartSeries = series.map((i: any) => i.value);

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },

    colors: colors,
    labels: series.map((i: any) => i.label),
    stroke: {
      colors: [theme.palette.background.paper],
    },
    legend: {
      floating: true,
      position: "bottom",
      horizontalAlign: "center",
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value: any) => fNumber(value),
        title: {
          formatter: (seriesName: any) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    ...options,
  });

  /*   const handleExportPDF = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.text(title, 10, 10);
    pdf.addImage(imgData, "PNG", 10, 20, 180, 100);
    pdf.save("chart.pdf");
  }; */

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5, textAlign: "center" }} />
      <div ref={chartRef}>
        <StyledChart dir="ltr" type="pie" series={chartSeries} options={chartOptions} width="100%" height={280} />
      </div>

      {/*  <Button onClick={handleExportPDF} variant="contained" sx={{ m: 2 }}>
        Exportar a PDF
      </Button> */}
    </Card>
  );
}

AppCurrentVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
