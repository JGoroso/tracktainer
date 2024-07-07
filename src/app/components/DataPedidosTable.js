import React from 'react'
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { InformationCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline'


function DataPedidosTable({ source, estado, accion, accionFunc, setUpdateModal, setCancelModal, setPedido, setNewEstado }) {
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
                    {accion}?
                    {accion == "retirar" ? <>

                      <button
                        type="button"
                        className=" text-blue-500"
                        onClick={() => alert('Retirar permite avisarle al chofer que debe vaciar el contenedor y dar por completado el pedido desde el mapa.')}
                      >
                        <InformationCircleIcon className='w-7 pl-2' />
                      </button></> : null}
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
                    return pedido.estado === estado ? (
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




                          <div className="ml-2">
                            <button
                              onClick={() => {
                                accionFunc(pedido.id, accion);
                              }}
                              className={`px-3 py-1 text-sm tracking-wide text-white transition-colors duration-200 rounded-lg shrink-0 sm:w-auto ${accion === 'retirar' ? 'bg-orange-500 hover:bg-orange-600' :
                                accion === 'completado' ? 'bg-blue-500 hover:bg-blue-600' :
                                  'bg-green-500 hover:bg-green-600'
                                }`}
                            >
                              <svg
                                width="24"
                                height="24"
                                xmlns="http://www.w3.org/2000/svg"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              >
                                <path fill="white" d="M11 19c0 2.208-1.792 4-4 4s-4-1.792-4-4c0-.345.044-.68.126-1h-1.126v-3h9.92l3.08-10h4.279c.431 0 .812.275.948.684l1.773 5.316 1.337.668c.406.204.663.619.663 1.073v4.259c0 .553-.448 1-1 1h-1.126c.082.32.126.655.126 1 0 2.208-1.792 4-4 4s-4-1.792-4-4h-3zm-4-3c1.656 0 3 1.344 3 3s-1.344 3-3 3-3-1.344-3-3 1.344-3 3-3zm11 0c1.656 0 3 1.344 3 3s-1.344 3-3 3-3-1.344-3-3 1.344-3 3-3zm-11 2c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm11 0c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm1.279-12h-3.541l-3.08 10h-3.013c.59.521 1.026 1.214 1.229 2h3.252c.445-1.724 2.012-3 3.874-3 1.479 0 2.772.805 3.464 2h1.536v-4.259c0-.076-.043-.144-.113-.179l-1.705-.853-1.903-5.709zm-14.924 10h-1.355v1h.536c.218-.376.495-.714.819-1zm6.897-2h-9.252l-2-8h1.734l4.488-4.629c.227-.235.538-.365.86-.365.558 0 .899.354 1.041.6l2.517 4.362.84-2.968h7.52v1h-4.748l-3 10zm1.956-10h-.972l-.849 3h-10.106l1.5 6h7.727l2.7-9zm-6.022 8h-1.057l-1.036-4h.995l1.098 4zm-2.093 0h-1.057l-1.036-4h.995l1.098 4zm4.186 0h-1.057l-1.036-4h.995l1.098 4zm10.609-1h-3.888v-4h2.72l1.168 4zm-1.888-3h-1v2h1.501l-.501-2zm-8.497-2l-2.246-3.894c-.071-.121-.23-.128-.316-.04l-3.814 3.934h6.376z" />
                              </svg>
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