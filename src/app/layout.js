import './globals.css'
import { Roboto } from 'next/font/google'
import Provider from './Provider'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../pages/api/auth/[...nextauth]'
import Header from './components/Header'
import { LoginPage } from './Login/login'
import UserNotFound from './components/UserNotFound'
import NextTopLoader from 'nextjs-toploader';


const roboto = Roboto({ subsets: ['latin'], weight: ['500'] })
export const metadata = {
  title: 'TrackTainer',
  description: '',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className="h-screen bg-gradient-to-b from-slate-100 to-slate-100">
        <NextTopLoader />
        <main className={roboto.className}>
          <Provider>
            {(session && session?.user?.userAllowed != false) ? (
              <>
                <Header />
                {children}
              </>
            ) : (session?.user?.userAllowed == false) ? <UserNotFound /> :
              <LoginPage />
            }
          </Provider>

        </main>
      </body>
    </html >
  )
}
