import Link from 'next/link'
import {MdArrowForward} from 'react-icons/md'

const BottomContactGuide = () => {
  return (
    <div className='bg-green-50 py-20'>
      <div className='max-w-screen-xl mx-auto px-2 xl:px-0'>
        <h4 className='text-2xl tracking-wider font-bold'>
          開発のご相談はお問い合わせください
        </h4>
        <p className='mt-2 tracking-wide'>
          メールもしくは電話でのご相談を承っております。<br/>
          まずはお気軽にお問い合わせください。
        </p>
        <p className='mt-8'>
          <Link
            href='/contacts'
            className='inline-flex flex-row items-center bg-green-700 hover:bg-white border border-green-700 text-white hover:text-green-700 px-4 py-3 shadow-lg transition rounded-full'>

            <span className='tracking-wider text-lg'>
              お問い合せフォームへ
            </span>
            <MdArrowForward className='text-lg ml-2' />

          </Link>
        </p>
      </div>
    </div>
  );
}

export default BottomContactGuide