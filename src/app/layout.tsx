import type {ReactNode} from 'react'
import {Metadata, Viewport} from 'next'
import '../styles/globals.scss'
import {LayoutProvides} from '@/app/clients'
import {Noto_Sans_JP} from 'next/font/google'

const font = Noto_Sans_JP({
  weight: ['400', '500', '700', '900'],
  preload: false
})

export const metadata: Metadata = {
  title: {
    template: '%s | D-FOREST',
    default: 'D-FOREST'
  }
}

export const viewport: Viewport = {
  themeColor: '#084E3B'
}

export const runtime = 'edge'

export default function DefaultLayout({children}: {children: ReactNode}) {
  return (
    <html lang="ja">
    <body>
    <div className={font.className}>{children}</div>
    <LayoutProvides />
    </body>
    </html>
  )
}
