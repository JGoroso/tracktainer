'use client'
import React from 'react'
import { deleteContainer, getContainers } from '../firebase/firestore/firestore'
import { useAsync } from '../hooks/useAsync'
import { useState } from 'react'
import UpdateForm from './UpdateForm'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Link from 'next/link'
function PedidosTable() {
  const [elementId, setElementId] = useState("")
  const [estado, setActualEstado] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [refresh, setRefresh] = useState(false)


  const refreshConteiners = () => {
    setRefresh(true)
    setTimeout(() => {
      setRefresh(false)
    }, 3000);

  }

  // Se llama a la funcion getContainers que nos devuelve todos los objetos de la coleccion 'Pedidos' en forma de promesa
  const getContainersFromFirestore = () => getContainers()
  // Utilizamos un hook creado por nosotros que nos permite pasarle esta promesa que contiene un array de todos los objetos y con esta
  // podremos recibir la data utilizando un useEffect y luego utilizar estos datos donde queramos
  const { data } = useAsync(getContainersFromFirestore, refresh)

  const closeModal = () => {
    setShowModal(false);
  };



  return (
    <div className="px-4 mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="font-medium text-xl text-gray-800 ">Pedidos</h2>
          </div>
          <p className="mt-1 text-sm text-gray-800 ">En esta sección se encontraran los pedidos pendientes y entregados</p>
        </div>

        <div className="flex items-center mt-4 gap-x-3">
          <Link href={"/"}>
            <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto ray-800 0 hover:bg-gray-100 200 y-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>Volver al mapa</span>
            </button>
          </Link>
          <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 lue-500 0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <span>Agregar Pedido</span>
          </button>
        </div>
      </div>



      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 y-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 y-700">
                <thead className="bg-gray-50 0">
                  <tr>
                    <th scope="col" className="py-3.5 px-2 text-sm font-normal text-left rtl:text-right text-gray-500 400">
                      <button className="flex items-center gap-x-4 focus:outline-none">
                        <span>IdPedido</span>

                        <svg className="h-3" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
                          <path d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z" fill="currentColor" stroke="currentColor" strokeWidth="0.1" />
                          <path d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z" fill="currentColor" stroke="currentColor" strokeWidth="0.3" />
                        </svg>
                      </button>
                    </th>

                    <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400">Estado</th>
                    <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400">Fecha de entrega</th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400">Direccion</th>
                    <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400">Cliente</th>
                    <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400">¿Quien recibe?</th>
                    <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400">Telefono</th>
                    <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400">Container ID</th>
                    <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400">Chofer</th>

                    <th scope="col" className="relative py-3.2 px-2">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 y-700 0">
                  {data && data.map((element) =>
                    <tr key={element.id}>
                      <td className="px-2 py-3.5 text-sm font-medium whitespace-nowrap">
                        <div>
                          <h2 className="font-medium text-gray-800  ">{element.id}</h2>
                        </div>
                      </td>
                      <td className="px-2 py-4 text-sm font-medium whitespace-nowrap">
                        <div className={`inline px-3 py-1 capitalize text-sm font-normal rounded-full ${element.estado == 'entregado' ? 'text-emerald-500 gap-x-2 bg-emerald-100/60 0' : ' text-orange-500 gap-x-2 bg-orange-100/60 0'}   `}>
                          {element.estado}
                        </div>
                      </td>
                      <td className="px-2 py-4 text-sm whitespace-nowrap">
                        <div>
                          <h4 className="text-gray-700 200">{element.fechaPedido}</h4>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center">
                          <h4 className="text-gray-700 200">{element.direccion.split(',')[0]}</h4>
                        </div>
                        <h4 className="text-gray-700 200">Córdoba</h4>
                      </td>

                      <td className="px-2 py-4 text-sm whitespace-nowrap">
                        <div>
                          <h4 className="text-gray-700 200">{element.cliente}</h4>
                        </div>
                      </td>
                      <td className="px-2 py-4 text-sm whitespace-nowrap">
                        <div>
                          <h4 className="text-gray-700 200">{element.nombreCliente}</h4>
                        </div>
                      </td>

                      <td className="px-2 py-4 text-sm whitespace-nowrap">
                        <div>
                          <h4 className="text-gray-700 200">{element.telefono}</h4>
                        </div>
                      </td>

                      <td className="px-2 py-4 text-sm whitespace-nowrap">
                        <div>
                          <h4 className="text-gray-700 200">{element.idContenedor}</h4>
                        </div>
                      </td>

                      <td className="px-2 py-4 text-sm whitespace-nowrap">
                        <div>
                          <h4 className="text-gray-700 200">{element.chofer}</h4>
                        </div>
                      </td>
                      <td className="px-2 py-4 text-sm whitespace-nowrap">
                        <Menu as="div" >
                          <div>
                            <Menu.Button className="relative flex text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
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
                                    className={(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                    onClick={() => { setShowModal(true); setElementId(element.id); setActualEstado(element.estado) }}
                                  >
                                    Editar
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                    onClick={active ? deleteContainer(element.id) : null}
                                  >
                                    Borrar Contenedor
                                  </a>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showModal ? <UpdateForm closeModal={closeModal} elementId={elementId} actualEstado={estado} refresh={refreshConteiners} /> : null}
    </div >

  )
}

export default PedidosTable