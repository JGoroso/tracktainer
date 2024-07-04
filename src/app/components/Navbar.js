
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { ArchiveBoxArrowDownIcon, ArchiveBoxIcon, ChartBarSquareIcon, KeyIcon, PencilSquareIcon, UserPlusIcon } from '@heroicons/react/24/outline'

function NavBar({ }) {

  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <nav className="z-50">
      <div className="max-w-screen-xxl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src="/logo.png" width={42} height={42} alt="Tracktainer Logo" />
          <span className="self-center text-2xl whitespace-nowrap">Tracktainer</span>
          <Image src="/trejologo3.png" width={42} height={42} alt="Tracktainer Logo" />
        </a>
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen ? 'true' : 'false'}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto fixed top-16 left-0 bg-gradient-to-b from-slate-100 to-slate-100 border-gray-100 md:static md:bg-transparent z-50`} id="navbar-default">
          <div className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
            {session?.user.role === 'admin' && (
              <Link legacyBehavior href="/Agregarpedidos">
                <a onClick={toggleMenu} className="text-[#545F71] flex items-center">
                  <PencilSquareIcon className="h-8 w-8" aria-hidden="true" />
                  <span className="ml-2">Agregar pedido</span>
                </a>
              </Link>
            )}
            <Link legacyBehavior href="/Pedidos">
              <a onClick={toggleMenu} className="text-[#545F71] flex items-center">
                <ArchiveBoxIcon className="h-8 w-8" aria-hidden="true" />
                <span className="ml-2">Pedidos</span>
              </a>
            </Link>
            {session?.user.role === 'admin' && (
              <Link legacyBehavior href="/Agregarusuario">
                <a onClick={toggleMenu} className="text-[#545F71] flex items-center">
                  <KeyIcon className="h-8 w-8" aria-hidden="true" />

                  <span className="ml-2 ">Agregar Usuario</span>
                </a>
              </Link>
            )}
            {session?.user.role === 'admin' && (
              <Link legacyBehavior href="/Agregarcliente">
                <a onClick={toggleMenu} className="text-[#545F71] flex items-center">
                  <UserPlusIcon className="h-8 w-8" aria-hidden="true" />

                  <span className="ml-2">Agregar Cliente</span>
                </a>
              </Link>
            )}
            
              <Link legacyBehavior href="/AgregarContenedor">
                <a onClick={toggleMenu} className="text-[#545F71] flex items-center">
                  <ArchiveBoxArrowDownIcon className="h-8 w-8" aria-hidden="true" />

                  <span className="ml-2">Agregar Contenedor</span>
                </a>
              </Link>
          
            {session?.user.role === 'admin' && (
              <Link legacyBehavior href="/Reportes">
                <a onClick={toggleMenu} className="text-[#545F71] flex items-center">
                  <ChartBarSquareIcon className="h-8 w-8" aria-hidden="true" />

                  <span className="ml-2">Reportes</span>
                </a>
              </Link>
            )}
            <button>
              <a onClick={() => signOut()} className="text-[#545F71] flex items-center">
                {session?.user ? <><Image src={session.user.image}
                  alt="user"
                  width={30}
                  height={30}
                  className="rounded-full" /></> : null
                }
                <span className="ml-2">Cerrar sesión</span>
              </a>
            </button>
          </div>
        </div>
      </div>
    </nav >
  );
}

export default NavBar;