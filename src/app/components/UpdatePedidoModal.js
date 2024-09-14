'use client'
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Searchbox from "./searchBox.js";
import axios from 'axios';
import { updatePedido, updateEstadoContenedorOcupado } from '../firebase/firestore/firestore.js';
import PedidoGuardadoModal from "./PedidoGuardadoModal";

function UpdatePedidoModal({ isOpen, onClose, pedido, fetchPedidos }) {

  if (!isOpen) return null;

  const [showPedidoGuardadoModal, setPedidoGuardadoModal] = useState(false);
  const [clientesData, setClientesData] = useState([]);
  const [choferesData, setChoferesData] = useState([]);
  const [contenedoresData, setContenedoresData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesResponse, choferesResponse, contenedoresResponse] = await Promise.all([
          axios.get('/api/get/clientes'),
          axios.get('/api/get/choferes'),
          axios.get('api/get/contenedores')
        ]);
        setClientesData(clientesResponse.data);
        setChoferesData(choferesResponse.data);
        setContenedoresData(contenedoresResponse.data)
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);


  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      direccion: pedido.direccion || '',
      recibe: pedido.recibe || '',
      cliente: pedido.cliente || 'N/A',
      telefono_cliente: pedido.telefono_cliente || '',
      fechaPedido: pedido.fechaPedido || '',
      chofer: pedido.chofer || 'N/A',
      contenedor: pedido.contenedor || 'N/A'
    }
  });


  const onSubmit = async (data) => {
    try {
      // Verifica los datos recibidos
      console.log("Datos recibidos para actualizar:", data);

      // Llama a la función updateEstadoPedido pasando siempre lo que viene del on submit tenga algun field 
      if (data) {
        await updatePedido(pedido, {
          direccion: data.direccion,
          recibe: data.recibe,
          cliente: data.cliente,
          telefono: data.telefono_cliente,
          fechaPedido: data.fechaPedido,
          chofer: data.chofer,
          contenedor: data.contenedor,
          latitude: data.latitude,
          longitude: data.longitude
        });
        console.log("Pedido Actualizado: " + pedido);
        setPedidoGuardadoModal(true)
      } else {
        console.log("No hay datos: " + pedido);
      }

      setTimeout(async () => {
        fetchPedidos()
        updateEstadoContenedorOcupado(data.contenedor);
        setPedidoGuardadoModal(true)
        onClose()
      }, 3000);
    } catch (error) {
      console.error("Error al actualizar el pedido:", error.message);
    }
  };

  return (
    <>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
        <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Editar Pedidos</h2>
          <p className="mt-2 text-sm sm:text-base md:text-lg">Actualice el campo que desea actualizar</p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-4">
            <div className="flex flex-col mb-4">
              <label htmlFor="direccion" className="text-gray-800 text-sm sm:text-base font-bold mb-2">
                Ingrese una dirección
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

            <div className="flex flex-col mb-4">
              <label htmlFor="recibe" className="text-gray-800 text-sm sm:text-base font-bold mb-2">
                ¿Quién recibe?
              </label>
              <input
                id="recibe"
                name="recibe"
                className="text-gray-600 focus:outline-none focus:border-yellow-500 w-full p-2 border border-gray-300 rounded-md"
                {...register("recibe", { required: false })}
              />
              {errors.recibe && <p className="text-red-500 text-sm">{errors.recibe.message}</p>}
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="cliente" className="text-gray-800 text-sm sm:text-base font-bold mb-2">
                Cliente
              </label>
              <select
                id="cliente"
                {...register("cliente")}
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

            <div className="flex flex-col mb-4">
              <label htmlFor="telefono_cliente" className="text-gray-800 text-sm sm:text-base font-bold mb-2">
                Número de teléfono
              </label>
              <input
                type="number"
                id="telefono_cliente"
                name="telefono_cliente"
                className="text-gray-600 focus:outline-none focus:border-yellow-500 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Número de teléfono"
                {...register("telefono_cliente", {
                  required: false,
                  validate: (telefono_cliente) => {
                    if (telefono_cliente.length > 0 && telefono_cliente.length < 8) {
                      return "Ingrese un número de al menos 8 cifras";
                    }
                  },
                })}
              />
              {errors.telefono_cliente && <p className="text-red-500 text-sm">{errors.telefono_cliente.message}</p>}
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="fechaPedido" className="text-gray-800 text-sm sm:text-base font-bold mb-2">
                Fecha del pedido
              </label>
              <input
                type="date"
                id="fechaPedido"
                {...register("fechaPedido", {
                  required: {
                    message: "Ingrese la fecha de entrega por favor"
                  },
                  validate: (value) => {
                    const fechaPedido = new Date(value);
                    if (fechaPedido < new Date()) {
                      return "La fecha debe ser posterior a la fecha actual";
                    }
                  },
                })}
                className="text-gray-600 focus:outline-none focus:border-yellow-500 w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.fechaPedido && <span className="text-red-500 text-sm">{errors.fechaPedido.message}</span>}
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="chofer" className="text-gray-800 text-sm sm:text-base font-bold mb-2">
                Chofer
              </label>
              <select
                id="chofer"
                {...register("chofer")}
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

            <div>
              <label
                htmlFor="contenedor"
                className="text-gray-800 text-sm sm:text-base font-bold leading-tight tracking-normal"
              >
                ¿Seleccionar contenedor?
              </label>
            </div>
            <div className="relative w-full cursor-default py-2 text-left focus:outline-none focus-visible:border-yellow-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <select
                defaultValue={"N/A"}
                id="contenedor"
                className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-yellow-500 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
                {...register("contenedor")}
              >
                <option value={"N/A"} disabled>
                  Seleccionar contenedor
                </option>
                {contenedoresData &&
                  contenedoresData
                    .filter(contenedor => contenedor.estado === "disponible")
                    .map((contenedor, index) => (
                      <option key={index} value={contenedor.numero}>
                        {contenedor.numero}
                      </option>
                    ))}
              </select>
            </div>

            <div className="flex flex-col space-y-2 mt-4">
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Actualizar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
      <PedidoGuardadoModal
        className={"z-40 inset-0"}
        show={showPedidoGuardadoModal}
        message={"Pedido actualizado"}
      />
    </>
  );
}

export default UpdatePedidoModal;
