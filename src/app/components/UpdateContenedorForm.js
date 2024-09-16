import React, { useEffect, useState } from "react";
import PedidoGuardadoModal from "./PedidoGuardadoModal";

function UpdateContenedorForm({
  isOpen,
  onClose,
  contenedor,
  onSave,
  register,
  setValue,
  handleSubmit,
  errors,
}) {
  useEffect(() => {
    if (contenedor) {
      setValue("nombreEmpresa", contenedor.empresa);
    }
  }, [contenedor, setValue]);
  const [showGuardadoModal, setShowGuardadoModal] = useState(false);
  setTimeout(async () => {
    setShowGuardadoModal(false);
  }, 1500);
  if (!isOpen) return null;
  const estados = ["roto", "disponible"];
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Estado Contenedor</h2>
        <form onSubmit={handleSubmit(onSave)}>
          <div className="mb-4">
            <label
              htmlFor="edit-estado"
              className="block text-gray-700 font-bold mb-2"
            >
              Estado
            </label>
            <select
              id="edit-estado"
              {...register("estado", { required: "El role es obligatorio" })}
              className={`uppercase w-full px-3 py-2 border ${errors.estado ? "border-red-500" : "border-gray-300"} rounded-md`}
            >
              {estados.map((estado, index) => (
                <option key={index} className="uppercase" value={estado}>
                  {estado}
                </option>
              ))}
            </select>
            {errors.estado && (
              <p className="text-red-500 text-sm mt-1">
                {errors.estado.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
      <PedidoGuardadoModal
        show={showGuardadoModal}
        message={"Contenedor guardado"}
      />
    </div>
  );
}

export default UpdateContenedorForm;
