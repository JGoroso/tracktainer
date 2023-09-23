import { GoogleMap, Marker } from '@react-google-maps/api'
import { LoadScript } from '@react-google-maps/api'
import React from 'react'

function GoogleMapView() {

  const containerStyle = {
    width: '100%',
    height: '92vh'
  }

  const cordinate = { lat: -50.345, lng: -72.270 }

  return (
    <div>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY} mapIds={['ffac895524fa317e']}>
        <GoogleMap mapContainerStyle={containerStyle} center={cordinate} zoom={15} options={{ mapId: 'ffac895524fa317e' }}>
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default GoogleMapView