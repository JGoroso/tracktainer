import React, { useState } from 'react'

function DataPedidosTable({ source, accionFunc, setUpdateModal, setCancelModal, setPedido, setNewEstado }) {
  // Estado para almacenar el filtro seleccionado
  const [filtro, setFiltro] = useState('Todos');

  // Filtrar los pedidos según el estado seleccionado
  const pedidosFiltrados = source && source.filter((pedido) => {
    if (filtro === 'Todos') return true;
    return pedido.estado.toLowerCase() === filtro.toLowerCase();
  });
  // const handleAction = (pedido, editAction) => {
  //   if (editAction == "cancelar") {
  //     setCancelModal(true);
  //     setPedido(pedido.id);
  //     setNewEstado(pedido.estado);
  //   } else if (editAction == "update") {
  //     setUpdateModal(true)
  //     setPedido(pedido.id)
  //     setNewEstado(pedido.estado)
  //   }
  // };
  return (
    // <div className="flex flex-col mb-10">
    //   <div className="mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    //     <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
    //       <div className="overflow-hidden border border-gray-200 y-700 md:rounded-lg">
    //         <table className="min-w-full divide-y divide-gray-200 y-700">
    //           <thead className="bg-gray-50 0">
    //             <tr>
    //               <th
    //                 scope="col"
    //                 className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
    //               >
    //                 Estado
    //               </th>
    //               <th
    //                 scope="col"
    //                 className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
    //               >
    //                 Fecha de entrega
    //               </th>
    //               <th
    //                 scope="col"
    //                 className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
    //               >
    //                 Direccion
    //               </th>
    //               <th
    //                 scope="col"
    //                 className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
    //               >
    //                 Cliente
    //               </th>
    //               <th
    //                 scope="col"
    //                 className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
    //               >
    //                 ¿Quien recibe?
    //               </th>
    //               <th
    //                 scope="col"
    //                 className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
    //               >
    //                 Telefono
    //               </th>
    //               <th
    //                 scope="col"
    //                 className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
    //               >
    //                 Container ID
    //               </th>
    //               <th
    //                 scope="col"
    //                 className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
    //               >
    //                 Chofer
    //               </th>
    //               <th
    //                 scope="col"
    //                 className="capitalize py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
    //               >
    //                 Actualizar Pedido
    //                 {nombreSeccion == "entregado" ?
    //                   <>
    //                     <button
    //                       type="button"
    //                       className=" text-blue-500"
    //                       onClick={() => alert('Si el pedido se encuentra entregado podrá pasar a estado a retirar.')}
    //                     >
    //                       <InformationCircleIcon className='w-7 pl-2' />
    //                     </button>

    //                   </> : null}
    //               </th>
    //               <th
    //                 scope="col"
    //                 className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 400"
    //               >
    //                 Acciones
    //               </th>

    //             </tr>
    //           </thead>
    //                     <td className="px-2 py-2 text-sm whitespace-nowrap">

    //                       <Menu as="div">
    //                         <div>
    //                           <Menu.Button className="relative flex text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
    //                             <svg
    //                               xmlns="http://www.w3.org/2000/svg"
    //                               fill="none"
    //                               viewBox="0 0 24 24"
    //                               strokeWidth="1.5"
    //                               stroke="currentColor"
    //                               className="w-6 h-6"
    //                             >
    //                               <path
    //                                 strokeLinecap="round"
    //                                 strokeLinejoin="round"
    //                                 d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
    //                               />
    //                             </svg>
    //                           </Menu.Button>
    //                         </div>
    //                         <Transition
    //                           as={Fragment}
    //                           enter="transition ease-out duration-100"
    //                           enterFrom="transform opacity-0 scale-95"
    //                           enterTo="transform opacity-100 scale-100"
    //                           leave="transition ease-in duration-75"
    //                           leaveFrom="transform opacity-100 scale-100"
    //                           leaveTo="transform opacity-0 scale-95"
    //                         >

    //                           <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
    //                             <Menu.Item>
    //                               {({ active }) => (
    //                                 <a
    //                                   href="#"
    //                                   className={
    //                                     (active ? "bg-gray-100" : "",
    //                                       "block px-4 py-2 text-sm text-gray-700")
    //                                   }
    //                                   onClick={() => {
    //                                     handleAction(pedido, "update")
    //                                   }}
    //                                 >
    //                                   Editar Chofer
    //                                 </a>
    //                               )}
    //                             </Menu.Item>
    //                             <Menu.Item>
    //                               {({ active }) => (
    //                                 <a
    //                                   href="#"
    //                                   className={
    //                                     (active ? "bg-gray-100" : "",
    //                                       "block px-4 py-2 text-sm text-gray-700")
    //                                   }
    //                                   onClick={() => {
    //                                     handleAction(pedido, "cancelar")
    //                                   }}
    //                                 >
    //                                   Cancelar Pedido
    //                                 </a>
    //                               )}
    //                             </Menu.Item>
    //                           </Menu.Items>
    //                         </Transition>
    //                       </Menu>
    //                     </td>
    //                   </tr>
    //                 ) : null;
    //               })}
    //           </tbody>
    //         </table>
    //       </div>
    //     </div>
    //   </div>
    // </div >
    <div className="w-full">
      <div className="bg-white py-4 md:py-7 px-4 md:px-8 overflow-x-auto">
        <div className="flex flex-col sm:items-center sm:gap-4 sm:flex-row">
          <a
            onClick={() => setFiltro('Todos')} className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800">
            <div className={`py-2 sm:px-8 ${filtro === 'Todos' ? 'bg-indigo-100' : ''} text-indigo-700 rounded-full text-center`}>
              <p>Todos</p>
            </div>
          </a>
          <a
            onClick={() => setFiltro('pendiente')} className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-200" >
            <div className="py-2 px-8 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-100 rounded-full text-center">
              <p>Pendientes</p>
            </div>
          </a>
          <a
            onClick={() => setFiltro('entregado')} className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-green-800" >
            <div className="py-2 px-8 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-full text-center">
              <p>Entregados</p>
            </div>
          </a>
          <a
            onClick={() => setFiltro('retirar')} className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-orange-800">
            <div className="py-2 px-8 text-orange-600 hover:text-orange-700 hover:bg-orange-100 rounded-full text-center">
              <p>Retirar</p>
            </div>
          </a>
        </div>


        <div className="mt-7 overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left text-gray-500">Estado</th>
                <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left text-gray-500">Fecha de entrega</th>
                <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left text-gray-500">Dirección</th>
                <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left text-gray-500">Cliente</th>
                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left text-gray-500">¿Quién recibe?</th>
                <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left text-gray-500">Teléfono</th>
                <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left text-gray-500">Container ID</th>
                <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left text-gray-500">Chofer</th>
                <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left text-gray-500">Remito</th>
                <th scope="col" className="px-2 py-3.5 text-sm font-normal text-left text-gray-500">Acción</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {pedidosFiltrados &&
                pedidosFiltrados
                  .filter((pedido) => pedido.estado !== 'completado')
                  .sort((a, b) => {
                    const order = ['pendiente', 'entregado', 'retirar'];
                    return order.indexOf(a.estado) - order.indexOf(b.estado);
                  })
                  .map((pedido) => (
                    <tr key={pedido.id} className="focus:outline-none border-b border-gray-200">
                      <td className="px-2 py-4 whitespace-nowrap">
                        <p className={`text-base font-medium text-left uppercase
                        ${pedido.estado === 'entregado' ? 'text-green-700'
                            : pedido.estado === 'retirar' ? 'text-orange-500'
                              : pedido.estado === 'pendiente' ? 'text-yellow-500'
                                : null}`}>{pedido.estado}</p>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <p className="text-base font-medium text-left text-gray-700">
                          {new Date(pedido.fechaPedido).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <p className="text-base font-medium text-left text-gray-700">{pedido.direccion}</p>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <p className="text-base font-medium text-left text-gray-700">{pedido.cliente}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className="text-base font-medium text-left text-gray-700">{pedido.recibe}</p>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <p className="text-base font-medium text-left text-gray-700">{pedido.telefono}</p>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <p className="text-base font-medium text-left text-gray-700">{pedido.contenedor}</p>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <p className="text-base font-medium text-left text-gray-700">{pedido.chofer}</p>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <p className="text-base font-medium text-left text-gray-700">{pedido.remito}</p>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            accionFunc(
                              pedido.id,
                              pedido.estado === 'pendiente'
                                ? 'entregado'
                                : pedido.estado === 'entregado'
                                  ? 'retirar'
                                  : pedido.estado === 'retirar'
                                    ? 'completado'
                                    : null
                            );
                          }}
                          className={`px-3 py-1 text-sm font-medium text-white rounded-lg ${pedido.estado === 'pendiente'
                            ? 'bg-green-500 hover:bg-green-600'
                            : pedido.estado === 'entregado'
                              ? 'bg-orange-500 hover:bg-orange-600'
                              : pedido.estado === 'retirar'
                                ? 'bg-blue-600 hover:bg-blue-500'
                                : ''
                            }`}
                        >
                          {pedido.estado === 'pendiente'
                            ? 'Entregar'
                            : pedido.estado === 'entregado'
                              ? 'Retirar'
                              : pedido.estado === 'retirar'
                                ? 'Completar'
                                : null}
                        </button>
                      </td>
                    </tr>
                  )
                  )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DataPedidosTable