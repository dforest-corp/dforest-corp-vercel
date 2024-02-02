import {Menu, Transition} from '@headlessui/react'
import {MdMenu} from 'react-icons/md'
import Link, {LinkProps} from 'next/link'
import {ComponentPropsWithoutRef, ReactNode} from 'react'

type NextLinkProps = LinkProps & Omit<ComponentPropsWithoutRef<'a'>, 'href'>

const NextLink = ({href, children, ...rest}: NextLinkProps) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
)

type MenuItem = {
  href: LinkProps['href']
  children: ReactNode
}

const DropDownMenuItem = ({href, children}: MenuItem) => (
  <Menu.Item>
    {({active}) => (
      <NextLink href={href} className={`${
        active ? 'bg-green-700 text-white' : 'text-gray-900'
      } group flex w-full items-center rounded-md px-2 py-2 text-sm transition`}>
        {children}
      </NextLink>
    )}
  </Menu.Item>
)

const DropDownMenu = () => {
  return (
    <div className='block md:hidden ml-auto flex items-center'>
      <Menu>
        <Menu.Button className='focus:outline-none focus-visible:ring-0' aria-label='メニュー'>
          <MdMenu size={30} />
        </Menu.Button>
        <Transition
          enter='transition duration-100 ease-out'
          enterFrom='transform scale-95 opacity-0'
          enterTo='transform scale-100 opacity-100'
          leave='transition duration-75 ease-out'
          leaveFrom='transform scale-100 opacity-100'
          leaveTo='transform scale-95 opacity-0'
        >
          <Menu.Items
            className='absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='px-1 py-1 divide-y divide-gray-100'>
              <DropDownMenuItem href='/company'>
                会社案内
              </DropDownMenuItem>
              <DropDownMenuItem href='/works'>
                事業内容
              </DropDownMenuItem>
              <DropDownMenuItem href='/contacts'>
                お問い合せ
              </DropDownMenuItem>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default DropDownMenu