'use client'
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Modal from '../components/UserNotFound';

export const LoginPage = () => {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="flex bg-transparent md:bg-[#fafafa] rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl h-4/6 justify-center w-full">
          <div className="hidden lg:block lg:w-1/2 bg-cover bg-hero-image" style={{ backgroundPosition: 'center right', filter: 'brightness(70%) contrast(130%) saturate(150%)' }}></div>
          <div className="w-full p-8 lg:w-1/2">
            <div className="flex flex-col direction items-center justify-center h-full">

              <div className='flex items-center'>
                <Image
                  alt=""
                  width={60}
                  height={40}
                  src="/logo.png"
                  priority
                />
                <h2 className="text-2xl font-semibold text-gray-700 text-center">TrackTainer</h2>
                <Image
                  alt=""
                  width={60}
                  height={60}
                  src="/trejologo3.png"
                  priority
                  className='ml-4'

                />
              </div>
              <p className="text-xl text-gray-600 text-center">Bienvenido</p>
              <div className="mt-8 px-666 sm:px-0 max-w-sm">
                <button onClick={() => signIn('google')} type="button" className=" text-white w-full  bg-[#4b8df7]  hover:bg-[#78abfc] focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-10 py-2.5 text-center inline-flex items-center justify-center ">
                  <svg className="h-6 w-6" viewBox="0 0 40 40">
                    <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                    <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                    <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                    <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
                  </svg>
                  <h3 className='pl-4'>Ingresa con Google</h3>
                </button>
              </div>


              <div className="mt-4 flex items-center justify-between">
                <span className="border-b w-1/8 lg:w-1/8"></span>
                <p className='px-2 text-sm'>O CONTACTATE CON NOSOTROS</p>
                <span className="border-b w-1/8 lg:w-1/8"></span>
              </div>
              <div className="mt-8 px-6 sm:px-0 max-w-sm">
                <button type="button" className="border-2 border-slate-600 text-black w-full  bg-[#fafafa] hover:bg-[#fafaf4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-10 py-2.5 text-center inline-flex items-center justify-center">
                  <a href="mailto:your@email.com" className="flex text-center items-center justify-between">
                    <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 8L17.4392 9.97822C15.454 11.0811 14.4614 11.6326 13.4102 11.8488C12.4798 12.0401 11.5202 12.0401 10.5898 11.8488C9.53864 11.6326 8.54603 11.0811 6.5608 9.97822L3 8M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h3 className='pl-4'>Envianos un correo</h3>
                  </a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}