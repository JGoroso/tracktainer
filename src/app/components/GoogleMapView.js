import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api'
import { useState, useMemo } from 'react'
import { getPedidos, updateEstadoPedido } from '../firebase/firestore/firestore'
import { useAsync } from '../hooks/useAsync'

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
  const handleCompleteOnClick = () => {
    setShowAnimation(true)
    const docId = markerId

    // Actualiza el campo Estado a Completado en Firestore
    updateEstadoPedido(docId, "completado")

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
          marker['estado'] == "pendiente" || marker['estado'] == "entregado" ?
            <Marker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              icon={marker['estado'] == "entregado" ? { url: "/container.png" } : { url: "/container-pend.png" }}
              onClick={() => { setSelected(marker); setMarkerId(marker.id) }}
            />
            : null
        )}

        {selected ?
          <div className="max-h-96">
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => { setSelected(null) }}
            >
              <div className='break-inside relative overflow-hidden flex flex-col justify-between space-y-3 text-sm rounded-xl max-w-[23rem] p-4 mb-2 bg-white text-slate-700'>
                <div className='flex items-center justify-between font-medium'>
                  <span className={`uppercase text-xs ${selected['estado'] == "entregado" ? 'text-green-500' : 'text-orange-400'}`}>{selected.estado}</span>
                  <span className='text-xs text-slate-500'>{selected.cliente}</span>
                </div>
                <div className='flex flex-row items-center space-x-3'>
                  <div className='flex flex-none items-center justify-center w-10 h-10 rounded-full text-white'>
                    <svg width="32" height="32" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="10.4177" r="7" stroke="#D9D9D9" strokeWidth="2" />
                      <circle cx="8" cy="10.4177" r="2" fill="#4CAF50" />
                    </svg>
                  </div>
                  <span className='text-base font-medium'>{selected.direccion}</span>
                </div>
                <div>Chofer: {selected.chofer}</div>
                <div>Fecha de entrega: {selected.fechaPedido}</div>
                {/* <div>Fecha de retiro: {selected.fechaPedido}</div> */}
                <div className='flex flex-wrap items-center justify-between font-medium'>
                  <div className='flex justify-between items-center'>
                    <button onClick={() => { selected['estado'] == "entregado" ? handleCompleteOnClick() : `'${console.log("No se puede pasar a estado completado un contenedor en estado pendiente")}'` }}
                      className="flex w-full px-5 py-2 items-center justify-center  text-sm text-gray-700 transition-colors duration-200 bg-green-400 border rounded-lg gap-x-2 sm:w-auto ray-800 0 hover:bg-gray-100 200 y-700">
                      <span>Pedido completado</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <button onClick={() => { setSelected(null) }}
                      className="flex w-full px-5 py-2 items-center justify-center  text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 ray-800 0 hover:bg-gray-100 200 y-700">
                      <span>Cerrar</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </InfoWindow></div>
          : null}
      </GoogleMap>
    </div>
  )
}

export default GoogleMapView