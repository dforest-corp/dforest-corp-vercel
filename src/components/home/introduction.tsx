'use client'

import Link from 'next/link'
import {MdArrowForward} from 'react-icons/md'
import IntroductionLottie from '@/components/home/introductionLottie'
import dynamic from 'next/dynamic'

const MediaQuery = dynamic(() => import('react-responsive'), {
  ssr: false
})

const Introduction = () => {
  return (
    <div className='md:relative'>
      <div className='max-w-screen-xl mx-auto px-4 xl:px-0 py-20 xl:py-40'>
        <h2
          className='text-2xl lg:text-5xl leading-normal lg:leading-relaxed font-bold xl:font-black tracking-wider'>
          多様な環境のお客様に<br />
          最適なITソリューションを
        </h2>
        <p className='mt-4 tracking-wider'>
          Creative Web and Smart phone application
        </p>
        <p className='mt-8'>
          <Link
            href='/contacts'
            className='inline-flex flex-row items-center bg-green-700 hover:bg-white border border-green-700 text-white hover:text-green-700 px-4 py-3 shadow-lg transition rounded-full'>

            <span className='tracking-wider text-lg'>
              お問い合せください
            </span>
            <MdArrowForward className='text-lg ml-2' />

          </Link>
        </p>
      </div>
      <MediaQuery minWidth={768}>
        <div className='absolute right-0 top-0 bottom-0 w-1/2'>
          <IntroductionLottie />
        </div>
      </MediaQuery>
    </div>
  );
}

export default Introduction
