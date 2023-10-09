import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api'
import { collection, getDocs, getFirestore } from "firebase/firestore";
import app from '../firebase/firebase'
import { useState } from 'react'
import { useEffect } from 'react'


// se repite en dos oportunidades, refactor.
const db = getFirestore(app)

function GoogleMapView() {
  const [markers, setMarkers] = useState([])
  const [markerId, setMarkerId] = useState('')
  const [selected, setSelected] = useState(null)

  const center = useMemo(
    () => ({ lat: -31.408, lng: -64.192 }),
    []
  )

  const handleCompleteOnClick = async () => {
    const docId = markerId
    // Actualiza el campo Estado a Completado en Firestore
    await updateDoc(doc(db, "pedidos", docId), {
      estado: 'completado'
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'pedidos'));
        const newData = [];
        querySnapshot.forEach((doc) => {
          newData.push({
            id: doc.id,
            data: doc.data()
          });
        });
        setMarkers(newData);
      } catch (error) {
        console.error('Error al obtener datos de Firestore:', error);
      }
    };

    fetchData();
  }, [handleCompleteOnClick]);



  const containerStyle = {
    width: '100%',
    height: '92vh'
  }

  return (

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY} >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          options={{
            mapId: 'ffac895524fa317e', disableDefaultUI: true,
            clickableIcons: false
          }}
        >

          {markers.map((marker) =>
            marker.data['estado'] == "pendiente" ?
              <Marker
                key={marker.id}
                position={{ lat: marker.data.lat, lng: marker.data.lng }}
                icon={{ url: "/container.png" }}
                onClick={() => { setSelected(marker.data); setMarkerId(marker.id) }}
              /> : null)}

          {selected ?
            <div className="max-h-96">
              <InfoWindow
                position={{ lat: selected.lat, lng: selected.lng }}
                onCloseClick={() => { setSelected(null) }}
              >
                <div className='break-inside relative overflow-hidden flex flex-col justify-between space-y-3 text-sm rounded-xl max-w-[23rem] p-4 mb-2 bg-white text-slate-700'>
                  <div className='flex items-center justify-between font-medium'>
                    <span className='uppercase text-xs text-green-500'>{selected.estado}</span>
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
                  <div>Chofer: Matias</div>
                  <div>Fecha de entrega: {selected.fechaPedido}</div>
                  <div>Fecha de retiro: {selected.fechaPedido}</div>
                  <div className='flex justify-between items-center'>
                    <button onClick={() => { handleCompleteOnClick() }} className='flex items-center justify-center text-xs font-medium rounded-full px-4 py-1 space-x-1 border-2 bg-red-500 hover:text-black text-white'>
                      <span>Eliminar contenedor</span>
                      <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M5 12h13M12 5l7 7-7 7' />
                      </svg>
                    </button>
                  </div>
                  <div className='flex justify-between items-center'>
                    <button onClick={InfoWindow} className='flex items-center justify-center text-xs font-medium rounded-full px-4 py-1 space-x-1 border-2 bg-slate-500  hover:text-black text-white'>
                      <span>Cerrar</span>
                      {/* <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
                      <path d='M5 12h13M12 5l7 7-7 7' />
                    </svg> */}
                    </button>
                  </div>
                </div>
              </InfoWindow></div>
            : null}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default GoogleMapView