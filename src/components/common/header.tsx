import Link from 'next/link'
import DropDownMenu from '../home/dropDownMenu'
import {ReactNode} from 'react'

function LinkItem({href, children}: {href: string; children: ReactNode}) {
  return (
    <li>
      <Link href={href} className="border-animation pb-0.5 text-sm font-bold">
        {children}
      </Link>
    </li>
  )
}

const Header = () => {
  return (
    <header>
      <div className="mx-auto flex max-w-screen-xl flex-row px-4 py-6 xl:px-0">
        <h1 className="text-3xl font-bold italic text-dforest-green">
          <Link href="/">D-FOREST</Link>
        </h1>
        <ul className="ml-auto hidden flex-row space-x-6 text-lg text-gray-800 md:flex">
          <LinkItem href="/company">会社案内</LinkItem>
          <LinkItem href="/works">事業内容</LinkItem>
          <LinkItem href="/contacts">お問い合わせ</LinkItem>
        </ul>
        <DropDownMenu />
      </div>
    </header>
  )
}

export default Header
