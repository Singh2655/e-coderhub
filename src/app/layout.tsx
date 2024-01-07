import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { RecoilRoot } from 'recoil'
import RecoilContextProvider from './recoilContextProvider'
import { Toaster, toast } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-CoderHub',
  description: 'practice data structures and algorithms',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    <html lang="en">
      <body className={inter.className}>
        <RecoilContextProvider>
         {children}
        </RecoilContextProvider>
        <Toaster position="bottom-right"/>
        </body>
    </html>
    </>
  )
}
