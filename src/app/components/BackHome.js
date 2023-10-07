import { useRouter } from 'next/navigation';
import React from 'react'

function BackHome() {
  const router = useRouter()

  const backHome = () => {
    router.push('/')
  }

  return (
    <button onClick={backHome} type="button" className="w-full ml-2 flex items-center justify-center px-5 py-2 text-sm transition-colors duration-200 rounded-lg gap-x-2 sm:w-auto hover:bg-gray-800 bg-gray-900 text-gray-200 border-gray-700">
      <svg className="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
      </svg>
      <span>Volver al mapa</span>
    </button>
  )
}

export default BackHome