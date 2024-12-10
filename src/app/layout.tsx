import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Providers from '../components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Legal Bot - AI Juridische Assistant',
  description: 'Uw persoonlijke AI juridische assistent voor Belgisch recht',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const session = await getServerSession(authOptions);

    return (
      <html lang="nl">
        <body className={inter.className}>
          <Providers session={session}>
            <Navbar />
            {children}
            <Footer />
          </Providers>
        </body>
      </html>
    )
  } catch (error) {
    console.error(error);
    return (
      <html lang="nl">
        <body className={inter.className}>
          <Providers>
            <h1>Error</h1>
            <p>Failed to load session</p>
          </Providers>
        </body>
      </html>
    )
  }
}
