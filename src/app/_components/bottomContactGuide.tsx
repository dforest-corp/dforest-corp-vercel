/** @package */

import Link from 'next/link'
import {MdArrowForward} from 'react-icons/md'
import Image from 'next/image'
import contactImage from './assets/contact-image.webp'

export const BottomContactGuide = () => {
  return (
    <div className="bg-green-50 py-20">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-6 px-2 xl:flex-row xl:items-center xl:px-0">
        <div>
          <h4 className="text-2xl font-bold tracking-wider">
            開発のご相談はお問い合わせください
          </h4>
          <p className="mt-2 tracking-wide">
            メールもしくは電話でのご相談を承っております。
            <br />
            まずはお気軽にお問い合わせください。
          </p>
          <p className="mt-8">
            <Link
              href={'/contacts'}
              className="inline-flex flex-row items-center rounded-full border border-green-700 bg-green-700 px-4 py-3 text-white shadow-lg transition hover:bg-white hover:text-green-700"
            >
              <span className="text-lg tracking-wider">
                お問い合せフォームへ
              </span>
              <MdArrowForward className="ml-2 text-lg" />
            </Link>
          </p>
        </div>
        <div className="xl:ml-auto">
          <Image
            src={contactImage}
            alt="お問い合わせ"
            className="w-full max-w-xs"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      </div>
    </div>
  )
}
