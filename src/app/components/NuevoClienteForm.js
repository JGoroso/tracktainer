"use client";
import React, { useState } from "react";
import {
  addCliente,
  getClientes,
  updateEstadoCliente,
  updateInfoCliente,
} from "../firebase/firestore/firestore";
import { useAsync } from "../hooks/useAsync";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  ArchiveBoxXMarkIcon,
  PencilSquareIcon,
} from "@heroicons/react/20/solid";
import UpdateClienteForm from "./UpdateClienteForm";
import PedidoGuardadoModal from "./PedidoGuardadoModal";
import ModalCancelado from "./ModalCancelado";

// utilizamos un schema yup para realizar verificaciones
const schema = yup
  .object({
    nombreEmpresa: yup
      .string()
      .required("El nombre de la empresa es obligatorio")
      .matches(/^[aA-zZ\s]+$/, "No se permiten numeros ni simbolos"),
    nombreCompleto: yup
      .string()
      .required("El nombre del referente es obligatorio")
      .matches(/^[aA-zZ\s]+$/, "No se permiten numeros ni simbolos"),
    telefono: yup
      .number()
      .positive()
      .integer()
      .required("El telefono es obligatorio, no se permiten letras"),
    cuit: yup
      .number()
      .positive()
      .integer()
      .required("El CUIT es obligatorio, no se permiten letras"),
  })
  .required();

function NuevoClienteForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showBajaModal, setShowBajaModal] = useState(false);
  const [showGuardadoModal, setShowGuardadoModal] = useState(false);
  const [showModalCancelado, setModalCancelado] = useState(false)
  // Se llama a la funcion getClientes que nos devuelve todos los objetos de la coleccion 'Clientes' en forma de promesa
  const getClientesFromFirestore = () => getClientes();
  // Utilizamos un hook que hara un async await al que le pasamos una funcion asincrona que retorna una promesa
  // podremos recibir la data utilizando un useEffect (y con el refresh podemos refrescar los datos) y luego utilizar estos datos donde queramos
  const { data } = useAsync(getClientesFromFirestore, refresh);

  // add, update, delete
  const onSubmit = (data) => {
    addCliente(data);
    setShowGuardadoModal(true);
    reset();
    setTimeout(() => {
      setRefresh(!refresh);
      setShowGuardadoModal(false);
    }, 1000);
  };

  const handleEdit = (user) => {
    setSelectedCliente(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    reset()
    setIsModalOpen(false);
    setSelectedCliente(null);
  };

  const handleBaja = () => {
    updateEstadoCliente(selectedCliente);
    setShowBajaModal(false);
    setModalCancelado(true)
    setTimeout(() => {
      setRefresh(!refresh);
      setModalCancelado(false)
    }, 1000);
  };

  const handleBajaModalClose = () => {
    setShowBajaModal(false);
  };

  const handleSave = (data) => {
    updateInfoCliente(selectedCliente, data);
    handleCloseModal();
    setShowGuardadoModal(true);
    reset();
    setTimeout(() => {
      setRefresh(!refresh);
      setShowGuardadoModal(false);
    }, 1000);
  };
  return (
    <>
      {/* Modal de confirmación de cancelación */}
      {showBajaModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white fixed p-8 rounded shadow-md">
              <p className="mb-4">
                ¿Estás seguro de que deseas dar de baja este cliente?
              </p>
              <div className="flex justify-end">
                <button
                  className="mr-4 text-red-500 hover:text-red-700"
                  onClick={handleBaja}
                >
                  Sí, dar de baja
                </button>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleBajaModalClose}
                >
                  No, mantener
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="sm:flex sm:justify-between p-4">
        <div>
          <div className="flex items-center mt-4 ml-20 ">
            <h2 className="font-medium text-3xl text-gray-800">
              Agregar Cliente
            </h2>
          </div>
        </div>

        <div className="flex items-center mt-4 mr-15">
          <Link href={"/"}>
            <button className="flex items-center justify-center w-full px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100">
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
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-4 px-1 lg:px-16 mt-10">
        <div className="w-full ">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto p-6 shadow-lg rounded-lg bg-white border border-gray-200"
          >
            <div className="mb-6">
              <label
                htmlFor="nombreEmpresa"
                className="block text-gray-700 font-semibold mb-2"
              >
                Empresa
              </label>
              <input
                id="nombreEmpresa"
                {...register("nombreEmpresa", {
                  required: "El nombre de la empresa es obligatorio",
                })}
                className={`w-full px-4 py-2 border ${errors.nombre ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.nombreEmpresa && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nombreEmpresa.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="nombreCompleto"
                className="block text-gray-700 font-semibold mb-2"
              >
                Nombre y apellido
              </label>
              <input
                id="nombreCompleto"
                {...register("nombreCompleto", {
                  required:
                    "El nombre del referente de la empresa es obligatorio",
                })}
                className={`w-full px-4 py-2 border ${errors.nombre ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.nombreCompleto && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nombreCompleto.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="telefono"
                className="block text-gray-700 font-semibold mb-2"
              >
                Teléfono
              </label>
              <input
                id="telefono"
                {...register("telefono", {
                  required: "El teléfono es obligatorio",
                })}
                className={`w-full px-4 py-2 border ${errors.telefono ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.telefono && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.telefono.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="telefono"
                className="block text-gray-700 font-semibold mb-2"
              >
                CUIT
              </label>
              <input
                id="cuit"
                {...register("cuit", {
                  required: "El cuit es obligatorio",
                })}
                className={`w-full px-4 py-2 border ${errors.cuit ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.cuit && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cuit.message}
                </p>
              )}
            </div>

            <input
              type="submit"
              value="Enviar"
              className="w-full bg-yellow-400 text-white font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition duration-300"
            />
          </form>
        </div>
        <div className="card border border-gray-200 bg-white p-6 shadow-xl mt-8 lg:mt-0  rounded-lg">
          <div id="secondbox" className="overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Empresa
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Referente
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Teléfono
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cuit
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data &&
                  data.map((cliente) =>
                  (
                    <tr
                      key={cliente.id}
                      className="hover:bg-gray-100 transition duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cliente.empresa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cliente.referente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold uppercase text-green-500">
                        {cliente.estado}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold uppercase text-gray-500">
                        {cliente.telefono}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold uppercase text-gray-500">
                        {cliente.cuit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
                        <button
                          className="btn btn-warning btn-sm flex flex-row items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                          onClick={() => handleEdit(cliente)}
                        >
                          <PencilSquareIcon
                            className="h-5 w-5 mr-2"
                            aria-hidden="true"
                          />
                          Editar
                        </button>
                        <button
                          className="btn btn-error btn-sm flex flex-row items-center px-4 py-2 bg-red-500 text-white bg-black rounded-md hover:bg-red-600 transition duration-300"
                          onClick={() => {
                            setShowBajaModal(true),
                              setSelectedCliente(cliente.id);
                          }}
                        >
                          <ArchiveBoxXMarkIcon
                            className="h-5 w-5 mr-2"
                            aria-hidden="true"
                          />
                          Baja
                        </button>
                      </td>
                    </tr>
                  ), null
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <UpdateClienteForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedCliente}
        onSave={handleSave}
        register={register}
        setValue={setValue}
        handleSubmit={handleSubmit}
        errors={errors}
      />

      <PedidoGuardadoModal
        show={showGuardadoModal}
        message={"Cliente registrado"}
      />

      <ModalCancelado
        show={showModalCancelado}
        message={"Cliente eliminado"}
      />
    </>
  );
}

export default NuevoClienteForm;
