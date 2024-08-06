import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api'
import { useState, useMemo } from 'react'
import { getPedidos, updateEstadoContenedorDisponible, updateEstadoPedido } from '../firebase/firestore/firestore'
import { useAsync } from '../hooks/useAsync'
import { CalendarDaysIcon, ClockIcon, MapPinIcon, TruckIcon } from '@heroicons/react/24/outline'

function GoogleMapView() {
  const [markerId, setMarkerId] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAnimation, setShowAnimation] = useState(false)
  const [refresh, setRefresh] = useState(false)

  // 'Cacheamos' con use memo el valor de cba evitando el re render del componente.
  // Esto lo hacemos ya que <GoogleMap> en su propiedad center entiende que debe renderizar el componente
  // CADA VEZ que nos movemos sobre el mapa.
  const center = useMemo(
    () => ({ lat: -31.408, lng: -64.192 }),
    []
  )

  // este handle nos permite cambiar el estado a complete.
  const handleCompleteOnClick = (contenedorNro) => {
    setShowAnimation(true)

    const docId = markerId

    // Actualiza el campo Estado a Completado en Firestore
    updateEstadoPedido(docId, "completado")
    updateEstadoContenedorDisponible(contenedorNro)
    setTimeout(() => {
      setShowAnimation(false)
      setSelected(null)
      setRefresh(!refresh)
    }, 3000)


  }

  // Se llama a la funcion getPedidos que nos devuelve todos los objetos de la coleccion 'Pedidos' en forma de promesa
  const getPedidosFromFirestore = () => getPedidos()
  // Utilizamos un hook que hara un async await al que le pasamos una funcion asincrona que retorna una promesa (get docs from firestore)
  // podremos recibir la data utilizando un useEffect (y con el refresh podemos refrescar los datos) y luego utilizar estos datos donde queramos
  const { data } = useAsync(getPedidosFromFirestore, refresh)
  const containerStyle = {
    width: '100%',
    height: '90vh'
  }

  return (
    <div>
      {showAnimation && (
        <div className={`alert-box ${showAnimation ? 'animate' : ''}`}>
          <div className="px-8 py-6 bg-green-400 text-white flex justify-between rounded">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-6" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"
                />
              </svg>
              <p>Bien! El pedido ha pasado a estado completado!</p>
            </div>
            <button className="text-green-100 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )
      }

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={{
          mapId: '4fe06d8ce7103950', disableDefaultUI: true,
          clickableIcons: false,
          gestureHandling: "greedy"
        }}
      >

        {data && data.map((marker) =>
          marker['estado'] == "pendiente" || marker['estado'] == "entregado" || marker['estado'] == "retirar" ?
            <Marker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              icon={marker['estado'] === "pendiente"
                ? { url: "/cont-pend.png" }
                : marker['estado'] === "entregado"
                  ? { url: "/cont-entre.png" }
                  : { url: "/cont-retirar.png" }}
              onClick={() => { setSelected(marker); setMarkerId(marker.id) }}
            />
            : null
        )}
        {selected ? (
          <div className="max-h-96">
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => setSelected(null)}
            >
              <div className="relative overflow-hidden flex flex-col justify-between space-y-4 text-sm rounded-xl max-w-[23rem] p-4 bg-white text-slate-700 shadow-lg">
                <div className="flex justify-between items-center">
                  <div className={`uppercase text-xs font-semibold ${selected.estado === "pendiente" ? 'text-yellow-500' : selected.estado === "entregado" ? 'text-green-400' : selected.estado === "a retirar" ? 'text-orange-400' : selected.estado === "completado" ? 'text-blue-500' : ''}`}>
                    {selected.estado}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon class="h-6 w-6 text-gray-500" />
                    <p className="text-gray-700">
                      Días en sitio: {
                        Math.floor(
                          (new Date() - new Date(new Date(selected.fechaPedido).toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }))) / (1000 * 60 * 60 * 24)
                        )
                      }
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="h-32 w-full rounded-lg overflow-hidden">
                    <iframe
                      className="w-full h-full"

                      src={`https://maps.google.com/maps?q=${selected.lat},${selected.lng}&z=15&output=embed`}
                    ></iframe>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center space-x-2 mt-2">
                    <MapPinIcon class="h-4 w-4 text-gray-900 font-bold" />
                    <p className="text-gray-700"> {selected.direccion} </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <TruckIcon class="h-4 w-4 text-gray-900 font-bold" />
                    <p className="text-gray-900 font-bold">Chofer </p>
                    <p className="text-gray-700"> {selected.chofer} </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <CalendarDaysIcon class="h-4 w-4 text-gray-900 font-bold" />
                    <p className="text-gray-900 font-bold">Fecha de entrega </p>
                    <p className="text-gray-700"> {selected.fechaPedido} </p>
                  </div>

                </div>


                <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                  <button
                    onClick={() => {
                      selected.estado === "retirar"
                        ? handleCompleteOnClick(selected.contenedor)
                        : alert('Solo se pueden completar aquellos pedidos en estado "retirar".');
                    }}
                    className="flex items-center justify-center px-4 py-2 text-sm text-white bg-green-500 hover:bg-green-600 rounded-lg transition duration-200"
                  >
                    Completado
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 ml-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="flex items-center justify-center px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200"
                  >
                    Cerrar
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 ml-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>

              </div>
            </InfoWindow>
          </div>
        ) : null
        }


      </GoogleMap >
    </div >
  )
}

export default GoogleMapView