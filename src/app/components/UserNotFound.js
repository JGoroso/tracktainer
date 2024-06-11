'use client'
import { signOut } from 'next-auth/react'
import React from 'react'

function UserNotFound() {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Usuario no encontrado</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-900">Por favor contactese con el administrador</p>
            <p className="text-sm text-gray-500">admin@tracktainer.com</p>
          </div>
          <div className="flex justify-center mt-4">
            <button onClick={() => signOut()}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserNotFound