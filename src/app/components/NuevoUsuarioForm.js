"use client";
import React, { useState } from "react";
import {
  addUsuario,
  getClientes,
  getUsuarios,
  updateEstadoUsuario,
  updateInfoUsuario,
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
import UpdateUsuarioForm from "./UpdateUsuarioForm";
import PedidoGuardadoModal from "./PedidoGuardadoModal";
import ModalCancelado from "./ModalCancelado";

// utilizamos un schema yup para realizar verificaciones
const schema = yup
  .object({
    nombre: yup
      .string()
      .required("El nombre es obligatorio.")
      .matches(/^[aA-zZ\s]+$/, "No se permiten numeros ni simbolos."),
    telefono: yup.number().typeError("El telefono deben ser numeros").positive().integer().required("El telefono es obligatorio, no se permiten letras"),
    email: yup.string().email('Formato de email invalido').required("El email es requerido."),
  })
  .required();

function NuevoUsuarioForm() {
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBajaModal, setShowBajaModal] = useState(false);
  const roles = ["admin", "chofer"];
  const [showGuardadoModal, setShowGuardadoModal] = useState(false);
  const [showModalCancelado, setModalCancelado] = useState(false)
  // Se llama a la funcion getClientes que nos devuelve todos los objetos de la coleccion 'Clientes' en forma de promesa
  const getUsuariosFromFirestore = () => getUsuarios();
  // Utilizamos un hook que hara un async await al que le pasamos una funcion asincrona que retorna una promesa
  // podremos recibir la data utilizando un useEffect (y con el refresh podemos refrescar los datos) y luego utilizar estos datos donde queramos
  const { data } = useAsync(getUsuariosFromFirestore, refresh);

  // add, update, delete
  const onSubmit = (data) => {
    addUsuario(data);
    setShowGuardadoModal(true);
    reset();
    setTimeout(() => {
      setRefresh(!refresh);
      setShowGuardadoModal(false);
    }, 1000);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    reset()
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleBaja = () => {
    updateEstadoUsuario(selectedUser);
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
    updateInfoUsuario(selectedUser, data);
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
                ¿Estás seguro de que deseas dar de baja este usuario?
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

      <div className="sm:flex sm:items-center sm:justify-between p-4">
        <div>
          <div className="flex items-center mt-4 gap-x-3">
            <h2 className="font-medium text-3xl text-gray-800">
              Agregar Usuario
            </h2>
          </div>
        </div>
        <div className="flex items-center mt-4 gap-x-3">
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

      <div className="flex flex-col lg:flex-row gap-8 px-4 sm:px-8 md:px-16 lg:px-24 mt-10">
        <div className="w-full lg:w-1/2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto p-4 shadow-md rounded-lg bg-white"
          >
            <div className="mb-4">
              <label
                htmlFor="nombre"
                className="block text-gray-700 font-bold mb-2"
              >
                Nombre
              </label>
              <input
                id="nombre"
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                })}
                className={`w-full px-3 py-2 border ${errors.nombre ? "border-red-500" : "border-gray-300"} rounded-md`}
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nombre.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="telefono"
                className="block text-gray-700 font-bold mb-2"
              >
                Teléfono
              </label>
              <input
                id="telefono"
                {...register("telefono", {
                  required: "El teléfono es obligatorio",
                })}
                className={`w-full px-3 py-2 border ${errors.telefono ? "border-red-500" : "border-gray-300"} rounded-md`}
              />
              {errors.telefono && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.telefono.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-gray-700 font-bold mb-2"
              >
                Role
              </label>
              <select
                id="role"
                {...register("role", { required: "El role es obligatorio" })}
                className={`w-full px-3 py-2 border ${errors.role ? "border-red-500" : "border-gray-300"} rounded-md`}
              >
                {roles.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
                Correo
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "El formato del correo es inválido",
                  },
                })}
                className={`w-full px-3 py-2 border ${errors.correo ? "border-red-500" : "border-gray-300"} rounded-md`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <input
              type="submit"
              value="Enviar"
              className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300"
            />
          </form>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="p-4 shadow-md rounded-lg bg-white overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nombre
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
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
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
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data &&
                  data.map((user) =>
                    user.estado === "activo" ? (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-100 transition duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.telefono}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold uppercase text-green-500">
                          {user.estado}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                          <button
                            className="btn btn-warning btn-sm flex flex-row items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                            onClick={() => handleEdit(user)}
                          >
                            <PencilSquareIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                            Editar
                          </button>
                          <button
                            className="btn btn-error btn-sm flex flex-row items-center px-4 py-2 bg-red-500 text-white bg-black rounded-md hover:bg-red-600 transition duration-300"
                            onClick={() => {
                              setShowBajaModal(true), setSelectedUser(user.id);
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
                    ) : null
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <UpdateUsuarioForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
        onSave={handleSave}
        register={register}
        setValue={setValue}
        handleSubmit={handleSubmit}
        errors={errors}
      />

      <PedidoGuardadoModal
        show={showGuardadoModal}
        message={"Usuario guardado"}
      />
      <ModalCancelado
        show={showModalCancelado}
        message={"Usuario eliminado"}
      />
    </>
  );
}

export default NuevoUsuarioForm;
