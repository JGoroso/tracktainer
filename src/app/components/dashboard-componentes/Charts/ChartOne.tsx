"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type FilterType = "Día" | "Semana" | "Mes";

const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};

interface Pedido {
  fechaPedido: string;
  cantidad: number;
}
const filterData = (data: Pedido[], filter: FilterType) => {
  const now = new Date();
  const startOfPeriod = new Date();
  let endOfPeriod = new Date();

  switch (filter) {
    case "Día":
      startOfPeriod.setDate(now.getDate() - 3);
      startOfPeriod.setHours(0, 0, 0, 0);
      endOfPeriod = new Date();
      endOfPeriod.setHours(23, 59, 59, 999);
      break;
    case "Semana":
      startOfPeriod.setDate(now.getDate() - 7);
      startOfPeriod.setHours(0, 0, 0, 0);
      endOfPeriod = new Date();
      endOfPeriod.setHours(23, 59, 59, 999);
      break;
    case "Mes":
      startOfPeriod.setDate(1);
      startOfPeriod.setMonth(now.getMonth());
      startOfPeriod.setHours(0, 0, 0, 0);
      endOfPeriod.setMonth(now.getMonth() + 1);
      endOfPeriod.setDate(0);
      endOfPeriod.setHours(23, 59, 59, 999);
      break;
  }

  const filteredData = data.filter((pedido) => {
    const pedidoDate = parseDate(pedido.fechaPedido);
    return pedidoDate >= startOfPeriod && pedidoDate <= endOfPeriod;
  });

  return filteredData;
};

const ChartOne: React.FC = () => {
  const [pedidosCancelados, setPedidosCancelados] = useState<Pedido[]>([]);
  const [pedidosCompletados, setPedidosCompletados] = useState<Pedido[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<any>({});
  const [series, setSeries] = useState<any>([]);
  const [filter, setFilter] = useState<FilterType>("Día");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCancelados = await axios.get(
          "/api/get/pedidoscanceladosbydate"
        );
        const dataCancelados = resCancelados.data;
        setPedidosCancelados(dataCancelados);

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
    const filteredCancelados = filterData(pedidosCancelados, filter);
    const filteredCompletados = filterData(pedidosCompletados, filter);

    const allDates = new Set([
      ...filteredCancelados.map((pedido) => pedido.fechaPedido),
      ...filteredCompletados.map((pedido) => pedido.fechaPedido),
    ]);
    const sortedDates = Array.from(allDates).sort();

    const dataCompletadosSorted = sortedDates.map((date) => {
      const pedido = filteredCompletados.find((p) => p.fechaPedido === date);
      return pedido ? pedido.cantidad : 0;
    });

    const dataCanceladosSorted = sortedDates.map((date) => {
      const pedido = filteredCancelados.find((p) => p.fechaPedido === date);
      return pedido ? pedido.cantidad : 0;
    });

    const newOptions = {
      chart: {
        type: "area",
        height: 350,
        width: "100%",
      },
      xaxis: {
        categories: sortedDates,
      },
      colors: ["#00E396", "#FF4560"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
    };

    setOptions(newOptions);

    const newSeries = [
      {
        name: "Completados",
        data: dataCompletadosSorted,
      },
      {
        name: "Cancelados",
        data: dataCanceladosSorted,
      },
    ];

    setSeries(newSeries);
  }, [pedidosCancelados, pedidosCompletados, filter]);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-green-500">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-green-500"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-green-500">
                Pedidos Completados
              </p>
              {/* <p className="text-sm font-medium">12/04/2023 - 12/05/2023</p> */}
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-red">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-red"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-red">Pedidos Cancelados</p>
              {/* <p className="text-sm font-medium">12/04/2023 - 12/05/2023</p> */}
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button
              className={`rounded px-3 py-1 text-xs font-medium ${
                filter === "Día"
                  ? "bg-white text-black shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark"
                  : "text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark"
              }`}
              onClick={() => handleFilterChange("Día")}
            >
              Día
            </button>
            <button
              className={`rounded px-3 py-1 text-xs font-medium ${
                filter === "Semana"
                  ? "bg-white text-black shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark"
                  : "text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark"
              }`}
              onClick={() => handleFilterChange("Semana")}
            >
              Semana
            </button>
            <button
              className={`rounded px-3 py-1 text-xs font-medium ${
                filter === "Mes"
                  ? "bg-white text-black shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark"
                  : "text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark"
              }`}
              onClick={() => handleFilterChange("Mes")}
            >
              Mes
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default ChartOne;
