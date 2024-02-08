import Link from 'next/link'
import DropDownMenu from '../home/dropDownMenu'
import {ReactNode} from 'react'

function LinkItem({href, children}: {href: string, children: ReactNode}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm font-bold relative ease-out duration-300 pb-0.5 after:origin-left after:absolute after:left-0 after:w-full after:h-px after:bottom-0 after:bg-black after:transition after:scale-x-0 hover:after:scale-x-100">
        {children}
      </Link>
    </li>
  )
}

const Header = () => {
  return (
    <header>
      <div className='py-6 px-4 xl:px-0 flex flex-row max-w-screen-xl mx-auto'>
        <h1 className='text-3xl font-bold text-dforest-green italic'>
          <Link href='/'>D-FOREST</Link>
        </h1>
        <ul className='hidden md:flex flex-row ml-auto space-x-6 text-lg text-gray-800'>
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
