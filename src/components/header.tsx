/** @package */

import type {ReactNode} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {SmMenu} from '@/components/smMenu'
import logoImage from '@/assets/logo.png'

function LinkItem({href, children}: {href: string; children: ReactNode}) {
  return (
    <li>
      <Link href={href} className="border-animation pb-0.5">
        {children}
      </Link>
    </li>
  )
}

export const Header = () => {
  return (
    <header className="mx-auto flex w-full max-w-screen-xl flex-row px-4 py-6 xl:px-0">
      <h1>
        <Link href="/">
          <Image
            src={logoImage}
            alt="D-FOREST"
            className="max-w-[150px]"
            sizes="150px"
          />
        </Link>
      </h1>
      <nav className="ml-auto hidden md:block">
        <ul className="flex space-x-6 text-sm font-bold text-gray-800">
          <LinkItem href="/company">会社案内</LinkItem>
          <LinkItem href="/works">事業内容</LinkItem>
          <LinkItem href="/contacts">お問い合わせ</LinkItem>
        </ul>
      </nav>
      <SmMenu />
    </header>
  )
}
