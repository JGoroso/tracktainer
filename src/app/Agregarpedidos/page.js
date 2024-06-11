"use client"
import React from 'react'
import NuevoPedidoForm from '../components/nuevoPedidoForm'
import { useSession } from 'next-auth/react';


export default function page() {
  const { data: session } = useSession()
  if (!session || session.user.role !== 'admin') {
    // Si no hay sesión o el usuario no tiene el rol de administrador, no renderizar el componente
    return null
  }
  return (
    <>
      <NuevoPedidoForm />
    </>
  )
}
