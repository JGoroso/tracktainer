import { GoogleMap, Marker } from '@react-google-maps/api'
import { LoadScript } from '@react-google-maps/api'
import { collection, getDocs, getFirestore } from "firebase/firestore";
import app from '../firebase/firebase';
import { useState } from 'react';
import { useEffect } from 'react';

// se repite en dos oportunidades, refactor.
const db = getFirestore(app)

function GoogleMapView() {

  const [markers, setMarkers] = useState([])
  let markersArray = []

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
          {markers.map((marker) => <Marker key={marker.cliente} position={{ lat: marker.lat, lng: marker.lng }} icon={{ url: "/container.png" }} />)}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default GoogleMapView