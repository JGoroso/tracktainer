'use client'
import React, { useState, useEffect, useRef } from 'react'
import { PencilSquareIcon, EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios'
import UpdatePedidoModal from './UpdatePedidoModal';
import { updateEstadoContenedorDisponible } from '../firebase/firestore/firestore';

function DataPedidosTable({ source, accionFunc }) {
  // Estado para almacenar el filtro seleccionado
  const [filtro, setFiltro] = useState('Todos');
  const [pedidos, setPedidos] = useState(source); // Estado para los pedidos
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false); // Estado para mostrar/ocultar el modal de edición
  const [selectedPedido, setSelectedPedido] = useState(null); // Pedido seleccionado para editar
  const [dataPedidoSelected, setDataPedidoSelected] = useState(null)

  const dropdownRef = useRef(null);


  // Filtrar los pedidos según el estado seleccionado
  const pedidosFiltrados = pedidos && pedidos.filter((pedido) => {
    if (filtro === 'Todos') return true;
    return pedido.estado.toLowerCase() === filtro.toLowerCase();
  });


  const fetchPedidos = async () => {
    try {
      const response = await axios.get('/api/get/pedidos');
      setPedidos(response.data); // Actualiza `pedidos` con los datos obtenidos
    } catch (error) {
      console.error('Error al obtener los pedidos:', error);
    }
  };

  // funcionalidad para pasar el estado de un pedido a cancelado
  const handleCancelClick = async (pedidoId, contenedor) => {
    try {
      await axios.put('/api/put/cancelarpedido', { pedidoId });
      console.log("Pedido cancelado: " + pedidoId);
      updateEstadoContenedorDisponible(contenedor)
      // Actualiza la lista de pedidos después de cancelar
      fetchPedidos();

    } catch (error) {
      console.error('Error al cancelar el pedido:', error);
    }
  };

  // editamos un pedido
  const handleEditClick = async (pedidoId,) => {
    try {
      const response = await axios.get(`/api/get/pedidoinfo?id=${pedidoId}`);
      setDataPedidoSelected(response.data);
      setSelectedPedido(pedidoId);
      setShowEditModal(true);
    } catch (error) {
      console.log("problemas obteniendo el pedido")
    }

  };

  // Efecto para sincronizar `pedidos` con `source` si `source` cambia
  useEffect(() => {
    setPedidos(source);
  }, [source]);

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedPedido(null);
  };



  // use effect para cerrar drowdown apretenado en cualquier lado del componente
  useEffect(() => {
    // Function to handle clicks outside the dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    // Add event listener to detect clicks outside
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
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
              <thead className="bg-gray-100 font-bold uppercase bg-gray-2 rounded-sm ">
                <tr>
                  <th scope="col" className="px-2 py-3.5 text-sm font-medium text-left text-gray-500">Estado</th>
                  <th scope="col" className="px-2 py-3.5 text-sm font-medium text-left text-gray-500">Fecha de entrega</th>
                  <th scope="col" className="px-2 py-3.5 text-sm font-medium text-left text-gray-500">Dirección</th>
                  <th scope="col" className="px-2 py-3.5 text-sm font-medium text-left text-gray-500">Cliente</th>
                  <th scope="col" className="px-4 py-3.5 text-sm font-medium text-left text-gray-500">¿Quién recibe?</th>
                  <th scope="col" className="px-2 py-3.5 text-sm font-medium text-left text-gray-500">Teléfono</th>
                  <th scope="col" className="px-2 py-3.5 text-sm font-medium text-left text-gray-500">Container ID</th>
                  <th scope="col" className="px-2 py-3.5 text-sm font-medium text-left text-gray-500">Chofer</th>
                  <th scope="col" className="px-2 py-3.5 text-sm font-medium text-left text-gray-500">Remito</th>
                  <th scope="col" className="px-2 py-3.5 text-sm font-medium text-left text-gray-500">Acción</th>
                  <th scope="col" className="px-2 py-3.5 text-sm font-medium text-left text-gray-500">Editar</th>
                </tr>
              </thead>

              <tbody className="bg-white ">
                {pedidosFiltrados &&
                  pedidosFiltrados
                    .filter((pedido) => pedido.estado !== 'completado' && pedido.estado !== 'cancelado')
                    .sort((a, b) => {
                      const order = ['pendiente', 'entregado', 'retirar'];
                      return order.indexOf(a.estado) - order.indexOf(b.estado);
                    })
                    .map((pedido) => (
                      <tr key={pedido.id} className="focus:outline-none border-b border-b-neutral-200">
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
                                      : null,
                                pedido.contenedor
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

                        {/* Boton editar/cancelar pedidos */}
                        <td className="px-2 py-4 whitespace-nowrap relative">
                          <button
                            className="flex items-center px-3 py-1 text-sm font-medium bg-gray-500 rounded-lg hover:bg-gray"
                            onClick={() => setOpenDropdown(openDropdown === pedido.id ? null : pedido.id)}

                          >
                            <EllipsisVerticalIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                          </button>

                          {/* Dropdown menu */}
                          {openDropdown === pedido.id && (
                            <div className="absolute right-0 z-10 w-50 mt-2 bg-white border border-gray-200 rounded-md shadow-lg" ref={dropdownRef}>
                              <button
                                className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray"
                                onClick={() => {
                                  handleEditClick(pedido.id, pedido);
                                  setOpenDropdown(null);
                                }}
                              >
                                <PencilSquareIcon className="w-5 h-5 mr-2 text-gray-700" />
                                Editar pedido
                              </button>
                              {pedido && pedido.estado == "pendiente" ?
                                <button
                                  className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray"
                                  onClick={() => {
                                    handleCancelClick(pedido.id, pedido.contenedor);
                                    setOpenDropdown(null);
                                  }}
                                >
                                  <XMarkIcon className="w-5 h-5 mr-2 text-gray-700" />
                                  Cancelar pedido
                                </button>
                                : null}
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                    )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de edición */}
        <UpdatePedidoModal isOpen={showEditModal} onClose={handleCloseModal} pedido={selectedPedido} fetchPedidos={fetchPedidos} dataPedidoSelected={dataPedidoSelected} />
      </div>


    </>
  );
}

export default DataPedidosTable