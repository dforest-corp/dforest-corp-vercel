/** @package */

import Link from 'next/link'
import {MdArrowForward} from 'react-icons/md'
import {IntroductionLottie} from '@/app/_components/introductionLottie'
import {Josefin_Sans} from 'next/font/google'

const enFont = Josefin_Sans({
  weight: '400',
  subsets: ['latin'],
})

export const Introduction = () => {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-20 xl:px-0 xl:pb-10 xl:pt-40">
      <div className="flex gap-4">
        <div>
          <h2 className="text-2xl font-bold leading-normal tracking-wider lg:text-5xl lg:leading-relaxed xl:font-black">
            多様な環境のお客様に
            <br />
            <span className="bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
              最適なITソリューションを
            </span>
          </h2>
          <p className={`mt-4 tracking-wider ${enFont.className}`}>
            Creative Web and Smart phone application
          </p>
          <p className="mt-8">
            <Link
              href={'/contacts'}
              className="inline-flex flex-row items-center rounded-full border border-green-700 bg-green-700 px-4 py-3 text-white shadow-lg transition hover:bg-white hover:text-green-700"
            >
              <span className="text-lg tracking-wider">お問い合せください</span>
              <MdArrowForward className="ml-2 text-lg" />
            </Link>
          </p>
        </div>
        <div className="flex-1">
          <IntroductionLottie />
        </div>
      </div>
    </div>
  )
}
