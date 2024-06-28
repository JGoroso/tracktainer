"use client";
import React from "react";
import {
  getPedidos,
  updateEstadoPedido,
} from "../firebase/firestore/firestore";
import { useAsync } from "../hooks/useAsync";
import { useState } from "react";
import UpdatePedidoForm from "./UpdatePedidoForm";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";
function PedidosTable() {
  const [pedidoId, setPedidoId] = useState("");
  const [estado, setActualEstado] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelAnimation, setCancelAnimation] = useState(false);
  const [showEntregadoAnimation, setEntregadoAnimation] = useState(false);

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
  const { data } = useAsync(getPedidosFromFirestore, refresh);

  // Modal para realizar el update del Chofer
  const closeModal = () => {
    setShowModal(false);
  };

  // button cancelar, muestra modal para confirmar si el pedido pasa estado cancelado y lo quita de la lista
  const handleCancelModalConfirm = () => {
    updateEstadoPedido(pedidoId, "cancelado");
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
  const onEntregado = (pedidoId) => {
    updateEstadoPedido(pedidoId, "entregado");
    setEntregadoAnimation(true);
    setTimeout(() => {
      setEntregadoAnimation(false);
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
      {showEntregadoAnimation && (
        <div className={`alert-box ${showEntregadoAnimation ? "animate" : ""}`}>
          <div className="px-8 py-6 bg-green-400 text-white flex justify-between rounded">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 mr-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <p>Bien! Su pedido ha pasado a estado ENTREGADO!</p>
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
        <div className="sm:flex sm:items-center sm:justify-between">
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

        <div className="flex flex-col mt-6">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 y-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 y-700">
                  <thead className="bg-gray-50 0">
                    <tr>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
                      >
                        Estado
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
                      >
                        Fecha de entrega
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
                      >
                        Direccion
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
                      >
                        Cliente
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
                      >
                        ¿Quien recibe?
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
                      >
                        Telefono
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
                      >
                        Container ID
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
                      >
                        Chofer
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
                      >
                        Entregado
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
                      >
                        Acciones
                      </th>
                      <th scope="col" className="relative py-3.2 px-2">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 y-700 0">
                    {data &&
                      data.map((pedido) => {
                        return pedido.estado === "pendiente" ? (
                          <tr key={pedido.id}>
                            <td className="px-2 py-4 text-sm font-medium whitespace-nowrap">
                              <div
                                className={`inline px-3 py-1 capitalize text-sm font-normal rounded-full ${
                                  pedido.estado == "entregado"
                                    ? "text-emerald-500 gap-x-2 bg-emerald-100/60 0"
                                    : " text-orange-500 gap-x-2 bg-orange-100/60 0"
                                }   `}
                              >
                                {pedido.estado}
                              </div>
                            </td>
                            <td className="px-2 py-4 text-sm whitespace-nowrap">
                              <div>
                                <h4 className="text-gray-700 200">
                                  {pedido.fechaPedido}
                                </h4>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                              <div className="flex items-center">
                                <h4 className="text-gray-700 200">
                                  {pedido.direccion}
                                </h4>
                              </div>
                            </td>

                            <td className="px-2 py-4 text-sm whitespace-nowrap">
                              <div>
                                <h4 className="text-gray-700 200">
                                  {pedido.cliente}
                                </h4>
                              </div>
                            </td>
                            <td className="px-2 py-4 text-sm whitespace-nowrap">
                              <div>
                                <h4 className="text-gray-700 200">
                                  {pedido.recibe}
                                </h4>
                              </div>
                            </td>

                            <td className="px-2 py-4 text-sm whitespace-nowrap">
                              <div>
                                <h4 className="text-gray-700 200">
                                  {pedido.telefono}
                                </h4>
                              </div>
                            </td>

                            <td className="px-2 py-4 text-sm whitespace-nowrap">
                              <div>
                                <h4 className="text-gray-700 200">
                                  {pedido.idContenedor}
                                </h4>
                              </div>
                            </td>

                            <td className="px-2 py-4 text-sm whitespace-nowrap">
                              <div>
                                <h4 className="text-gray-700 200">
                                  {pedido.chofer}
                                </h4>
                              </div>
                            </td>
                            <td>
                              {/* Button Entregado -> Estado de pedido: Entregado */}
                              <div className="flex items-center justify-center">
                                <button
                                  onClick={() => {
                                    onEntregado(pedido.id);
                                  }}
                                  className="flex items-center justify-center px-3 py-1 text-sm tracking-wide text-white transition-colors duration-200 bg-green-500 rounded-lg shrink-0 sm:w-auto hover:bg-green-600"
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fillRule="evenodd"
                                    fill="white"
                                    clipRule="evenodd"
                                  >
                                    <path d="M11 19c0 2.208-1.792 4-4 4s-4-1.792-4-4c0-.345.044-.68.126-1h-1.126v-3h9.92l3.08-10h4.279c.431 0 .812.275.948.684l1.773 5.316 1.337.668c.406.204.663.619.663 1.073v4.259c0 .553-.448 1-1 1h-1.126c.082.32.126.655.126 1 0 2.208-1.792 4-4 4s-4-1.792-4-4h-3zm-4-3c1.656 0 3 1.344 3 3s-1.344 3-3 3-3-1.344-3-3 1.344-3 3-3zm11 0c1.656 0 3 1.344 3 3s-1.344 3-3 3-3-1.344-3-3 1.344-3 3-3zm-11 2c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm11 0c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm1.279-12h-3.541l-3.08 10h-3.013c.59.521 1.026 1.214 1.229 2h3.252c.445-1.724 2.012-3 3.874-3 1.479 0 2.772.805 3.464 2h1.536v-4.259c0-.076-.043-.144-.113-.179l-1.705-.853-1.903-5.709zm-14.924 10h-1.355v1h.536c.218-.376.495-.714.819-1zm6.897-2h-9.252l-2-8h1.734l4.488-4.629c.227-.235.538-.365.86-.365.558 0 .899.354 1.041.6l2.517 4.362.84-2.968h7.52v1h-4.748l-3 10zm1.956-10h-.972l-.849 3h-10.106l1.5 6h7.727l2.7-9zm-6.022 8h-1.057l-1.036-4h.995l1.098 4zm-2.093 0h-1.057l-1.036-4h.995l1.098 4zm4.186 0h-1.057l-1.036-4h.995l1.098 4zm10.609-1h-3.888v-4h2.72l1.168 4zm-1.888-3h-1v2h1.501l-.501-2zm-8.497-2l-2.246-3.894c-.071-.121-.23-.128-.316-.04l-3.814 3.934h6.376z" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                            <td className="px-2 py-4 text-sm whitespace-nowrap">
                              <Menu as="div">
                                <div className="flex items-center justify-center">
                                  <Menu.Button className="relative flex text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
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
                                        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                                      />
                                    </svg>
                                  </Menu.Button>
                                </div>
                                <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-100"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition ease-in duration-75"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95"
                                >
                                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <a
                                          href="#"
                                          className={
                                            (active ? "bg-gray-100" : "",
                                            "block px-4 py-2 text-sm text-gray-700")
                                          }
                                          onClick={() => {
                                            setShowModal(true);
                                            setPedidoId(pedido.id);
                                            setActualEstado(pedido.estado);
                                          }}
                                        >
                                          Editar Chofer
                                        </a>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <a
                                          href="#"
                                          className={
                                            (active ? "bg-gray-100" : "",
                                            "block px-4 py-2 text-sm text-gray-700")
                                          }
                                          onClick={() => {
                                            setShowCancelModal(true),
                                              setPedidoId(pedido.id);
                                          }}
                                        >
                                          Cancelar Pedido
                                        </a>
                                      )}
                                    </Menu.Item>
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            </td>
                          </tr>
                        ) : null;
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
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
