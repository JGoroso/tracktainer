import { useState, useEffect, ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import Searchbox from './searchBox.js'
import { collection, addDoc } from 'firebase/firestore'
import app from 'src/app/firebase/firebase.js'
import { getFirestore } from "firebase/firestore";
import Link from 'next/link.js'
//import { error } from 'console'

const db = getFirestore(app)


function NuevoPedidoForm() {
  const defaultFecha = new Date()
  // El estado submit se utiliza para controlar si el formulario se está enviando o no.
  const [submit, setSubmitting] = useState(false)

  // useForm es un hook que gestiona el estado de un formulario y se desestructuran diferentes funciones y valores para trabajar con formularios
  // https://www.youtube.com/watch?v=1MxevPIZgVc
  const { register, handleSubmit, setValue, errors, watch } = useForm({ defautlValues: {} })

  useEffect(() => {
    register({ name: "address" }, { required: "Por favor, ingrese una direccion" })
    register({ name: "latitude" }, { required: true, min: -90, max: 90 })
    register({ name: "longitude" }, { required: true, min: -180, max: 180 })
  }, [register])

  //esto se lo paso a lo que invoca la función-- linea 63
  const address = watch("address")
  const nombreCliente = watch("nombre_cliente")
  const cliente_registrado = watch("cliente_registrado")
  const fechaPedido = watch("fechaPedido")
  const telefono_cliente = watch("telefono_cliente")
  // todo: crear ticket para ver el manejo de fechas desde el formulario a firestore y luego de firestore al map.
  //const fechaPedido = "27/09/2023"
  // el estado se guardaria como pendiente 
  const estado = "pendiente"
  const lat = watch("latitude")
  const lng = watch("longitude")

  const guardarInformacionDeUbicacion = async (nombre_cliente,cliente_registrado, address, lat, lng, estado, fechaPedido,telefono_cliente) => {
    try {
      const docRef = await addDoc(collection(db, "pedidos"), {
        nombreCliente: nombre_cliente,
        cliente : cliente_registrado,
        direccion: address,
        estado: estado,
        fechaPedido: fechaPedido,
        lat: lat,
        lng: lng,
        telefono: telefono_cliente
      })
      console.log("Document written with ID: ", docRef.id)
    } catch (e) {
      console.error("Error adding document: ", e)
    }
  };



  

  const onSubmit = () => {
    setSubmitting(true)
    guardarInformacionDeUbicacion(nombreCliente,cliente_registrado, address, lat, lng, estado, fechaPedido,telefono_cliente);
    
  }


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
      <h1 className=" text-5xl font-extrabold text-black">Agregar Pedido</h1>
      <div className="relative z-0 w-full mb-6 group">
        {<Searchbox onSelectAddress={(address, latitude, longitude) => {
          setValue("address", address)
          setValue("latitude", latitude)
          setValue("longitude", longitude)
        }} defautlValue="" />}
        {errors.address && <p>{errors.address.message}</p>}
      </div>
      <h2>{address}</h2>

      <div className="pt-10"/>
        <div className="relative z-0 w-full mb-6 group">
          <input type="text" id="nombre_cliente" name='nombre_cliente' ref={register({
            required: "Por favor ingrese el nombre de un cliente",
            validate: (nombre_cliente) => {
              if (nombre_cliente.length < 7) {
                return "muy corto che"
              }
            }
          })}
             className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Nombre del Cliente"
          />
         
        </div>
         {errors.nombre_cliente && <p>{errors.nombre_cliente.message}</p>}
         {
         errors.nombre_cliente && errors.nombre_cliente.type === "validate" && <span role="alert">Ingrese un nombre más largo</span>
        }

         <div className="pt-10"/>
        <div className="relative z-0 w-full mb-6 group">
          <input type="text" id="cliente_registrado" name='cliente_registrado' ref={register({
            required: "Por favor ingrese el nombre de un cliente registrado",
            validate: (cliente_registrado) => {
              if (cliente_registrado.length < 7) {
                return "muy corto che"
              }
            }
          })}
             className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Nombre del Cliente Registrado"
          />
         
        </div>
         {errors.cliente_registrado && <p>{errors.cliente_registrado.message}</p>}
         {
         errors.cliente_registrado && errors.cliente_registrado.type === "validate" && <span role="alert">Ingrese un nombre más largo</span>
        }

        <div className="pt-10"/>
        <div className="relative z-0 w-full mb-6 group">
          <input type="number" id="telefono_cliente" name= "telefono_cliente" 
          ref={register(
            {
              required:"Ingrese el telefono del cliente por favor", length : 10 
            }
            )
          
          }
         className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Telefono del Cliente"
        />   
        {
          errors.telefono_cliente && errors.telefono_cliente.type === "required" && <span>Ingrese el número del cliente por favor</span>
        }
        {
         errors.telefono_cliente && errors.telefono_cliente.type === "lenght" && <span role="alert">Ingrese un número de 10 caracteres por favor</span>
        }
        <div/>


          <div className="pt-10"/>
          <div className="relative z-0 w-full mb-6 group">
          <input type='date' id="fechaPedido" name= "fechaPedido" floating-text="fecha de Entrega"
          ref={
            register(  
            {
              required:{
                value: true,
                
              },
              validate:(value) => {
                const fechaPedido = new Date(value)
                if  (fechaPedido < defaultFecha) {
                  return "La fecha debe ser posterior a la fecha actual"
                }              
                
              }

            })
          }
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Fecha de Entrega"

          />

          <label htmlFor="fechaPedido" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Fecha de Entrega</label>

          {
            errors.fechaPedido && errors.fechaPedido.type === "required" && <span>Ingrese la fecha de entrega por favor</span>
          }
          {
          errors.fechaPedido && errors.fechaPedido.type === "validate" && <span>La fecha debe ser posterior a la fecha actual </span>
          }
          
          </div>

        

      </div>
      {/* <button type="submit" className="text-black bg-yellow hover:bg-yellow focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-yellow dark:hover:bg-yellow dark:focus:ring-yellow-800">Agregar pedido</button> */}
      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Agregar pedido</button>

      <pre>
        {JSON.stringify(watch(),null,2)}
      </pre> 
    </form >
    </>
  )
}

export default NuevoPedidoForm

//Luego del register no pongo el nombre del campo para que aparezca en el watch