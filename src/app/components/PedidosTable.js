"use client";
import React from "react";
import {
  getPedidos,
  updateEstadoContenedorDisponible,
  updateEstadoPedido,
} from "../firebase/firestore/firestore";
import { useAsync } from "../hooks/useAsync";
import { useState } from "react";
import UpdatePedidoForm from "./UpdatePedidoForm";
import DataPedidosTable from "./DataPedidosTable";
import Link from "next/link";
function PedidosTable() {
  const [pedidoId, setPedidoId] = useState("");
  const [contenedorNumero, setContenedorNumero] = useState("")
  const [estado, setActualEstado] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelAnimation, setCancelAnimation] = useState(false);
  const [showAnimation, setAnimation] = useState(false);
  const [accionAnimation, setAccionAnimation] = useState("");

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
  const { data: dataPedidos, error: error } = useAsync(getPedidosFromFirestore, refresh);

  // Modal para realizar el update del Chofer
  const closeModal = () => {
    setShowModal(false);
  };

  // button cancelar, muestra modal para confirmar si el pedido pasa estado cancelado y lo quita de la lista
  const handleCancelModalConfirm = () => {
    updateEstadoPedido(pedidoId, "cancelado");
    updateEstadoContenedorDisponible(contenedorNumero)
    setShowCancelModal(false);
    setCancelAnimation(true);
    setTimeout(() => {
      setCancelAnimation(false);
    }, 3000);
    refreshContainers();
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
  };

  // button entregado, cambia el estado a cencelado y lo quita de la lista
  const onAccion = (pedidoId, accion) => {
    updateEstadoPedido(pedidoId, accion);
    setAccionAnimation(accion)
    setAnimation(true);
    setAccionAnimation(accion)
    setTimeout(() => {
      setAnimation(false);
    }, 3000);
    refreshContainers();
  };

  return (
    <>
      {/* Seteamos animaciones para los estados del pedido cancel*/}
      {showCancelAnimation && (
        <div className={`alert-box ${showCancelAnimation ? "animate" : ""}`}>
          <div className="px-8 py-6 bg-red-400 text-white flex justify-between rounded">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 mr-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <p>El pedido ha pasado a estado CANCELADO!</p>
            </div>
            <button className="text-green-100 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Seteamos animaciones para los estados del pedido cancel*/}
      {showAnimation && (
        <div className={`alert-box ${showAnimation ? "animate" : ""}`}>
          <div className={`px-8 py-6 ${accionAnimation === "entregado" ? 'bg-green-400' : 'bg-orange-400'} text-white flex justify-between rounded`}>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 mr-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>

              <p>Bien! Su pedido ha pasado a estado {accionAnimation === "entregado" ? "ENTREGADO!" : "RETIRAR!"}</p>
            </div>
            <button className="text-green-100 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación de cancelación */}
      {showCancelModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white fixed p-8 rounded shadow-md">
              <p className="mb-4">
                ¿Estás seguro de que deseas cancelar el pedido?
              </p>
              <div className="flex justify-end">
                <button
                  className="mr-4 text-red-500 hover:text-red-700"
                  onClick={handleCancelModalConfirm}
                >
                  Sí, cancelar
                </button>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleCancelModalClose}
                >
                  No, mantener
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 mx-auto">
        <div className="sm:flex  mb-10 sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-x-3">
              <h2 className="font-medium text-xl text-gray-800 ">Pedidos</h2>
            </div>
            <p className="mt-1 text-sm text-gray-800 ">
              En esta sección se encontraran los pedidos pendientes y entregados
            </p>
          </div>

          <div className="flex items-center mt-4 gap-x-3">
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
              <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 lue-500 0">
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

        <h3 className={"inline mt-10 px-3 py-1 capitalize text-sm font-normal rounded-full text-yellow-500 gap-x-2 bg-yellow-100/60"} >Pedidos pendientes</h3>
        <DataPedidosTable source={dataPedidos} estado="pendiente" accion="entregado" accionFunc={onAccion} setUpdateModal={setShowModal} setCancelModal={setShowCancelModal} setPedido={setPedidoId} setNewEstado={setActualEstado} />
        <h3 className={"inline px-3 py-1 capitalize text-sm font-normal rounded-full text-green-500 gap-x-2 bg-green-100/60"} >Pedidos entregados</h3>
        <DataPedidosTable source={dataPedidos} estado="entregado" accion="retirar" accionFunc={onAccion} setUpdateModal={setShowModal} setCancelModal={setShowCancelModal} setPedido={setPedidoId} setNewEstado={setActualEstado} />

        {showModal ? (
          <UpdatePedidoForm
            closeModal={closeModal}
            pedidoId={pedidoId}
            actualEstado={estado}
            refresh={refreshContainers}
          />
        ) : null}
      </div>
    </>
  );
}

export default PedidosTable;
