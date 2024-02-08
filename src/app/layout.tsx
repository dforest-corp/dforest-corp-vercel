import type {ReactNode} from 'react'
import {Metadata, Viewport} from 'next'
import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import {Noto_Sans_JP} from 'next/font/google'
import {IntroScreen} from '@/components/introScreen'
import {ToastContainer} from 'react-toastify'
import {Footer} from '@/components/footer'
import {Header} from '@/components/header'

const font = Noto_Sans_JP({
  weight: ['400', '500', '700', '900'],
  preload: false,
})

export const metadata: Metadata = {
  title: {
    template: '%s | D-FOREST',
    default: 'D-FOREST | Creative Web and Smart phone application',
  },
}

export const viewport: Viewport = {
  themeColor: '#084E3B',
}

export default function DefaultLayout({children}: {children: ReactNode}) {
  return (
    <html lang="ja">
      <body className={font.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <IntroScreen />
        <ToastContainer />
      </body>
    </html>
  )
}
