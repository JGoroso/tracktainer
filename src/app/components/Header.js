"use client"
import Image from 'next/image'
import React from 'react'

import Link from 'next/link'
import NavBar from './Navbar'

export default function Header() {

  return (
    <div className="grid grid-cols-2 h-30 gap-4">
      <div className="flex items-center justify-start">
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
      <div className="flex items-center justify-end">
        <NavBar />
      </div>

    </div>
  )
}
