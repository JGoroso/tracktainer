import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import Datepicker from "react-tailwindcss-datepicker";
import { ArrowDownTrayIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'; // Import icons

const ExportReports = () => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null
  });

  const [pedidos, setPedidos] = useState();
  const [showContent, setShowContent] = useState(false);
  // Función para obtener los pedidos de la API
  const fetchPedidos = async () => {
    const response = await axios.get('/api/get/pedidos');
    setPedidos(response.data);
  };

  // Función para exportar a CSV
  const exportToCSV = () => {
    fetchPedidos()
    const filteredPedidos = pedidos.filter(pedido => {
      const fechaPedido = new Date(pedido.fechaPedido);
      return fechaPedido >= startDate && fechaPedido <= endDate;
    });

    const csv = Papa.unparse(filteredPedidos);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'report.csv');
    link.click();
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    const filteredPedidos = pedidos.filter(pedido => {
      const fechaPedido = new Date(pedido.fechaPedido);
      return fechaPedido >= startDate && fechaPedido <= endDate;
    });

    const ws = XLSX.utils.json_to_sheet(filteredPedidos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
    XLSX.writeFile(wb, 'report.xlsx');
  };

  return (
    <div className="">
      <button
        className="bg-gray-500 text-black p-2 rounded flex items-center mb-2"
        onClick={() => setShowContent(!showContent)}
      >
        {showContent ? (
          <>
            <ChevronUpIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Cerrar
          </>
        ) : (
          <>
            <ChevronDownIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Decargar reportes segun fecha
          </>
        )}
      </button>

      {showContent && (
        <div className="flex flex-col gap-3">
          <div className='flex items-center justify-start ml-4'>
            <span className='mr-3'>Seleccione fecha para generar reporte</span>
            <div className="flex border rounded-md border-slate-300">
              <Datepicker
                useRange={false}
                value={value}
                onChange={newValue => setValue(newValue)}
              />
            </div>
          </div>
          <div className='flex mt-2'>
            <button
              className="text-blue-500 p-2 mb-2 flex items-center font-semibold"
              onClick={exportToCSV}
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Descargar reporte completo
            </button>
            <button
              className="text-green-500 p-2 mb-2 flex items-center font-semibold"
              onClick={exportToCSV}
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Descargar reporte pedidos completados
            </button>
            <button
              className="text-red p-2 mb-2 flex items-center font-semibold"
              onClick={exportToCSV}
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Descargar reporte pedidos cancelados
            </button>
          </div>
        </div>
      )
      }
    </div >
  );
};


export default ExportReports;
