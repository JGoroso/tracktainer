"use client"
import GoogleMapView from "./components/GoogleMapView"
import NavBar from "./components/Navbar"
import { useLoadScript } from '@react-google-maps/api'

const libraries = ["places"]

export default function Home() {
  // se hace la carga de la api y de "places" a través de useLoadScript ya que es necesario para utilizar nuestro mapa y use-places-autocomplete
  // verificamos errores que pueda provocar el hook useLoadScript
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? "",
    libraries
  })
  if (!isLoaded) return null;
  if (loadError) return <div>Error loading Google MAP Api</div>


  return (
    <div className="grid grid-cols-6">
      <div className='col-span-1'>
        <NavBar />
      </div>
      <div className='col-span-5'>
        <GoogleMapView />
      </div>
    </div>
  )
}
