'use client'
import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { format, parseISO } from 'date-fns'; // Ensure parseISO is imported
import Datepicker from "react-tailwindcss-datepicker";
import { ArrowDownTrayIcon, CheckIcon, ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'; // Import icons
import { Listbox, Transition } from '@headlessui/react'



const ExportReports = () => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null
  });

  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selected, setSelected] = useState(null)
  const [showContent, setShowContent] = useState(false);


  useEffect(() => {
    // Fetch pedidos and clientes when component mounts
    const fetchData = async () => {
      try {
        const pedidosResponse = await axios.get('/api/get/pedidos');
        setPedidos(pedidosResponse.data);

        const clientesResponse = await axios.get('/api/get/clientes'); // Adjust the endpoint as necessary
        setClientes(clientesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  const exportToCSV = async (estado = null, cliente = null) => {
    // Asegúrate de que las fechas no sean nulas o indefinidas
    if (!value.startDate || !value.endDate) {
      alert('Por favor, selecciona un rango de fechas válido.');
      return;
    }

    const startDateFormatted = format(new Date(value.startDate), 'yyyy-MM-dd');
    const endDateFormatted = format(new Date(value.endDate), 'yyyy-MM-dd');

    // Filter pedidos based on date, estado, and cliente
    const filteredPedidos = pedidos
      .filter(pedido => {
        const fechaPedido = pedido.fechaPedido ? format(parseISO(pedido.fechaPedido), 'yyyy-MM-dd') : '';
        return fechaPedido >= startDateFormatted && fechaPedido <= endDateFormatted;
      })
      .filter(pedido => estado ? pedido.estado === estado : true)
      .filter(pedido => cliente ? pedido.cliente === cliente : true)
      .sort((a, b) => new Date(a.fechaPedido) - new Date(b.fechaPedido)); // Sort by fechaPedido

    // Convert filteredPedidos to CSV
    const csv = Papa.unparse(filteredPedidos, {
      encoding: 'utf8', // Ensure UTF-8 encoding for special characters
      quotes: true, // Ensure quotes are used around fields
      header: true // Include headers
    });

    // Create CSV blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_${estado ? estado : "completo"}_${cliente ? cliente : "todos"}.csv`);
    document.body.appendChild(link); // Append link to body for Firefox
    link.click();
    document.body.removeChild(link); // Remove link from body after download
  };

  return (
    <div className="max-w-6xl mx-auto " >
      <div className="flex flex-col items-center">
        <button
          className="bg-gray-500 text-black p-2 rounded flex items-center mb-4"
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
              Descargar reportes según fecha
            </>
          )}
        </button>

        {showContent && (
          <>
            <h2 className="text-2xl mb-4">Seleccione fecha para generar reporte</h2>
            <div className='max-w-60'>
              <Datepicker
                useRange={false}
                value={value}
                onChange={newValue => setValue(newValue)}
                className="w-full md:w-1/2 border rounded-md border-slate-300 mb-4"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-6">
              <div className="relative w-full h-52 bg-cover bg-center group rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out"
                style={{ backgroundImage: 'url("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f868ecef-4b4a-4ddf-8239-83b2568b3a6b/de7hhu3-3eae646a-9b2e-4e42-84a4-532bff43f397.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2Y4NjhlY2VmLTRiNGEtNGRkZi04MjM5LTgzYjI1NjhiM2E2YlwvZGU3aGh1My0zZWFlNjQ2YS05YjJlLTRlNDItODRhNC01MzJiZmY0M2YzOTcuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.R0h-BS0osJSrsb1iws4-KE43bUXHMFvu5PvNfoaoi8o")' }}>
                <div className="absolute inset-0 bg-blue-800 bg-opacity-75 transition duration-300 ease-in-out"></div>
                <div className="relative w-full h-full px-4 sm:px-6 lg:px-4 flex flex-col items-center justify-center">
                  <h3 className="text-center text-white text-lg">Descarga reporte de Completados</h3>
                  <button
                    className="mt-4 bg-white text-blue-800 p-2 rounded shadow-md flex items-center"
                    onClick={() => exportToCSV('completado')}
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    Descargar
                  </button>
                </div>
              </div>

              <div className="relative w-full h-52 bg-cover bg-center group rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out"
                style={{ backgroundImage: 'url("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f868ecef-4b4a-4ddf-8239-83b2568b3a6b/de7hhu3-3eae646a-9b2e-4e42-84a4-532bff43f397.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2Y4NjhlY2VmLTRiNGEtNGRkZi04MjM5LTgzYjI1NjhiM2E2YlwvZGU3aGh1My0zZWFlNjQ2YS05YjJlLTRlNDItODRhNC01MzJiZmY0M2YzOTcuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.R0h-BS0osJSrsb1iws4-KE43bUXHMFvu5PvNfoaoi8o")' }}>
                <div className="absolute inset-0 bg-opacity-40 bg-rose-800 transition duration-300 ease-in-out"></div>
                <div className="relative w-full h-full px-4 sm:px-6 lg:px-4 flex flex-col items-center justify-center">
                  <h3 className="text-center text-white text-lg">Descarga reporte de Cancelados</h3>
                  <button
                    className="mt-4 bg-white text-red-800 p-2 rounded shadow-md flex items-center"
                    onClick={() => exportToCSV('cancelado')}
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    Descargar
                  </button>
                </div>
              </div>

              <div className="relative w-full h-52 bg-cover bg-center group rounded-lg shadow-lg transition duration-300 ease-in-out"
                style={{ backgroundImage: 'url("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f868ecef-4b4a-4ddf-8239-83b2568b3a6b/de7hhu3-3eae646a-9b2e-4e42-84a4-532bff43f397.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2Y4NjhlY2VmLTRiNGEtNGRkZi04MjM5LTgzYjI1NjhiM2E2YlwvZGU3aGh1My0zZWFlNjQ2YS05YjJlLTRlNDItODRhNC01MzJiZmY0M2YzOTcuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.R0h-BS0osJSrsb1iws4-KE43bUXHMFvu5PvNfoaoi8o")' }}>
                <div className="absolute inset-0 bg-green-800 bg-opacity-75 transition duration-300 ease-in-out rounded-lg"></div>
                <div className="relative w-full h-full sm:px-6 lg:px-4 flex flex-col items-center justify-center">
                  <h3 className="text-center text-white text-lg">Descarga reporte por Cliente</h3>
                  <div className="w-72">
                    <Listbox value={selected ?? 'Seleccionar cliente'} onChange={setSelected}>
                      <div className="relative mt-1">
                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                          <span className="block truncate">{selected ? selected : 'Seleccionar cliente'}</span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {clientes.map((person, personIdx) => (
                              <Listbox.Option
                                key={personIdx}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                  }`
                                }
                                value={person.empresa}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                        }`}
                                    >
                                      {person.empresa}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>
                  <button
                    className="mt-4 bg-white text-green-800 p-2 rounded shadow-md flex items-center"
                    onClick={() => exportToCSV(null, selected)}
                    disabled={!selected}
                  >
                    <ArrowDownTrayIcon className="h-5 w-7 mr-2" aria-hidden="true" />
                    Descargar
                  </button>
                </div>
              </div>
            </div>
          </>
        )
        }
      </div >
    </div >
  );
};

export default ExportReports;