"use client";
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
import Image from "next/image";
import axios from "axios"

  const ChartThree = dynamic(() => import("../Charts/ChartThree"), {
    ssr: false,
  });

const Dashboards: React.FC = () => {
  const [choferes, setChoferes] = useState([]);
  const [contenedores, setContenedores] = useState([]);
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [pedidosEntregados, setPedidosEntregados] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Realiza una solicitud GET para obtener los choferes
        const choferesResponse = await axios.get('/api/get/choferes');
        setChoferes(choferesResponse.data);
        
        // Realiza una solicitud GET para obtener los contenedores
        const contenedoresResponse = await axios.get('/api/get/contenedores');
        setContenedores(contenedoresResponse.data);

        // Realiza una solicitud GET para obtener los pedidos pendientes
        const pedidosPendientes = await axios.get('/api/get/pedidospendientes');
        setPedidosPendientes(pedidosPendientes.data);

        // Realiza una solicitud GET para obtener los pedidos entregados
        const pedidosEntregados = await axios.get('/api/get/pedidosentregados');
        setPedidosEntregados(pedidosEntregados.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          {/* rate="0.43%" levelUp se pueden agregar */}
        <CardDataStats title="Cantidad contenedores" total={contenedores.length.toString()} rate="">  
          <Image src="/dumpster.png" width="22" height="22" alt="dumpster"/>
        </CardDataStats>
        <CardDataStats title="Cantidad de pedidos entregados (en sitio)" total={pedidosEntregados.length.toString()} rate="">
          <svg
            className="fill-green-400"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
          </svg>
        </CardDataStats>
        <CardDataStats title="Cantidad de pedidos pendientes de entrega" total={pedidosPendientes.length.toString()} rate="" >
          <svg
            className="fill-orange-400"
            width="26"
            height="22"
            viewBox="0 0 26 22"
            fill=""
            xmlns="http://www.w3.org/2000/svg"
          >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
          </svg>
        </CardDataStats>
        <CardDataStats title="Choferes actuales" total={choferes.length.toString()} rate="" >
          <svg
            className="fill-gray-800" 
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
         <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
          </svg>
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />

        <div className="col-span-12 xl:col-span-7">
          <TableOne />
        </div>
      </div>
    </>
  );
};

export default Dashboards;
