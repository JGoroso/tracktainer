"use client";
import React from "react";
import {
  getPedidos,
  updateRemitoPedido,
  updateEstadoPedido,
  updateEstadoContenedorOcupado,
  updateEstadoContenedorDisponible,
} from "../firebase/firestore/firestore";
import { useAsync } from "../hooks/useAsync";
import { useState } from "react";
import DataPedidosTable from "./DataPedidosTable";
import Link from "next/link";
import RemitoModal from "./RemitoModal";
import PedidoGuardadoModal from "./PedidoGuardadoModal";


function PedidosTable() {
  const [refresh, setRefresh] = useState(false);
  const [showModalRemito, setShowModalRemito] = useState(false)
  const [selected, setSelected] = useState(null)
  const [proximoEstado, setProximoEstado] = useState("")
  const [showPedidoGuardadoModal, setPedidoGuardadoModal] = useState(false);

  const refreshContainers = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1500);
  };

  // Se llama a la funcion getPedidos que nos devuelve todos los objetos de la coleccion 'Pedidos' en forma de promesa
  const getPedidosFromFirestore = () => getPedidos();
  // Utilizamos un hook que hara un async await al que le pasamos una funcion asincrona que retorna una promesa (get pedidos from firestore)
  // podremos recibir la data utilizando un useEffect (y con el refresh podemos refrescar los datos) y luego utilizar estos datos donde queramos
  const { data: dataPedidos, error: error } = useAsync(
    getPedidosFromFirestore,
    refresh
  );

  // button entregado.
  const onAccion = (pedidoId, ProximoEstado, contenedor) => {
    setProximoEstado(ProximoEstado)
    if (ProximoEstado == "entregado") {
      setSelected(pedidoId)
      setShowModalRemito(true)
    } else {
      if (ProximoEstado == "completado") {
        updateEstadoContenedorDisponible(contenedor)
      }
      updateEstadoPedido(pedidoId, ProximoEstado);
      setPedidoGuardadoModal(true)
      setTimeout(async () => {
        setPedidoGuardadoModal(false)
      }, 1000);
      refreshContainers();

    }
  };

  const handleGuardarRemito = (nroRemito) => {
    if (nroRemito) {
      // entregado es el proximo estado luego de pendiente
      updateEstadoPedido(selected, "entregado")
      updateRemitoPedido(selected, nroRemito)
      setShowModalRemito(false)
      setPedidoGuardadoModal(true)
      setTimeout(() => {
        setSelected(null)
        setRefresh(!refresh)
        setPedidoGuardadoModal(false)
      }, 1500)
    } else {
      alert("Inserte nro remito")
    }
  };

  return (
    <>
      



      <div className="px-4 pt-4 mx-auto">
        <div className="sm:flex  mb-10 sm:items-center sm:justify-between">
          <div>
            <div className="flex items-bottom mt-2 gap-x-3">
              <h2 className="font-medium text-3xl text-gray-800 ">Pedidos</h2>
            </div>
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
              <button className="flex items-center justify-center w-full sm:w-auto px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-yellow-400 rounded-lg gap-x-2 hover:bg-yellow-500">
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

        <DataPedidosTable source={dataPedidos} accionFunc={onAccion} />
        <RemitoModal show={showModalRemito} onClose={() => setShowModalRemito(false)} onSave={handleGuardarRemito} />
        {/* Modal de edición */}
        <PedidoGuardadoModal
          show={showPedidoGuardadoModal}
          message={(
            <span>
              Su pedido ha cambiado de estado con éxito a{' '}
              <span className={
                proximoEstado == 'entregado' ? 'text-green-important' :
                  proximoEstado == 'retirar' ? 'text-orange-important' :
                    proximoEstado == 'completado' ? 'text-blue-important' : 'text-black-important'
              }>
                {proximoEstado.toUpperCase()}
              </span>
            </span>
          )}
        />
      </div >
    </>
  );
}

export default PedidosTable;
