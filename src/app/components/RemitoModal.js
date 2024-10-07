import React, { useState } from 'react'

function RemitoModal({ show, onClose, onSave }) {
  const [nroRemito, setNroRemito] = useState('');

  if (!show) return null;

  const handleSave = () => {
    onSave(nroRemito)
    setNroRemito('');
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Ingrese el Nro de Remito</h2>
        <input
          type="text"
          value={nroRemito}
          onChange={(e) => setNroRemito(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full mb-4"
          placeholder="Nro de Remito"
        />

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className=" mr-2 px-4 py-2  text-gray-700 border rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
          >
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
};
export default RemitoModal;
