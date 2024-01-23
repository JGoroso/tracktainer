import { useState, useEffect, ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import Searchbox from './searchBox.js'
import { collection, addDoc } from 'firebase/firestore'
import app from 'src/app/firebase/firebase.js'
import { getFirestore } from "firebase/firestore";
import Link from 'next/link.js'
import Image from 'next/image.js'
import { Listbox, Transition } from '@headlessui/react'

const db = getFirestore(app)


function NuevoPedidoForm() {
  const defaultFecha = new Date()
  // el estado se guardaria como pendiente 
  const estadoPendiente = "pendiente"

  // useForm es un hook que gestiona el estado de un formulario y se desestructuran diferentes funciones y valores para trabajar con formularios
  // https://www.youtube.com/watch?v=1MxevPIZgVc
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ defautlValues: {} })

  useEffect(() => {
    register("address", { required: "Por favor, ingrese una direccion" })
    register("latitude", { required: true, min: -90, max: 90 })
    register("longitude", { required: true, min: -180, max: 180 })
  }, [register])



  const guardarInformacionDeUbicacion = async (nombre_cliente, cliente_registrado, address, lat, lng, estadoPendiente, fechaPedido, telefono_cliente) => {
    try {
      const docRef = await addDoc(collection(db, "pedidos"), {
        nombreCliente: nombre_cliente,
        cliente: cliente_registrado,
        direccion: address,
        estado: estadoPendiente,
        fechaPedido: fechaPedido,
        lat: lat,
        lng: lng,
        telefono: telefono_cliente
      })
      console.log("Document written with ID: ", docRef.id)
    } catch (e) {
      console.error("Error adding document: ", e)
    }
  }

  const onSubmit = (data) => {
    guardarInformacionDeUbicacion(data.recibe, data.cliente, data.address, data.latitude, data.longitude, estadoPendiente, data.fechaPedido, data.telefono_cliente);
  }

  const clientes = [
    { name: 'Betania' },
    { name: 'Griwold' },
  ]

  return (

    <>
      <div className="sm:flex sm:items-center sm:justify-between">

        <div></div>

        <div className="flex items-center mt-4 gap-x-3">
          <Link href={"/"}>
            <button className="flex items-center justify-center w-3/3 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto ray-800 0 hover:bg-gray-100 200 y-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>Volver al mapa</span>
            </button>
          </Link>
          <Link href={"Pedidos"}>
            <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 lue-500 0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>

              <span>Pedidos Pendientes</span>
            </button>
          </Link>
        </div>
      </div>
      <form className="m-40" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex justify-start text-gray-600 mb-3">
          <Image
            alt=""
            width={40}
            height={40}
            src="/waste-bin.png"
            priority
          />
        </div>
        <h1 className="text-gray-800 font-bold text-5xl leading-tight mb-4">Agregar Pedidos</h1>
        <label htmlFor="direccion" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Inserte una dirección</label>
        <div className="relative z-0 w-full mb-6 group">
          {<Searchbox onSelectAddress={(address, latitude, longitude) => {
            setValue("address", address)
            setValue("latitude", latitude)
            setValue("longitude", longitude)
          }} defautlValue="" />}
          {errors.address && <p>{errors.address.message}</p>}
        </div>

        <label htmlFor="recibe" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">¿Quien recibe?</label>
        <input id="recibe" name="recibe" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Ingeniero Pedro"
          {...register("recibe", {
            required: "Por favor ingrese el nombre de la persona que recibe",
            validate: (recibe) => {
              if (recibe.length < 3 || recibe == "") {
                return "El nombre es muy corto o esta vacio"
              }
            }
          })} />
        {errors.recibe && <p>{errors.recibe.message}</p>}


        <label htmlFor="cliente" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Cliente</label>
        <Listbox /*value={} onChange={}*/>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate">Betania</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </Listbox.Button>
            <Transition
              as={"Fragment"}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {clientes.map((person, personIdx) => (
                  <Listbox.Option
                    key={personIdx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                      }`
                    }
                    value={person}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                            }`}
                        >
                          {person.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>



        <label htmlFor="telefono_cliente" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Número de telefono</label>
        <input type='number' id="telefono_cliente" name="telefono_cliente" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Número de telefono"
          {...register('telefono_cliente', {
            required: "Ingrese el telefono del cliente por favor",
            validate: (telefono_cliente) => {
              if (telefono_cliente == "") {
                return "Ingrese un numero de telefono"
              }
              if (telefono_cliente.length < 8) {
                return "Ingrese un numero de al menos 8 cifras"
              }
            }
          })} />
        {errors.telefono_cliente && <p>{errors.telefono_cliente.message}</p>}


        <div>
          <label htmlFor="fechaPedido" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">Fecha del pedido</label>

          <input type='date' id="fechaPedido"
            {...register(
              "fechaPedido", {
              required: {
                value: true,

              },
              validate: (value) => {
                const fechaPedido = new Date(value)
                if (fechaPedido < defaultFecha) {
                  return "La fecha debe ser posterior a la fecha actual"
                }

              }

            })
            }
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />

          <label htmlFor="fechaPedido" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Fecha de Entrega</label>

          {
            errors.fechaPedido && errors.fechaPedido.type === "required" && <span>Ingrese la fecha de entrega por favor</span>
          }
          {
            errors.fechaPedido && errors.fechaPedido.type === "validate" && <span>La fecha debe ser posterior a la fecha actual </span>
          }
        </div>
        {/* <button type="submit" className="text-black bg-yellow hover:bg-yellow focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-yellow dark:hover:bg-yellow dark:focus:ring-yellow-800">Agregar pedido</button> */}
        <button type="submit" className="text-white mt-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Agregar pedido</button>

      </form>
    </>
  )
}

export default NuevoPedidoForm

//Luego del register no pongo el nombre del campo para que aparezca en el watch