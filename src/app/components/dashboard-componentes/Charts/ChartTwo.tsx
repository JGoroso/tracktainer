"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import dayjs from "dayjs";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  colors: ["#4cbf40", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },

  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "25%",
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: "25%",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
    },
  },
  dataLabels: {
    enabled: false,
  },

  xaxis: {
    categories: ["L", "M", "M", "J", "V", "S", "D"],
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",
  },
  fill: {
    opacity: 1,
  },
};

interface Pedido {
  fechaPedido: string;
  cantidad: number;
}

const ChartTwo: React.FC = () => {
  const [pedidosCompletados, setPedidosCompletados] = useState<Pedido[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<any>({});
  const [series, setSeries] = useState<any>([]);
  const [selectedWeek, setSelectedWeek] = useState<"thisWeek" | "lastWeek">(
    "thisWeek"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCompletados = await axios.get(
          "/api/get/pedidoscompletadosbydate"
        );
        const dataCompletados = resCompletados.data;
        setPedidosCompletados(dataCompletados);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const parseDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day); // JavaScript months are 0-indexed
    };

    const getStartAndEndDates = (week: "thisWeek" | "lastWeek") => {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Start of this week (Monday)
      const endOfWeek = new Date(now);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // End of this week (Sunday)

      if (week === "thisWeek") {
        return { start: startOfWeek, end: endOfWeek };
      } else {
        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfWeek.getDate() - 7);
        const endOfLastWeek = new Date(endOfWeek);
        endOfLastWeek.setDate(endOfWeek.getDate() - 7);
        return { start: startOfLastWeek, end: endOfLastWeek };
      }
    };

    const filterDataByWeek = (week: "thisWeek" | "lastWeek") => {
      const { start, end } = getStartAndEndDates(week);
      return pedidosCompletados.filter((pedido) => {
        const fechaPedido = parseDate(pedido.fechaPedido);
        return fechaPedido >= start && fechaPedido <= end;
      });
    };

    const calculateDailyCounts = (data: Pedido[], start: Date) => {
      const dailyCounts = Array(7).fill(0); // Array to hold counts for each day of the week
      data.forEach((pedido) => {
        const fechaPedido = parseDate(pedido.fechaPedido);
        const dayIndex = (fechaPedido.getDay() + 6) % 7; // Adjust to have Monday as index 0
        dailyCounts[dayIndex] += pedido.cantidad;
      });

      // Create date labels for the selected week
      const dateLabels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        return date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      });

      return { dailyCounts, dateLabels };
    };

    const { start } = getStartAndEndDates(selectedWeek);
    const filteredData = filterDataByWeek(selectedWeek);
    const { dailyCounts, dateLabels } = calculateDailyCounts(
      filteredData,
      start
    );

    setOptions({
      chart: {
        type: "bar",
        height: 350,
      },
      xaxis: {
        categories: dateLabels, // Use the generated date labels
      },
      yaxis: {
        labels: {
          formatter: (value: number) => value.toFixed(0), // Show integer values only
        },
      },
      // title: {
      //   text: `Pedidos completados (${
      //     selectedWeek === "thisWeek" ? "Esta semana" : "Semana pasada"
      //   })`,
      //   align: "center",
      // },
    });

    setSeries([
      {
        name: "Pedidos Completados",
        data: dailyCounts,
      },
    ]);
  }, [pedidosCompletados, selectedWeek]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Pedidos entregados
          </h4>
          <p>Pedidos entregados en la semana vs semana anterior</p>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
              name="weekSelector"
              id="weekSelector"
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
              value={selectedWeek}
              onChange={(e) =>
                setSelectedWeek(e.target.value as "thisWeek" | "lastWeek")
              }
            >
              <option value="thisWeek" className="dark:bg-boxdark">
                Esta semana
              </option>
              <option value="lastWeek" className="dark:bg-boxdark">
                Semana pasada
              </option>
            </select>
            <span className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                  fill="#637381"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-mb-9 -ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
