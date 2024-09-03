'use client'
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Searchbox from "./searchBox.js";
import axios from 'axios';

function NuevoPedidoModal({ isOpen, onClose, pedido }) {
  if (!isOpen) return null;

  const [clientesData, setClientesData] = useState([]);
  const [choferesData, setChoferesData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setValue("direccion", pedido.direccion);
      setValue("recibe", pedido.recibe);
      setValue("telefono_cliente", pedido.telefono_cliente);
      setValue("fechaPedido", pedido.fechaPedido);
      setValue("chofer", pedido.chofer);
      try {
        const [clientesResponse, choferesResponse] = await Promise.all([
          axios.get('/api/get/clientes'),
          axios.get('/api/get/choferes')
        ]);
        setClientesData(clientesResponse.data);
        setChoferesData(choferesResponse.data);
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

  const onSubmit = (data) => {
    console.log("updateando")
    onUpdate(data);
  };

  const handleCheckboxChange = (event) => {
    setValue("contenedor", event.target.checked ? '' : 'N/A');
  };

  return (
    <>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg max-w-md w-full sm:max-w-lg md:max-w-xl">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
          <h2 className="text-lg md:text-xl font-bold">Editar Pedidos</h2>
          <p className="mt-2 text-sm md:text-base">Actualice el campo que desea actualizar</p>
          <p className="mt-2 text-sm md:text-base">ID del pedido: {pedido}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-4">
            <div className="flex flex-col mb-4">
              <label htmlFor="direccion" className="text-gray-800 text-sm font-bold mb-2">
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
              <label htmlFor="recibe" className="text-gray-800 text-sm font-bold mb-2">
                ¿Quién recibe?
              </label>
              <input
                id="recibe"
                name="recibe"
                className="text-gray-600 focus:outline-none focus:border-yellow-500 w-full p-2 border border-gray-300 rounded-md text-black"
                {...register("recibe", {
                  required: false
                })}
              />
              {errors.recibe && <p className="text-red-500 text-sm">{errors.recibe.message}</p>}
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="cliente" className="text-gray-800 text-sm font-bold mb-2">
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
              <label htmlFor="telefono_cliente" className="text-gray-800 text-sm font-bold mb-2">
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
              <label htmlFor="fechaPedido" className="text-gray-800 text-sm font-bold mb-2">
                Fecha del pedido
              </label>
              <input
                type="date"
                id="fechaPedido"
                {...register("fechaPedido", {
                  required: {
                    value: true,
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
              <label htmlFor="chofer" className="text-gray-800 text-sm font-bold mb-2">
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

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="hasContenedor"
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="hasContenedor" className="text-gray-800 text-sm font-bold">
                ¿Contenedor incluido?
              </label>
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
    </>
  );
}

export default NuevoPedidoModal;
