"use client"
import { LoadScript } from '@react-google-maps/api'
import { SessionProvider } from 'next-auth/react'

const places = ["places"]

function Provider({ children }) {
  return (

    <SessionProvider>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
        libraries={places}
      >
        {children}
      </LoadScript>
    </SessionProvider>
  )
}

export default Provider