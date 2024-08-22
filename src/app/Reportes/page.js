'use client'
import React from 'react';
import { useSession } from 'next-auth/react';
import Dashboards from '../components/dashboard-componentes/Dashboard/Dashboards';
import Link from 'next/link';


const ReportsPage = () => {

  const { data: session } = useSession()
  if (!session || session.user.role !== 'admin') {
    // Si no hay sesión o el usuario no tiene el rol de administrador, no renderizar el componente
    return null
  }



  return (
    <>
      <div className="px-4 sm:flex  mb-10 sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="font-medium text-xl text-gray-800 ">Reportes</h2>
          </div>
          <p className="mt-1 text-sm text-gray-800 ">
            En esta sección podrá ver diferentes reportes o generarlos
          </p>
        </div>


        <div className="flex items-center mt-2 gap-x-3">
          <Link href={"/"}>
            <button className="flex items-center justify-center w-3/3 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto ray-800 0 hover:bg-gray-100 200 y-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <span>Volver al mapa</span>
            </button>
          </Link>
          <Link href={"/Agregarpedidos"}>
            <button className="flex items-center justify-center w-full sm:w-auto px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-400 rounded-lg gap-x-2 hover:bg-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <span>Agregar Pedido</span>
            </button>
          </Link>
        </div>
      </div>
      <Dashboards />
    </>
  );
};

export default ReportsPage;