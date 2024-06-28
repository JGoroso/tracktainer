import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import Searchbox from "./searchBox.js";
import { collection, addDoc } from "firebase/firestore";
import app from "src/app/firebase/firebase.js";
import { getFirestore } from "firebase/firestore";
import Link from "next/link.js";
import Image from "next/image.js";
import {
  getClientes,
  getContenedores,
  getChoferes1,
  updateEstadoContenedor,
} from "../firebase/firestore/firestore.js";
import Select from "react-select";
import { useAsync } from "../hooks/useAsync.js";
import { useRouter } from "next/navigation";
import { Router } from "next/router.js";

const db = getFirestore(app);

function NuevoPedidoForm() {
  const formRef = useRef();
  const defaultFecha = new Date();
  // el estado se guardaria como pendiente
  const estadoPendiente = "pendiente";
  // el estado del cliente seleccionado
  const [selectedCliente, setSelectedCliente] = useState({});
  const [selectedContenedor, setSelectedContenedor] = useState({});
  const [selectedChofer, setSelectedChofer] = useState({});
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [contenedores, setContenedores] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const router = useRouter();

  // useForm es un hook que gestiona el estado de un formulario y se desestructuran diferentes funciones y valores para trabajar con formularios
  // https://www.youtube.com/watch?v=1MxevPIZgVc
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defautlValues: {} });

  useEffect(() => {
    register("address", { required: "Por favor, ingrese una direccion" });
    register("latitude", { required: true, min: -90, max: 90 });
    register("longitude", { required: true, min: -180, max: 180 });
  }, [register]);

  const guardarInformacionDeUbicacion = async (
    recibe,
    address,
    lat,
    lng,
    estadoPendiente,
    telefono_cliente,
    fechaPedido,
    cliente, // Esto ahora será solo el nombre de la empresa
    chofer, // Esto ahora será solo el nombre del chofer
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
        cliente: cliente, // Guardar solo el nombre del cliente
        chofer: chofer, // Guardar solo el nombre del chofer
        contenedor: contenedor, // Guardar solo el número del contenedor
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const onSubmit = (data) => {
    const clienteSeleccionado = clientes.find(
      (c) => c.value === selectedCliente.value
    );
    console.log(data);
    const choferSeleccionado = choferes.find(
      (c) => c.value === selectedChofer.value
    );
    const contenedorSeleccionado = contenedores.find(
      (c) => c.value === selectedContenedor.value
    );

    guardarInformacionDeUbicacion(
      data.recibe || "",

      data.address,
      data.latitude,
      data.longitude,
      estadoPendiente,
      data.telefono_cliente || "",
      data.fechaPedido,
      clienteSeleccionado ? clienteSeleccionado.label : "", // Nombre del cliente
      choferSeleccionado ? choferSeleccionado.label : "", // Nombre del chofer
      contenedorSeleccionado ? contenedorSeleccionado.label : "" // Número del contenedor
    );
    updateEstadoContenedor(selectedContenedor);
    router.refresh();
  };

  const { data: clientesData, errorCliente } = useAsync(getClientes);
  if (errorCliente) {
    return <div>Error al cargar los clientes : {errorCliente.message} </div>;
  }

  useEffect(() => {
    if (clientesData) {
      setClientes(clientesData);
    }
  }, [clientesData]);

  const { data: contenedoresData, errorContenedor } = useAsync(getContenedores);
  if (errorContenedor) {
    return (
      <div>Error al cargar los contenedores: {errorContenedor.message}</div>
    );
  }

  useEffect(() => {
    if (contenedoresData) {
      setContenedores(contenedoresData);
    }
  }, [contenedoresData]);

  const { data: choferesData, errorChofer } = useAsync(getChoferes1);
  if (errorChofer) {
    return <div>Error al cargar los choferes: {errorChofer.message}</div>;
  }

  useEffect(() => {
    if (choferesData) {
      setChoferes(choferesData);
    }
  }, [choferesData]);

  const handleCheckboxChange = () => {
    setIsCheckboxChecked(!isCheckboxChecked);
  };

  return (
    <>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div></div>

        <div className="flex items-center mt-2 gap-x-3">
          <Link href={"/"}>
            <button className="flex items-center justify-center w-3/3 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto ray-800 0 hover:bg-gray-100 200 y-700">
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
            <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-yellow-400 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-yellow-500 lue-500 0">
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
      <form ref={formRef} className="m-20" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex justify-start text-gray-600 mb-3">
          <Image alt="" width={40} height={40} src="/waste-bin.png" priority />
        </div>
        <h1 className="text-gray-800 font-bold text-5xl leading-tight mb-4">
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
              defautlValue=""
            />
          }
          {errors.address && <p>{errors.address.message}</p>}
        </div>

        <label
          htmlFor="recibe"
          className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
        >
          ¿Quien recibe?
        </label>
        <input
          id="recibe"
          name="recibe"
          className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-yellow-500 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
          placeholder="Ingeniero Pedro"
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

        <div className="relative w-full cursor-default py-2 text-left  focus:outline-none focus-visible:border-yellow-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <Select
            placeholder="Seleccione un cliente"
            name="cliente"
            id="cliente"
            value={selectedCliente}
            onChange={setSelectedCliente}
            options={clientes || []}
          />
        </div>

        <label
          htmlFor="telefono_cliente"
          className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
        >
          Número de telefono
        </label>
        <input
          type="number"
          id="telefono_cliente"
          name="telefono_cliente"
          className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-yellow-500 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
          placeholder="Número de telefono"
          {...register("telefono_cliente", {
            required: false,
            validate: (telefono_cliente) => {
              if (telefono_cliente.length > 0 && telefono_cliente.length < 8) {
                return "Ingrese un numero de al menos 8 cifras";
              }
            },
          })}
        />
        {errors.telefono_cliente && <p>{errors.telefono_cliente.message}</p>}

        <div>
          <label
            htmlFor="fechaPedido"
            className="text-gray-800 text-sm  pr-4 font-bold leading-tight tracking-normal"
          >
            Fecha del pedido
          </label>
          <input
            type="date"
            id="fechaPedido"
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
            className="block py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-yellow-600 dark:focus:border-yellow-500 focus:outline-none focus:ring-0 focus:border-yellow-500 peer"
          />
          {errors.fechaPedido && errors.fechaPedido.type === "required" && (
            <span>Ingrese la fecha de entrega por favor</span>
          )}
          {errors.fechaPedido && errors.fechaPedido.type === "validate" && (
            <span>La fecha debe ser posterior a la fecha actual </span>
          )}
        </div>

        <label
          htmlFor="chofer"
          className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
        >
          Chofer
        </label>

        <div className="relative w-full cursor-default py-2 text-left focus:outline-none focus-visible:border-yellow-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <Select
            placeholder="Seleccione un chofer"
            id="chofer"
            name="chofer"
            value={selectedChofer}
            onChange={setSelectedChofer}
            options={choferes || []}
          />
        </div>
        <div>
          <label
            htmlFor="cliente"
            className="text-gray-800 text-sm font-bold leading-tight tracking-normal"
          >
            ¿Selecconar contenedor?
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

        <div className="relative w-full cursor-default py-2  text-left focus:outline-none focus-visible:border-yellow-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <Select
            placeholder="Seleccione un contenedor"
            id="contenedores"
            name="contenedores"
            value={selectedContenedor}
            onChange={setSelectedContenedor}
            options={contenedores || []}
            isDisabled={!isCheckboxChecked}
          />
        </div>

        <button
          type="submit"
          className="text-white mt-4 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-yellow-500 dark:hover:bg-yellow-500 dark:focus:ring-yellow-500"
        >
          Agregar pedido
        </button>
      </form>
    </>
  );
}

export default NuevoPedidoForm;
