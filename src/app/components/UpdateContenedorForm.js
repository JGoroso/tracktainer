import React, { useEffect } from 'react'


function UpdateContenedorForm({ isOpen, onClose, contenedor, onSave, register, setValue, handleSubmit, errors }) {

  useEffect(() => {
    if (contenedor) {
      setValue("nombreEmpresa", contenedor.empresa)
    }
  }, [contenedor, setValue]);

  if (!isOpen) return null;
  const estados = ["roto", "disponible"]
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Estado Contenedor</h2>
        <form onSubmit={handleSubmit(onSave)}>


          <div className="mb-4">
            <label htmlFor="edit-estado" className="block text-gray-700 font-bold mb-2">Estado</label>
            <select
              id="edit-estado"
              {...register("estado", { required: "El role es obligatorio" })}
              className={`uppercase w-full px-3 py-2 border ${errors.estado ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            >
              {estados.map((estado, index) => (
                <option key={index} className="uppercase" value={estado}>{estado}</option>
              ))}
            </select>
            {errors.estado && <p className="text-red-500 text-sm mt-1">{errors.estado.message}</p>}
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
              className="px-4 py-2 bg-yellow-500 text-white border rounded-md hover:bg-yellow-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateContenedorForm