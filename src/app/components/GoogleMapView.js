import { GoogleMap } from '@react-google-maps/api'
import { LoadScript } from '@react-google-maps/api'
import React from 'react'

function GoogleMapView() {

  const containerStyle = {
    width: '100%',
    height: '100vh'
  }
  const cordinate = { lat: -31.420, lng: -64.193 }
  return (
    <div>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY} mapIds={['ffac895524fa317e']}>
        <GoogleMap onClick={console.log("hola")} mapContainerStyle={containerStyle} center={cordinate} zoom={14} options={{ mapId: 'ffac895524fa317e' }} />
      </LoadScript>

    </div>
  )
}

export default GoogleMapView