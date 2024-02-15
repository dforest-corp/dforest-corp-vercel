/** @package */

import Link from 'next/link'
import {ReactNode} from 'react'
import {SmMenu} from '@/components/smMenu'
import logoImage from '@/assets/logo.png'
import Image from 'next/image'

function LinkItem({href, children}: {href: string; children: ReactNode}) {
  return (
    <li>
      <Link href={href} className="border-animation pb-0.5 text-sm font-bold">
        {children}
      </Link>
    </li>
  )
}

export const Header = () => {
  return (
    <header>
      <div className="mx-auto flex max-w-screen-xl flex-row px-4 py-6 xl:px-0">
        <h1 className="text-3xl font-bold italic text-dforest-green">
          <Link href="/">
            <Image
              src={logoImage}
              alt="D-FOREST"
              className="max-w-[150px]"
              sizes="150px"
            />
          </Link>
        </h1>
        <ul className="ml-auto hidden flex-row space-x-6 text-lg text-gray-800 md:flex">
          <LinkItem href="/company">会社案内</LinkItem>
          <LinkItem href="/works">事業内容</LinkItem>
          <LinkItem href="/contacts">お問い合わせ</LinkItem>
        </ul>
        <SmMenu />
      </div>
    </header>
  )
}
