import Header from './components/Header'
import './globals.css'
import { Roboto } from 'next/font/google'
import Provider from './Provider'


const roboto = Roboto({ subsets: ['latin'], weight: ['500'] })

export const metadata = {
  title: 'TrackTainer',
  description: '',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <main className={roboto.className}>
          <Provider>
            <Header className="w-full" />
            {children}
          </Provider>
        </main>
      </body>
    </html>
  )
}
