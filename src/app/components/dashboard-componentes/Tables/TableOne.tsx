"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

type Pedido = {
  id: string;
  estado: string;
  cliente: string;
  chofer: string;
  remito: string;
  fechaPedido: string;
};

const TableOne = () => {
  const [pedidosEntregados, setPedidosEntregados] = useState<Pedido[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Realiza una solicitud GET para obtener los pedidos entregados
        const response = await axios.get("/api/get/pedidosentregados");
        setPedidosEntregados(response.data);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchData();
  }, []);

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses en JavaScript son basados en 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Parse dates
  const parseDate = (dateString: string) => new Date(dateString);

  const calculateDaysDifference = (date1: Date, date2: Date) => {
    const differenceInTime = date1.getTime() - date2.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24));
  };

  // Function to format the difference as a readable string
  const formatDifferenceString = (daysDifference: number) => {
    if (daysDifference < 0) return "Aún no entregado";
    if (daysDifference === 0) return "0";
    if (daysDifference === 1) return "1 DÍA";
    if (daysDifference < 30) return `${daysDifference} DÍAS`;
    return "Más de 30 días";
  };

  const today = new Date();

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Pedidos con estado <span className="text-green-500">Entregado </span>/
        Tiempo en sitio
      </h4>

      <div className="mt-7 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 font-bold uppercase bg-gray-2 rounded-sm ">
            <tr>
              <th
                scope="col"
                className="px-2 py-3.5 text-sm font-medium text-left text-gray-500"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-2 py-3.5 text-sm font-medium text-left text-gray-500"
              >
                Cliente
              </th>
              <th
                scope="col"
                className="px-2 py-3.5 text-sm font-medium text-left text-gray-500"
              >
                Chofer
              </th>
              <th
                scope="col"
                className=" sm:table-cell px-2 py-3.5 text-sm font-medium text-left text-gray-500"
              >
                Remito
              </th>
              <th
                scope="col"
                className=" sm:table-cell px-2 py-3.5 text-sm font-medium text-left text-gray-500"
              >
                Fecha entrega
              </th>
              <th
                scope="col"
                className=" sm:table-cell px-2 py-3.5 text-sm font-medium text-left text-gray-500"
              >
                Tiempo en sitio (Días)
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {pedidosEntregados &&
              pedidosEntregados
                .slice() // Crear una copia del array para evitar mutar el original
                .sort((a, b) => {
                  // Convert fechaPedido to Date objects
                  const dateA = new Date(a.fechaPedido).getTime();
                  const dateB = new Date(b.fechaPedido).getTime();

                  // Ensure the dates are valid numbers
                  if (isNaN(dateA) || isNaN(dateB)) {
                    throw new Error("Invalid date format");
                  }

                  // Compare the dates
                  return dateA - dateB;
                })
                .map((pedido) => {
                  const pedidoDate = parseDate(pedido.fechaPedido); // Parse to Date object
                  const daysDifference = calculateDaysDifference(
                    today,
                    pedidoDate
                  ); // Calculate days difference
                  const formattedDifference =
                    formatDifferenceString(daysDifference); // Format difference as string

                  return (
                    <tr
                      key={pedido.id}
                      className="focus:outline-none border-b border-b-neutral-200"
                    >
                      <td className="px-2 py-4 whitespace-nowrap text-base font-medium text-left uppercase text-green-700">
                        {pedido.estado}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-base font-medium text-left text-gray-700">
                        {pedido.cliente}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-base font-medium text-left text-gray-700">
                        {pedido.chofer}
                      </td>
                      <td className="sm:table-cell px-2 py-4 whitespace-nowrap text-base font-medium text-left text-gray-700">
                        {pedido.remito}
                      </td>
                      <td className="sm:table-cell px-2 py-4 whitespace-nowrap text-base font-medium text-left text-gray-700">
                        {formatDate(pedido.fechaPedido)}
                      </td>
                      <td className="sm:table-cell px-2 py-4 whitespace-nowrap text-base font-medium text-left text-gray-700">
                        {formattedDifference}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TableOne;
