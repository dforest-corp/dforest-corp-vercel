'use client'

import Image from 'next/image'
import Link from 'next/link'
import {MdArrowForward} from 'react-icons/md'
import {useInView} from 'react-intersection-observer'
import clsx from '@/utils/clsx'

const ShopAppInformation = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  return (
    <div className="bg-green-50 px-2 py-20 text-center">
      <h3 className="text-2xl font-bold tracking-wider lg:text-4xl xl:font-black">
        ショップdeアプリ
      </h3>
      <p className="mt-2 text-lg tracking-wider">
        簡単操作で集客＆リピーターup!
      </p>
      <p className="mt-6 leading-relaxed tracking-wider">
        恋する集客・販促アプリ「ショップdeアプリ」でどんどん”ラブレター”を送り、
        <br />
        お店に心と足を向けてもらいましょう。
      </p>
      <div ref={ref}>
        <div
          className={clsx(
            'mt-8 flex justify-center opacity-0',
            inView && 'animate-fade-up-in',
          )}
        >
          <Image
            src="/images/shop-app.webp"
            alt="ショップdeアプリ"
            className="rounded-lg shadow-lg"
            width={750}
            height={500}
          />
        </div>
      </div>
      <div className="mt-8">
        <Link
          href={'/contacts'}
          className="inline-flex flex-row items-center rounded-full border border-indigo-700 bg-indigo-700 px-6 py-2 text-white shadow-lg transition hover:bg-white hover:text-indigo-700"
        >
          <span className="text-lg tracking-wider">お問い合わせください</span>
          <MdArrowForward className="ml-2 text-lg" />
        </Link>
      </div>
    </div>
  )
}

export default ShopAppInformation
