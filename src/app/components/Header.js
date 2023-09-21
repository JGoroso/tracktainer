"use client"
import Image from 'next/image'
import React from 'react'
import { useSession } from "next-auth/react"

function Header() {
  const { data: session } = useSession()
  return (
    <div className="grid grid-cols-2  w-full text-center text-xs text-forestgreen font-roboto">
      <div className="flex items-center text-left text-base text-black" >
        <Image
          alt=""
          width={40}
          height={40}
          src="/logo.png"
        />
        <div className="font-medium">
          TrackTainer
        </div>
      </div>
      <div className="flex justify-end mr-1">
        {session?.user ? <Image src={session.user.image}
          alt="user"
          width={50}
          height={50}
          className="rounded-full" /> : <Image src="/user.png"
            width={40}
            height={40}
            alt="userdefault"

        />}
      </div>
    </div>
  )
}

export default Header