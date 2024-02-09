'use client'

import clsx from '@/utils/clsx'
import Image from 'next/image'
import {useInView} from 'react-intersection-observer'

export function ShopAppImage() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  return (
    <div ref={ref}>
      <div
        className={clsx(
          'mt-8 flex justify-center opacity-0',
          inView && 'animate-fade-up-in',
        )}
      >
        <div className="relative pb-4 pr-4 after:absolute after:bottom-0 after:left-4 after:right-0 after:top-4 after:rounded-2xl after:bg-green-700">
          <Image
            src="/images/shop-app.webp"
            alt="ショップdeアプリ"
            className="relative z-10 rounded-2xl shadow shadow-dforest-green"
            width={750}
            height={500}
            loading="eager"
          />
        </div>
      </div>
    </div>
  )
}
