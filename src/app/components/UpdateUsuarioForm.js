import React, { useEffect, useState } from "react";
import PedidoGuardadoModal from "./PedidoGuardadoModal";

function UpdateUsuarioForm({
  isOpen,
  onClose,
  user,
  onSave,
  register,
  setValue,
  handleSubmit,
  errors,
}) {
  useEffect(() => {
    if (user) {
      setValue("nombre", user.nombre);
      setValue("telefono", user.telefono);
      setValue("role", user.role);
      setValue("email", user.email);
    }
  }, [user, setValue]);
  const [showPedidoGuardadoModal, setPedidoGuardadoModal] = useState(false);
  setTimeout(async () => {
    setPedidoGuardadoModal(false);
  }, 1500);

  if (!isOpen) return null;
  const roles = ["admin", "chofer"];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
        <form onSubmit={handleSubmit(onSave)}>
          <div className="mb-4">
            <label
              htmlFor="edit-nombre"
              className="block text-gray-700 font-bold mb-2"
            >
              Nombre
            </label>
            <input
              id="edit-nombre"
              {...register("nombre", { required: "El nombre es obligatorio" })}
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
              htmlFor="edit-role"
              className="block text-gray-700 font-bold mb-2"
            >
              Role
            </label>
            <select
              id="edit-role"
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
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="edit-email"
              className="block text-gray-700 font-bold mb-2"
            >
              Correo
            </label>
            <input
              id="edit-email"
              type="email"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "El formato del correo es inválido",
                },
              })}
              className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
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
        show={showPedidoGuardadoModal}
        message={"Usuario guardado"}
      />
    </div>
  );
}

export default UpdateUsuarioForm;
