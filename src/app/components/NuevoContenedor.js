'use client'
import React, { useState } from 'react'
import { addContenedor, getAllContenedores, updateEstadoContenedor } from '../firebase/firestore/firestore'
import { useAsync } from '../hooks/useAsync'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { PencilSquareIcon } from '@heroicons/react/20/solid'
import UpdateContenedorForm from './UpdateContenedorForm'
import PedidoGuardadoModal from './PedidoGuardadoModal'


function NuevoContenedor() {

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset
  } = useForm()
  const [refresh, setRefresh] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContenedor, setSelectedContenedor] = useState(null);
  const [showPedidoGuardadoModal, setShowPedidoGuardadoModal] = useState(false)


  // Se llama a la funcion getClientes que nos devuelve todos los objetos de la coleccion 'Clientes' en forma de promesa
  const getContenedoresFromFirestore = () => getAllContenedores()
  // Utilizamos un hook que hara un async await al que le pasamos una funcion asincrona que retorna una promesa
  // podremos recibir la data utilizando un useEffect (y con el refresh podemos refrescar los datos) y luego utilizar estos datos donde queramos
  const { data } = useAsync(getContenedoresFromFirestore, refresh)


  // add, update, delete
  const onSubmit = () => {
    addContenedor()
    setShowPedidoGuardadoModal(true)
    reset()
    setTimeout(() => {
      setShowPedidoGuardadoModal(false)
      setRefresh(!refresh)
    }, 1000)
  }

  const handleEdit = (contenedor) => {
    setSelectedContenedor(contenedor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContenedor(null);
  };

  const handleSave = (data) => {
    updateEstadoContenedor(selectedContenedor, data)

    setShowPedidoGuardadoModal(true)
    setTimeout(() => {
      setShowPedidoGuardadoModal(false)
      handleCloseModal();
      reset()
      setRefresh(!refresh)
    }, 1000)
  };

  return (

    <>
      <div className="sm:flex sm:items-center sm:justify-between p-4">
        <div>
          <div className="flex items-center mt-4 gap-x-3">
            <h2 className="font-medium text-3xl text-gray-800">Agregar Contenedor</h2>
          </div>
          
        </div>
        <div className="flex items-center mt-4 gap-x-3">
          <Link href={"/"}>
            <button className="flex items-center justify-center w-full px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>Volver al mapa</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col px-4 lg:px-16">
        <div className="w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 shadow-lg rounded-lg bg-white border border-gray-200">
            <input
              type="submit"
              value="Crear Nuevo Contenedor"
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            />
          </form>
        </div>
        <div className="card border border-gray-200 bg-white p-6 shadow-xl mt-8 rounded-lg sm:w-full">
          <div id="secondbox" className="overflow-auto md:overflow-visible md:w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numero Contenedor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data && data
                  .sort((a, b) => {
                    if (a.estado === 'disponible' && b.estado !== 'disponible') return -1;
                    if (a.estado !== 'disponible' && b.estado === 'disponible') return 1;
                    if (a.estado === 'ocupado' && b.estado !== 'ocupado') return -1;
                    if (a.estado !== 'ocupado' && b.estado === 'ocupado') return 1;
                    return 0;
                  })
                  .map((contenedor) => (
                    <tr key={contenedor.id} className="hover:bg-gray-100 transition duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {contenedor.numero}
                      </td>
                      <td className={`px-6 py-4 uppercase whitespace-nowrap text-sm ${contenedor.estado === 'disponible' ? 'text-green-500' :
                        contenedor.estado === 'roto' ? 'text-red' : contenedor.estado === 'ocupado' ? "text-graydark" : null}`}>
                        {contenedor.estado}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                        <button
                          className="flex flex-row items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                          onClick={() => handleEdit(contenedor)}
                        >
                          <PencilSquareIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>



      <UpdateContenedorForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedContenedor}
        onSave={handleSave}
        register={register}
        setValue={setValue}
        handleSubmit={handleSubmit}
        errors={errors}
      />
      <PedidoGuardadoModal show={showPedidoGuardadoModal} message={"Contenedor guardado"} />
    </>
  );
};


export default NuevoContenedor