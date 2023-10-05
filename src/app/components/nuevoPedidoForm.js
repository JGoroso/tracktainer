import { useState, useEffect, ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import Searchbox from './searchBox.js'
import { collection, addDoc } from "firebase/firestore"
import app from '../firebase/firebase.js'
import { getFirestore } from "firebase/firestore";

const db = getFirestore(app)


function NuevoPedidoForm() {
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

  const cliente = watch("nombre_cliente")
  const address = watch("address")
  const lat = watch("latitude")
  const lng = watch("longitude")
  // todo: crear ticket para ver el manejo de fechas desde el formulario a firestore y luego de firestore al map.
  const fechaPedido = "27/09/2023"
  // el estado se guardaria como pendiente 
  const estado = "pendiente"

  const guardarInformacionDeUbicacion = async (cliente, address, lat, lng, estado, fechaPedido) => {
    try {
      const docRef = await addDoc(collection(db, "pedidos"), {
        cliente: cliente,
        direccion: address,
        estado: estado,
        fechaPedido: fechaPedido,
        lat: lat,
        lng: lng,
      })
      console.log("Document written with ID: ", docRef.id)
    } catch (e) {
      console.error("Error adding document: ", e)
    }
  };



  const handleCreate = async (data) => { }

  const onSubmit = (data) => {
    setSubmitting(true)
    guardarInformacionDeUbicacion(cliente, address, lat, lng, estado, fechaPedido);
    handleCreate(data)
  }


  return (
    <form className="m-40" onSubmit={handleSubmit(onSubmit)}>
      <h1 className=" text-5xl font-extrabold text-black">Agregar Pedido</h1>
      <div className="relative z-0 w-full mb-6 group">
        {<Searchbox onSelectAddress={(address, latitude, longitude) => {
          setValue("address", address)
          setValue("latitude", latitude)
          setValue("longitude", longitude)
        }} />}
        {errors.address && <p>{errors.address.message}</p>}
      </div>
      <h2>{address}</h2>
      <div className="pt-10">
        <div className="relative z-0 w-full mb-6 group">
          <input type="text" id="nombre_cliente" name='nombre_cliente' ref={register({
            required: "Por favor ingrese el nombre de un cliente",
            validate: (nombre_cliente) => {
              if (nombre_cliente.length == 1) {
                return "muy corto che"
              }
            }
          })}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=""
          />
          <label htmlFor="nombre_cliente"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre del cliente</label>
        </div>
        {errors.nombre_cliente && <p>{errors.nombre_cliente.message}</p>}
        {/* <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-6 group">
            <input type="text" name="floating_first_name" id="floating_first_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
            <label htmlFor="floating_first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input type="text" name="floating_last_name" id="floating_last_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
            <label htmlFor="floating_last_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-6 group">
            <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="floating_phone" id="floating_phone"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
            <label htmlFor="floating_phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number (123-456-7890)</label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input type="text" name="floating_company" id="floating_company"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
            <label htmlFor="floating_company" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transhtmlForm -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Company (Ex. Google)</label>
          </div>
        </div> */}
      </div>
      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Agregar pedido</button>
    </form >
  )
}

export default NuevoPedidoForm