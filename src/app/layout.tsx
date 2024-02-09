import type {ReactNode} from 'react'
import {Metadata, Viewport} from 'next'
import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import {Noto_Sans_JP} from 'next/font/google'
import {ToastContainer} from 'react-toastify'
import {Footer} from '@/components/footer'
import {Header} from '@/components/header'
import {IntroScreenDynamic} from '@/components/introScreenDynamic'
import {GoogleAnalytics} from '@next/third-parties/google'

const font = Noto_Sans_JP({
  weight: ['400', '500', '700', '900'],
  preload: false,
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | D-FOREST',
    default: 'D-FOREST | Creative Web and Smart phone application',
  },
  openGraph: {
    images: ['/ogp.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#1E4620',
}

export default function DefaultLayout({children}: {children: ReactNode}) {
  return (
    <html lang="ja">
      <body className={font.className}>
        <div className="flex min-h-svh flex-col">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
        <IntroScreenDynamic />
        <ToastContainer />
      </body>
      <GoogleAnalytics gaId="G-0623VQ99RH" />
    </html>
  )
}
