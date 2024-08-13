import React from 'react'
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { InformationCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline'


function DataPedidosTable({ source, nombreSeccion, proximoEstado, accionFunc, setUpdateModal, setCancelModal, setPedido, setNewEstado }) {
  const handleAction = (pedido, editAction) => {
    if (editAction == "cancelar") {
      setCancelModal(true);
      setPedido(pedido.id);
      setNewEstado(pedido.estado);
    } else if (editAction == "update") {
      setUpdateModal(true)
      setPedido(pedido.id)
      setNewEstado(pedido.estado)
    }
  };
  return (
    <div className="flex flex-col mb-10">
      <div className="mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                    className="capitalize py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
                  >
                    Actualizar Pedido
                    {nombreSeccion == "entregado" ?
                      <>
                        <button
                          type="button"
                          className=" text-blue-500"
                          onClick={() => alert('Si el pedido se encuentra entregado podrá pasar a estado a retirar.')}
                        >
                          <InformationCircleIcon className='w-7 pl-2' />
                        </button>

                      </> : null}
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
                  >
                    Acciones
                  </th>

                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 y-700 0">
                {source &&
                  source.map((pedido) => {
                    return pedido.estado === nombreSeccion ? (
                      <tr key={pedido.id}>
                        <td className="px-2 py-4 text-sm font-medium whitespace-nowrap">
                          <div
                            className={`inline px-3 py-1 capitalize text-sm font-normal rounded-full ${pedido.estado == "entregado"
                              ? "text-emerald-500 gap-x-2 bg-emerald-100/60 0"
                              : " text-yellow-500 gap-x-2 bg-yellow-100/60 0"
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
                              {pedido.contenedor}
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




                          <div className="px-2 py-4 text-sm whitespace-nowrap">
                            <button
                              onClick={() => {
                                accionFunc(pedido.id, proximoEstado);
                              }}
                              className={`px-3 py-1 text-sm tracking-wide text-white transition-colors duration-200 rounded-lg shrink-0 sm:w-auto ${nombreSeccion === 'pendiente' ? 'bg-green-500 hover:bg-green-600' : nombreSeccion === "entregado"
                                ? 'bg-orange-500 hover:bg-orange-600'
                                : nombreSeccion === "retirar" ?
                                  'bg-blue-600 hover:bg-blue-500'
                                  : null
                                }`}
                            >
                              {nombreSeccion === "pendiente" ? "Entregar" : nombreSeccion === "entregado" ? "Retirar" : "Completar"}
                            </button>
                          </div>
                        </td>
                        <td className="px-2 py-2 text-sm whitespace-nowrap">

                          <Menu as="div">
                            <div>
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
                                        handleAction(pedido, "update")
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
                                        handleAction(pedido, "cancelar")
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
    </div >

  )
}

export default DataPedidosTable