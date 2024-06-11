"use client"
import Image from 'next/image'
import React from 'react'
import { signOut, useSession } from "next-auth/react"
import Link from 'next/link'
import NavBar from './Navbar'

export default function Header() {
  const { data: session } = useSession()
  return (
    <div className="grid grid-cols-2 h-30 gap-4">
      <div>
        <Link href={"/"}>
          <button>
            <div className="flex items-center justify-center">
              <Image
                alt=""
                width={50}
                height={30}
                src="/logo.png"
                priority
              />
              <div className="text-black text-xl">
                TrackTainer
              </div>
              <Image
                className='ml-4'
                alt=""
                width={60}
                height={40}
                src="/trejologo3.png"
                priority
              />
            </div>
          </button>
        </Link>
      </div>
      <div className="flex self-center w-full justify-end">
        <NavBar />
        <div className='flex ml-4'>
          <div>
            {session?.data?.user.name}
            {session?.user ? <>{session.user.name}<Image src={session.user.image}
              alt="user"
              width={50}
              height={50}
              className="rounded-full" /></> : null
            }
          </div>
          <div>
            <button onClick={() => signOut()} className="self-center mb-4">
              <svg className="fill-stroke self-center" width="46" height="45" viewBox="0 0 54 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40.375 32L49.875 24M49.875 24L40.375 16M49.875 24L16.625 24M30.875 32V34C30.875 37.3137 27.685 40 23.75 40L14.25 40C10.315 40 7.125 37.3137 7.125 34L7.125 14C7.125 10.6863 10.315 8 14.25 8L23.75 8C27.685 8 30.875 10.6863 30.875 14V16" stroke="#545F71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="self-center text-base text-[#545F71]">Salir</p>
            </button>
          </div>
        </div>
      </div>
    </div >
  )
}
