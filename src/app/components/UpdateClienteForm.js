import React, { useEffect, useState } from "react";
import PedidoGuardadoModal from "./PedidoGuardadoModal";

function UpdateClienteForm({
  isOpen,
  onClose,
  user,
  onSave,
  register,
  setValue,
  handleSubmit,
  errors,
}) {
  useEffect(
    () => {
      if (user) {
        setValue("nombreEmpresa", user.empresa);
        setValue("nombreCompleto", user.referente);
        setValue("telefono", user.telefono);
        setValue("cuit", user.cuit);
      }
    },
    [user, setValue],
    setTimeout(async () => {
      setShowGuardadoModal(false);
    }, 1500)
  );
  const [showGuardadoModal, setShowGuardadoModal] = useState(false);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Cliente</h2>
        <form onSubmit={handleSubmit(onSave)}>
          <div className="mb-4">
            <label
              htmlFor="edit-nombreEmpresa"
              className="block text-gray-700 font-bold mb-2"
            >
              Empresa
            </label>
            <input
              id="edit-nombreEmpresa"
              {...register("nombreEmpresa", {
                required: "El nombre de la empresa es obligatorio",
              })}
              className={`w-full px-3 py-2 border ${errors.nombreEmpresa ? "border-red-500" : "border-gray-300"} rounded-md`}
            />
            {errors.nombreEmpresa && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nombreEmpresa.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="edit-nombreCompleto"
              className="block text-gray-700 font-bold mb-2"
            >
              Nombre y apellido
            </label>
            <input
              id="edit-nombreCompleto"
              {...register("nombreCompleto", {
                required: "El nombre de la empresa es es obligatorio",
              })}
              className={`w-full px-3 py-2 border ${errors.nombreCompleto ? "border-red-500" : "border-gray-300"} rounded-md`}
            />
            {errors.nombreCompleto && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nombreCompleto.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="edit-telefono"
              className="block text-gray-700 font-bold mb-2"
            >
              Teléfono
            </label>
            <input
              id="edit-telefono"
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
              htmlFor="edit-cuit"
              className="block text-gray-700 font-bold mb-2"
            >
              CUIT
            </label>
            <input
              id="edit-cuit"
              {...register("cuit", {
                required: "El cuit es obligatorio",
              })}
              className={`w-full px-3 py-2 border ${errors.cuit ? "border-red-500" : "border-gray-300"} rounded-md`}
            />
            {errors.cuit && (
              <p className="text-red-500 text-sm mt-1">{errors.cuit.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2  text-gray-700 border rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-400 text-white border rounded-md hover:bg-yellow-500"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
      <PedidoGuardadoModal
        show={showGuardadoModal}
        message={"Cliente guardado"}
      />
    </div>
  );
}

export default UpdateClienteForm;
