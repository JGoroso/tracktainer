"use client"
import GoogleMapView from "./components/GoogleMapView";
import NavBar from "./components/Navbar";

export default function Home() {
  return (
    <div className="grid grid-cols-4 h-screen">
      <div className='bg-white-300'>
        <NavBar />
      </div>
      <div className='col-span-3'>
        <GoogleMapView />
      </div>
    </div>
  )
}
