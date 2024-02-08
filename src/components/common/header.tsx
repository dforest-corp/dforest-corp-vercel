import Link from 'next/link'
import DropDownMenu from '../home/dropDownMenu'

const Header = () => {
  return (
    <header>
      <div className='py-6 px-4 xl:px-0 flex flex-row max-w-screen-xl mx-auto'>
        <h1 className='text-3xl font-bold text-dforest-green italic'>
          <Link href='/'>D-FOREST</Link>
        </h1>
        <ul className='hidden md:flex flex-row ml-auto space-x-6 text-lg text-gray-800'>
          <li>
            <Link href='/company'>
              会社案内
            </Link>
          </li>
          <li>
            <Link href='/works'>
              事業内容
            </Link>
          </li>
          <li>
            <Link href='/contacts'>
              お問い合わせ
            </Link>
          </li>
        </ul>
        <DropDownMenu />
      </div>
    </header>
  )
}

export default Header
