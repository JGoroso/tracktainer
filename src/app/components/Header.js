"use client"
import Image from 'next/image'
import React from 'react'
import { useSession } from "next-auth/react"

function Header() {
  const { data: session } = useSession()
  return (
    <div className="grid grid-cols-2 h-12 w-full">
      <button>
        <div className="flex items-center" >
          <Image
            alt=""
            width={40}
            height={40}
            src="/logo.png"
          />
          <div className="text-base left text-black">
            TrackTainer
          </div>
        </div>
      </button>
      <div className="flex justify-end mr-1">
        {session?.user ? <Image src={session.user.image}
          alt="user"
          width={50}
          height={50}
          className="rounded-full" /> : null
        }
      </div>
    </div>
  )
}

export default Header