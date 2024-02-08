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
        <Image
          src="/images/shop-app.webp"
          alt="ショップdeアプリ"
          className="rounded-lg shadow-lg"
          width={750}
          height={500}
        />
      </div>
    </div>
  )
}
