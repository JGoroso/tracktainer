"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Searchbox from "./searchBox.js";
import axios from "axios";
import {
  updateEstadoContenedorOcupado,
  updatePedido,
} from "../firebase/firestore/firestore.js";
import PedidoGuardadoModal from "./PedidoGuardadoModal";

function UpdatePedidoModal({ isOpen, onClose, pedido, fetchPedidos, dataPedidoSelected }) {
  // State for showing the success modal
  const [showPedidoGuardadoModal, setPedidoGuardadoModal] = useState(false);
  const [clientesData, setClientesData] = useState([]);
  const [choferesData, setChoferesData] = useState([]);
  const [contenedoresData, setContenedoresData] = useState([]);
  const [error, setError] = useState(null);

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Definir una función async para manejar la lógica
    const fetchData = async () => {
      try {
        // Fetch data for clientes, choferes, and contenedores
        const [clientesResponse, choferesResponse, contenedoresResponse] = await Promise.all([
          axios.get("/api/get/clientes"),
          axios.get("/api/get/choferes"),
          axios.get("/api/get/contenedores")
        ]);

        // Actualizar el estado con los datos obtenidos
        setClientesData(clientesResponse.data);
        setChoferesData(choferesResponse.data);
        setContenedoresData(contenedoresResponse.data);

      } catch (error) {
        setError(error.message);
      }
    };

    // Llamar a la función fetchData
    fetchData();
  }, []);


  // Handle form submission
  const onSubmit = async (newData) => {
    try {
      // Update the pedido with the form data
      console.log(newData)
      await updatePedido(pedido, newData, dataPedidoSelected);
      if (newData.contenedor) {
        updateEstadoContenedorOcupado(newData.contenedor)
      }
      console.log("Pedido Actualizado:", newData);
      setPedidoGuardadoModal(true);

      // Refresh the data and close the modal
      setTimeout(async () => {
        await fetchPedidos();
        setPedidoGuardadoModal(false);
        onClose();
        reset()
      }, 1500);
    } catch (error) {
      console.error("Error al actualizar el pedido:", error.message);
    }
  };

  if (!isOpen || !pedido) return null;
  return (
    <>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
        <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center">Editar Pedido</h2>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-center">Actualice la información del pedido</p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-4 space-y-4">
            <div className="flex flex-col">
              <label htmlFor="direccion" className="text-gray-800 text-sm sm:text-base font-bold mb-2">
                Dirección
              </label>
              <Searchbox
                onSelectAddress={(address, latitude, longitude) => {
                  setValue("direccion", address);
                  setValue("latitude", latitude);
                  setValue("longitude", longitude);
                }}
              />
              {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion.message}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="recibe" className="text-gray-800 text-sm sm:text-base font-bold mb-2">
                ¿Quién recibe?
              </label>
              <input
                id="recibe"
                name="recibe"
                className="text-gray-600 focus:outline-none focus:border-yellow-500 w-full p-2 border border-gray-300 rounded-md"
                {...register("recibe")}
              />
              {errors.recibe && <p className="text-red-500 text-sm">{errors.recibe.message}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="cliente" className="text-gray-800 text-sm sm:text-base font-bold mb-2">
                Cliente
              </label>
              <select
                id="cliente"
                {...register("cliente")}
                className={`w-full p-2 border ${errors.cliente ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              >

                {clientesData.length > 0 ? (
                  clientesData.map((cliente, index) => (
                    <option key={index} value={cliente.empresa}>{cliente.empresa}</option>
                  ))
                ) : (
                  <option value="N/A">Cargando clientes...</option>
                )}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="telefono_cliente" className="text-gray-800 text-sm sm:text-base font-bold mb-2">
                Teléfono del cliente
              </label>
              <input
                type="text"
                id="telefono_cliente"
                name="telefono_cliente"
                className="text-gray-600 focus:outline-none focus:border-yellow-500 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Número de teléfono"
                {...register("telefono_cliente")}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="fechaPedido" className="text-gray-800 text-sm sm:text-base font-bold mb-2">
                Fecha del pedido
              </label>
              <input
                type="date"
                id="fechaPedido"
                {...register("fechaPedido", { required: "Ingrese la fecha del pedido" })}
                className="text-gray-600 focus:outline-none focus:border-yellow-500 w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.fechaPedido && <p className="text-red-500 text-sm">{errors.fechaPedido.message}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="chofer" className="text-gray-800 text-sm sm:text-base font-bold mb-2">
                Chofer
              </label>
              <select
                id="chofer"
                {...register("chofer", { required: "Este campo es obligatorio" })}
                className={`w-full p-2 border ${errors.chofer ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              >
                <option value="N/A" disabled>Seleccionar chofer</option>
                {choferesData.length > 0 ? (
                  choferesData.map((chofer, index) => (
                    <option key={index} value={chofer.nombre}>{chofer.nombre}</option>
                  ))
                ) : (
                  <option value="N/A">Cargando choferes...</option>
                )}
              </select>
              {errors.chofer && <p className="text-red-500 text-sm mt-1">{errors.chofer.message}</p>}
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableSelection"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4"
                />
                <label htmlFor="enableSelection" className="text-sm">
                  Habilitar selección de contenedor
                </label>
              </div>

              <select
                id="contenedor"
                {...register("contenedor")}
                className={`w-full p-2 border rounded-md ${isChecked ? '' : 'opacity-50 cursor-not-allowed'}`}
                disabled={!isChecked}
              >
                <option value="">Seleccione un contenedor</option>
                {contenedoresData && contenedoresData.length > 0 ? (
                  contenedoresData.map((contenedor, index) => (
                    contenedor.estado === "disponible" ? (
                      <option key={index} value={contenedor.numero}>
                        {contenedor.numero}
                      </option>
                    ) : null
                  ))
                ) : (
                  <option value="N/A">Cargando contenedores...</option>
                )}
              </select>


            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semi-bold py-2 px-4 rounded-md"
              >
                Actualizar Pedido
              </button>
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                onClick={() => onClose()}
                className="bg-slate-600 hover:bg-slate-800  text-white font-semi-bold py-2 px-4 rounded-md"
              >
                Cerrar
              </button>
            </div>
          </form>
        </div >
      </div >

      <PedidoGuardadoModal show={showPedidoGuardadoModal} message={"Pedido actualizado con exito"} />

    </>
  );
}

export default UpdatePedidoModal;