import React, { useState } from "react";
import PedidoGuardadoModal from "./PedidoGuardadoModal";

function ConfirmacionModal({ show, onClose, onSave, source }) {
  const [showPedidoGuardadoModal, setPedidoGuardadoModal] = useState(false);

  if (!show) return null;

  const handleSave = () => {
    onSave(source);
    setPedidoGuardadoModal(true);
    setTimeout(async () => {
      setPedidoGuardadoModal(false);
    }, 1500);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Confirmar Datos:
            </h5>
          </div>
          <div className="flow-root">
            <ul
              role="list"
              className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 rounded dark:border-gray-700"
            >
              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                      Dirección:
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {source ? source.address : null}
                    </p>
                  </div>
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                      ¿Quién recibe?:
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {source.recibe}
                    </p>
                  </div>
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                      Cliente:
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {source.cliente}
                    </p>
                  </div>
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                      Teléfono:
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {source.telefono_cliente}
                    </p>
                  </div>
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                      Fecha:
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {source.fechaPedido}
                    </p>
                  </div>
                </div>
              </li>
              <li className="py-3 sm:py-4 last:border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                      Chofer asignado:
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {source.chofer}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex justify-center space-x-4 mt-4">
            <button
              className="text-black mt-4 focus:ring-4 focus:outline-none bg-white gap-x-2 hover:bg-grey-500 focus:ring-grey font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center hover:bg-gray-100 border border-gray-300"
              onClick={onClose}
            >
              Cerrar
            </button>

            <button
              className="text-white mt-4 focus:ring-4 focus:outline-none bg-yellow-400 gap-x-2 hover:bg-yellow-500 focus:ring-yellow-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              onClick={handleSave}
            >
              Confirmar pedido
            </button>
          </div>
        </div>
      </div>
      <PedidoGuardadoModal
        show={showPedidoGuardadoModal}
        message={"Pedido guardado"}
      />
    </>
  );
}

export default ConfirmacionModal;
