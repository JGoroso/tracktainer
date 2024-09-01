import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const customColors = ["#3c50e0", "#0FADCF", "#8FD0EF", "#0FADCF", "#0FADCF"];

const ChartThree: React.FC = () => {
  const [dataMensualLength, setDataMensualLength] = useState<number | null>(
    null
  );
  const [dataAnualLength, setDataAnualLength] = useState<number | null>(null);
  const [dataMensual, setDataMensual] = useState<
    { cliente: string; porcentaje: string }[]
  >([]);
  const [dataAnual, setDataAnual] = useState<
    { cliente: string; porcentaje: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [chartOptions, setChartOptions] = useState<ApexOptions>({
    labels: [],
    colors: customColors,
    chart: {
      type: "donut",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
    legend: {
      show: true,
    },
    dataLabels: {
      enabled: true,
    },
  });
  const [selectedOption, setSelectedOption] = useState("Mensual");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint =
          selectedOption === "Mensual"
            ? "/api/get/pcmensualporcliente"
            : "/api/get/pcanualporcliente";

        const endpointLength =
          selectedOption === "Mensual"
            ? "/api/get/completadoscantidadmensual"
            : "/api/get/completadoscantidadanual";

        const [response, responseLength] = await Promise.all([
          axios.get(endpoint),
          axios.get(endpointLength),
        ]);

        if (selectedOption === "Mensual") {
          setDataMensual(response.data);
          setDataMensualLength(responseLength.data.totalPedidos); // Ajustar según la estructura de la respuesta
        } else {
          setDataAnual(response.data);
          setDataAnualLength(responseLength.data.totalPedidos); // Ajustar según la estructura de la respuesta
        }

        // Set chart options based on the selected data
        const data =
          selectedOption === "Mensual" ? response.data : response.data;
        setChartOptions((prevOptions) => ({
          ...prevOptions,
          labels: data.map((item: { cliente: string }) => item.cliente),
        }));
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchData();
  }, [selectedOption]);

  const dataToDisplay = selectedOption === "Mensual" ? dataMensual : dataAnual;
  const series = dataToDisplay.map((item) => parseFloat(item.porcentaje));

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Clientes principales
          </h5>
          <p>
            Pedidos completados:{" "}
            {selectedOption === "Mensual"
              ? dataMensualLength !== null
                ? dataMensualLength
                : "Cargando..."
              : dataAnualLength !== null
              ? dataAnualLength
              : "Cargando..."}
          </p>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
            >
              <option value="Mensual" className="dark:bg-boxdark">
                Mensual
              </option>
              <option value="Anual" className="dark:bg-boxdark">
                Anual
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
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
                  fill="#637381"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={chartOptions} series={series} type="donut" />
        </div>
      </div>

      <div className="-mx-8 flex items-center justify-center gap-y-3">
        {dataToDisplay.map((item, index) => (
          <div className="w-full px-8 sm:w-1/2" key={index}>
            <div className="flex items-center">
              <span
                className={`mr-2 block h-3 w-full max-w-3 rounded-full ${
                  index === 0
                    ? "bg-primary"
                    : index === 1
                    ? "bg-[#0FADCF]"
                    : "bg-[#8FD0EF]"
                }`}
              />
              <span className="text-xs text-black dark:text-white">
                {item.porcentaje}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 text-red-500">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default ChartThree;
