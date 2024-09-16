"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Searchbox from "./searchBox.js";
import { collection, addDoc } from "firebase/firestore";
import app from "src/app/firebase/firebase.js";
import { getFirestore } from "firebase/firestore";
import Link from "next/link.js";
import Image from "next/image.js";
import {
  getChoferes,
  getClientes,
  getContenedores,
  updateEstadoContenedorOcupado,
} from "../firebase/firestore/firestore.js";
import { useAsync } from "../hooks/useAsync.js";
import ConfirmacionModal from "./ConfirmacionModal.js";

const db = getFirestore(app);

function NuevoPedidoForm() {
  const defaultFecha = new Date();
  const estadoPendiente = "pendiente";
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [contenedoresData, setContenedoresData] = useState([]);
  const [showConfirmacionModal, setShowConfirmacionModal] = useState(false);
  const [dataForm, setDataForm] = useState();

  // Obtenemos data para los listboxes
  const getClienteFromFirestore = async () => await getClientes();
  const getChoferesFromFirestore = async () => await getChoferes();

  // useEffect para obtener nuevos contenedores luego de cada submit
  const getContenedoresFromFirestore = async () => {
    const data = await getContenedores();
    setContenedoresData(data);
  };

  useEffect(() => {
    getContenedoresFromFirestore();
  }, []);

  const { data: clientesData, error: clientesError } = useAsync(
    getClienteFromFirestore,
    ""
  );
  const { data: choferesData, error: choferesError } = useAsync(
    getChoferesFromFirestore,
    ""
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    register("address", { required: "Por favor, ingrese una dirección" });
    register("latitude", { required: true, min: -90, max: 90 });
    register("longitude", { required: true, min: -180, max: 180 });
  }, [register]);

  const guardarInformacionDePedido = async (
    recibe,
    address,
    lat,
    lng,
    estadoPendiente,
    telefono_cliente,
    fechaPedido,
    cliente,
    chofer,
    contenedor
  ) => {
    try {
      const docRef = await addDoc(collection(db, "pedidos"), {
        recibe: recibe,
        direccion: address,
        lat: lat,
        lng: lng,
        estado: estadoPendiente,
        telefono: telefono_cliente,
        fechaPedido: fechaPedido,
        cliente: cliente,
        chofer: chofer,
        contenedor: contenedor,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const onSubmit = async (data) => {
    setDataForm(data);
    if (data) {
      setShowConfirmacionModal(true);
    }
    console.log(data);
  };

  const GuardarInfo = async (data) => {
    guardarInformacionDePedido(
      data.recibe || "",
      data.address,
      data.latitude,
      data.longitude,
      estadoPendiente,
      data.telefono_cliente || "",
      data.fechaPedido,
      data.cliente,
      data.chofer,
      data.contenedor || ""
    );
    updateEstadoContenedorOcupado(data.contenedor);
    setTimeout(async () => {
      await getContenedoresFromFirestore();
      setShowConfirmacionModal(false);
    }, 1000);

    reset();
  };

  const handleCheckboxChange = () => {
    setIsCheckboxChecked(!isCheckboxChecked);
  };

  return (
    <>
      <div>
        <div className="sm:flex sm:items-center sm:justify-between">
          <div></div>

          <div className="flex items-center mt-2 gap-x-3">
            <Link href={"/"}>
              <button className="flex items-center justify-center w-full sm:w-auto px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <span>Volver al mapa</span>
              </button>
            </Link>
            <Link href={"Pedidos"}>
              <button className="flex items-center justify-center w-full sm:w-auto px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-yellow-400 rounded-lg gap-x-2 hover:bg-yellow-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Pedidos Pendientes</span>
              </button>
            </Link>
          </div>
        </div>

        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto w-full sm:w-2/3 lg:w-1/2 p-4 shadow-md rounded-lg"
          >
            <div className="w-full flex justify-start text-gray-600 mb-3">
              <Image
                alt=""
                width={40}
                height={40}
                src="/waste-bin.png"
                priority
              />
            </div>
            <h1 className="text-gray-800 font-bold text-2xl md:text-5xl leading-tight mb-4">
              Agregar Pedidos
            </h1>
            <label
              htmlFor="direccion"
              className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
            >
              Ingrese una dirección
            </label>
            {/*SearchBox*/}
            <div className="relative z-0 w-full mb-6 group">
              {/* LLamamos al componente searchbox.js */}
              {
                <Searchbox
                  onSelectAddress={(address, latitude, longitude) => {
                    setValue("address", address);
                    setValue("latitude", latitude);
                    setValue("longitude", longitude);
                  }}
                />
              }
              {errors.address && <p>{errors.address.message}</p>}
            </div>

            <label
              htmlFor="recibe"
              className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
            >
              ¿Quién recibe?
            </label>
            <input
              id="recibe"
              name="recibe"
              className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-yellow-500 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
              {...register("recibe", {
                required: false,
                validate: (recibe) => {
                  if (recibe.length > 0 && recibe.length < 3) {
                    return "El nombre es muy corto";
                  }
                },
              })}
            />
            {errors.recibe && <p>{errors.recibe.message}</p>}

            <label
              htmlFor="cliente"
              className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
            >
              Cliente
            </label>
            <div className="relative w-full cursor-default py-2 text-left focus:outline-none focus-visible:border-yellow-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <select
                defaultValue={"N/A"}
                id="cliente"
                {...register("cliente")}
                className={`w-full px-3 py-2 border ${errors.cliente ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
              >
                <option value={"N/A"} disabled>
                  Seleccionar cliente
                </option>
                {clientesData &&
                  clientesData.map((cliente, index) => (
                    <option key={index} value={cliente.empresa}>
                      {cliente.empresa}
                    </option>
                  ))}
              </select>
              {errors.cliente && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cliente.message}
                </p>
              )}
            </div>

            <label
              htmlFor="telefono_cliente"
              className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
            >
              Número de teléfono
            </label>
            <input
              type="number"
              id="telefono_cliente"
              name="telefono_cliente"
              className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-yellow-500 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
              placeholder="Número de teléfono"
              {...register("telefono_cliente", {
                required: false,
                validate: (telefono_cliente) => {
                  if (
                    telefono_cliente.length > 0 &&
                    telefono_cliente.length < 8
                  ) {
                    return "Ingrese un número de al menos 8 cifras";
                  }
                },
              })}
            />
            {errors.telefono_cliente && (
              <p>{errors.telefono_cliente.message}</p>
            )}

            <div className="w-full mb-4">
              <label
                htmlFor="fechaPedido"
                className="block text-gray-800 text-sm font-bold mb-2"
              >
                Fecha del pedido
              </label>
              <div className="w-full">
                <input
                  type="date"
                  id="fechaPedido"
                  placeholder="Agregar fecha por favor"
                  {...register("fechaPedido", {
                    required: {
                      value: true,
                    },
                    validate: (value) => {
                      const fechaPedido = new Date(value);
                      if (fechaPedido < defaultFecha) {
                        return "La fecha debe ser posterior a la fecha actual";
                      }
                    },
                  })}
                  className="block text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray"
                />
                {errors.fechaPedido && errors.fechaPedido.type === "required" && (
                  <span>Ingrese la fecha de entrega por favor</span>
                )}
                {errors.fechaPedido && errors.fechaPedido.type === "validate" && (
                  <span>La fecha debe ser posterior a la fecha actual </span>
                )}
              </div>
            </div>

            <label
              htmlFor="chofer"
              className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
            >
              Chofer
            </label>
            <div className="relative w-full cursor-default py-2 text-left focus:outline-none focus-visible:border-yellow-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <select
                defaultValue={"N/A"}
                id="chofer"
                {...register("chofer")}
                className={`w-full px-3 py-2 border ${errors.chofer ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
              >
                <option value={"N/A"} disabled>
                  Seleccionar chofer
                </option>
                {choferesData &&
                  choferesData.map((chofer, index) => (
                    <option key={index} value={chofer.label}>
                      {chofer.label}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="contenedor"
                className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
              >
                ¿Seleccionar contenedor?
              </label>
            </div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isCheckboxChecked}
                onChange={handleCheckboxChange}
                className="form-checkbox"
              />
              <span className="ml-2">Habilitar contenedor</span>
            </label>
            <div className="relative w-full cursor-default py-2 text-left focus:outline-none focus-visible:border-yellow-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <select
                defaultValue={"N/A"}
                disabled={!isCheckboxChecked}
                id="contenedor"
                className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-yellow-500 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
                {...register("contenedor")}
              >
                <option value={"N/A"} disabled>
                  Seleccionar contenedor
                </option>
                {contenedoresData &&
                  contenedoresData.map((contenedor, index) => (
                    <option key={index} value={contenedor.numero}>
                      {contenedor.numero}
                    </option>
                  ))}
              </select>
            </div>

            <button
              type="submit"
              className="text-white mt-4 focus:ring-4 focus:outline-none bg-yellow-400 gap-x-2 hover:bg-yellow-500 focus:ring-yellow-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Agregar pedido
            </button>
          </form>
        </div>
      </div>
      <ConfirmacionModal
        show={showConfirmacionModal}
        onClose={() => setShowConfirmacionModal(false)}
        onSave={GuardarInfo}
        source={dataForm ? dataForm : null}
      />
    </>
  );
}

export default NuevoPedidoForm;
