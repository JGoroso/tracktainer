"use client"
import GoogleMapView from "./components/GoogleMapView";
import NavBar from "./components/Navbar";

export default function Home() {
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
