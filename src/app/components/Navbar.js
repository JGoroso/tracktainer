
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { ArchiveBoxIcon, Bars3Icon, ChartBarSquareIcon, KeyIcon, PencilSquareIcon, UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

function NavBar({ }) {

  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  
  return (
    <div>
      <button onClick={toggleMenu} className="p-2 z-50 bg-white rounded-md shadow-md relative">
        {isOpen ?
          <XMarkIcon className="h-6 w-6" aria-hidden="true" /> :
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        }
      </button>
      <div className={`fixed top-0 left-0 w-full h-full bg-white z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col p-6  items-center justify-center">
          <div className="space-y-10 mt-20">
            {session?.user.role === 'admin' && (
              <Link legacyBehavior href="/Agregarpedidos">
                <a onClick={toggleMenu} className="text-[#545F71] flex items-center">
                  <PencilSquareIcon className="h-10 w-10" aria-hidden="true" />

                  <span className="ml-2 text-xl">Agregar pedido</span>
                </a>
              </Link>
            )}
            <Link legacyBehavior href="/Pedidos">
              <a onClick={toggleMenu} className="text-[#545F71] flex items-center">
                <ArchiveBoxIcon className="h-10 w-10" aria-hidden="true" />
                <span className="ml-2 text-xl">Pedidos</span>
              </a>
            </Link>
            {session?.user.role === 'admin' && (
              <Link legacyBehavior href="/Agregarusuario">
                <a onClick={toggleMenu} className="text-[#545F71] flex items-center">
                  <KeyIcon className="h-10 w-10" aria-hidden="true" />

                  <span className="ml-2 text-xl">Agregar Usuario</span>
                </a>
              </Link>
            )}
            {session?.user.role === 'admin' && (
              <Link legacyBehavior href="">
                <a onClick={toggleMenu} className="text-[#545F71] flex items-center">
                  <UserPlusIcon className="h-10 w-10" aria-hidden="true" />

                  <span className="ml-2 text-xl">Agregar Cliente</span>
                </a>
              </Link>
            )}
            {session?.user.role === 'admin' && (
              <Link legacyBehavior href="">
                <a onClick={toggleMenu} className="text-[#545F71] flex items-center">
                  <ChartBarSquareIcon className="h-10 w-10" aria-hidden="true" />

                  <span className="ml-2 text-xl">Reportes</span>
                </a>
              </Link>
            )}
            <Link legacyBehavior href="/auth/signout">
              <a onClick={() => signOut()} className="text-[#545F71] flex items-center">
                {session?.user ? <><Image src={session.user.image}
                  alt="user"
                  width={30}
                  height={30}
                  className="rounded-full" /></> : null
                }
                <span className="ml-2 text-xl">Cerrar sesión</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;