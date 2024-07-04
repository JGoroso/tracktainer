import { useSession } from 'next-auth/react'
import NuevoClienteForm from '../components/NuevoClienteForm'
import React from 'react'

function page() {
  const { data: session } = useSession()
  if (!session || session.user.role !== 'admin') {
    // Si no hay sesión o el usuario no tiene el rol de administrador, no renderizar el componente
    return null
  }
  return (
    <>
      <NuevoClienteForm />

    </>
  )
}

export default page