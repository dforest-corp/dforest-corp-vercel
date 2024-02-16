'use client'

import {useState} from 'react'
import clsx from '@/utils/clsx'
import Link from 'next/link'
import {MdArrowForward, MdClose} from 'react-icons/md'
import {useScrollLock} from '@/utils/useScrollLock'

function LinkItem({
  href,
  children,
  onClick,
}: {
  href: string
  children: string
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex p-4 font-bold text-gray-800 transition-colors hover:bg-gray-50"
    >
      {children}
      <MdArrowForward className="ml-auto h-6 w-6 text-dforest-green" />
    </Link>
  )
}

/** @package */
export function SmMenu() {
  const [openMenu, setOpenMenu] = useState(false)
  useScrollLock(openMenu)

  const closeMenu = () => setOpenMenu(false)

  return (
    <div className="ml-auto block md:hidden">
      <button
        type="button"
        aria-label="メニューを開く"
        className={clsx('hamburger-icon', openMenu && 'active')}
        onClick={() => setOpenMenu(!openMenu)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div
        className={clsx(
          'fixed bottom-0 left-0 right-0 top-0 z-50 -translate-y-full bg-white px-4 py-10 transition duration-500 ease-out',
          openMenu && 'translate-y-0',
        )}
      >
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="メニューを閉じる"
            onClick={closeMenu}
            className="rounded-full bg-black bg-opacity-20 p-2"
          >
            <MdClose className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-8 divide-y border-y">
          <LinkItem href="/" onClick={closeMenu}>
            トップページ
          </LinkItem>
          <LinkItem href="/company" onClick={closeMenu}>
            会社案内
          </LinkItem>
          <LinkItem href="/works" onClick={closeMenu}>
            事業内容
          </LinkItem>
          <LinkItem href="/contacts" onClick={closeMenu}>
            お問い合わせ
          </LinkItem>
        </nav>
      </div>
    </div>
  )
}
