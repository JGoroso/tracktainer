import { GoogleMap, Marker } from '@react-google-maps/api'
import { LoadScript } from '@react-google-maps/api'
import { collection, getDocs, getFirestore } from "firebase/firestore";
import app from '../Firebase/Firebase';
import { useState } from 'react';
import { useEffect } from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { Image } from 'next/image'

// se repite en dos oportunidades, refactor.
const db = getFirestore(app)

function GoogleMapView() {

  const [markers, setMarkers] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'pedidos'));
        const newData = [];
        querySnapshot.forEach((doc) => {
          newData.push(doc.data());
        });
        setMarkers(newData);
      } catch (error) {
        console.error('Error al obtener datos de Firestore:', error);
      }
    };

    fetchData();
  }, []);

  const containerStyle = {
    width: '100%',
    height: '92vh'
  }

  const cordinate = { lat: -50.345, lng: -72.270 }

  return (
    <div>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY} mapIds={['ffac895524fa317e']}>
        <GoogleMap mapContainerStyle={containerStyle} center={cordinate} zoom={15} options={{ mapId: 'ffac895524fa317e' }}>
          {markers.map((marker) =>
            <Marker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              icon={{ url: "/container.png" }}
              onClick={() => { setSelected(marker) }}
            />)}

          {selected ?
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => { setSelected(null) }}
            >
              <div class='break-inside relative overflow-hidden flex flex-col justify-between space-y-3 text-sm rounded-xl max-w-[23rem] p-4 mb-2 bg-white text-slate-700'>
                <div class='flex items-center justify-between font-medium'>
                  <span class='uppercase text-xs text-green-500'>Estado pedido</span>
                  <span class='text-xs text-slate-500'>Betania</span>
                </div>
                <div class='flex flex-row items-center space-x-3'>
                  <div class='flex flex-none items-center justify-center w-10 h-10 rounded-full text-white'>
                    <svg width="32" height="32" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="10.4177" r="7" stroke="#D9D9D9" stroke-width="2" />
                      <circle cx="8" cy="10.4177" r="2" fill="#4CAF50" />
                    </svg>
                  </div>
                  <span class='text-base font-medium'>{selected.direccion}</span>
                </div>
                <div>Chofer: Matias</div>
                <div>Fecha de entrega: {selected.fechaPedido}</div>
                <div>Fecha de retiro: {selected.fechaPedido}</div>
                <div class='flex justify-between items-center'>
                  <button class='flex items-center justify-center text-xs font-medium rounded-full px-4 py-1 space-x-1 border-2 bg-red-500 hover:text-black text-white'>
                    <span>Eliminar contenedor</span>
                    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
                      <path d='M5 12h13M12 5l7 7-7 7' />
                    </svg>
                  </button>
                </div>
                <div class='flex justify-between items-center'>
                  <button class='flex items-center justify-center text-xs font-medium rounded-full px-4 py-1 space-x-1 border-2 bg-slate-500  hover:text-black text-white'>
                    <span>Cerrar</span>
                    {/* <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
                      <path d='M5 12h13M12 5l7 7-7 7' />
                    </svg> */}
                  </button>
                </div>
              </div>
            </InfoWindow>
            : null}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default GoogleMapView