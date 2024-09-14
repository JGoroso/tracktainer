"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Searchbox from "./searchBox.js";
import axios from "axios";
import {
  updatePedido,
  updateEstadoContenedorOcupado,
} from "../firebase/firestore/firestore.js";
import PedidoGuardadoModal from "./PedidoGuardadoModal";

function UpdatePedidoModal({ isOpen, onClose, pedido, fetchPedidos, pedidoData }) {
  // State for showing the success modal
  const [showPedidoGuardadoModal, setPedidoGuardadoModal] = useState(false);
  const [clientesData, setClientesData] = useState([]);
  const [choferesData, setChoferesData] = useState([]);
  const [contenedoresData, setContenedoresData] = useState([]);
  const [pedidoInfo, setPedidoInfo] = useState(null);
  const [error, setError] = useState(null);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {

    const fetchData = async () => {
      try {
        // Fetch data for clientes, choferes, and contenedores
        const [clientesResponse, choferesResponse, contenedoresResponse] =
          await Promise.all([
            axios.get("/api/get/clientes"),
            axios.get("/api/get/choferes"),
            axios.get("/api/get/contenedores"),
          ]);
        setClientesData(clientesResponse.data);
        setChoferesData(choferesResponse.data);
        setContenedoresData(contenedoresResponse.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Update the pedido with the form data
      await updatePedido(pedido, data);
      console.log("Pedido Actualizado:", data);
      setPedidoGuardadoModal(true);

      // Refresh the data and close the modal
      setTimeout(async () => {
        await fetchPedidos();
        updateEstadoContenedorOcupado(data.contenedor);
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error al actualizar el pedido:", error.message);
    }
  };
  console.log(pedidoData)
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
                value={"recibe"}
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
                {...register("cliente", { required: "Este campo es obligatorio" })}
                className={`w-full p-2 border ${errors.cliente ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              >
                <option value="N/A" disabled>Seleccionar cliente</option>
                {clientesData.length > 0 ? (
                  clientesData.map((cliente, index) => (
                    <option key={index} value={cliente.empresa}>{cliente.empresa}</option>
                  ))
                ) : (
                  <option value="N/A">Cargando clientes...</option>
                )}
              </select>
              {errors.cliente && <p className="text-red-500 text-sm mt-1">{errors.cliente.message}</p>}
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
                {...register("telefono_cliente", {
                  
                  validate: value => value.length < 8 ? "Número de teléfono debe tener al menos 8 cifras" : undefined,
                })}
              />
              {errors.telefono_cliente && <p className="text-red-500 text-sm">{errors.telefono_cliente.message}</p>}
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

            <div className="flex flex-col">
              <label htmlFor="contenedor" className="text-gray-800 text-sm sm:text-base font-bold mb-2">
                Contenedor
              </label>
              <select
                id="contenedor"
                {...register("contenedor", { required: "Este campo es obligatorio" })}
                className={`w-full p-2 border ${errors.contenedor ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              >
                <option value="N/A" disabled>Seleccionar contenedor</option>
                {contenedoresData.length > 0 ? (
                  contenedoresData.map((contenedor, index) => (
                    <option key={index} value={contenedor.codigo}>{contenedor.codigo}</option>
                  ))
                ) : (
                  <option value="N/A">Cargando contenedores...</option>
                )}
              </select>
              {errors.contenedor && <p className="text-red-500 text-sm mt-1">{errors.contenedor.message}</p>}
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
                onClick={()=> onClose()}
                className="bg-slate-600 hover:bg-slate-800  text-white font-semi-bold py-2 px-4 rounded-md"
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </div>

      {showPedidoGuardadoModal && <PedidoGuardadoModal onClose={() => setPedidoGuardadoModal(false)} />}
    </>
  );
}

export default UpdatePedidoModal;