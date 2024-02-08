'use client'

/** @package */

import {useInView} from 'react-intersection-observer'
import clsx from '@/utils/clsx'

export const Guidance = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  return (
    <div ref={ref}>
      <p
        className={clsx(
          'mx-auto max-w-screen-md px-2 py-20 text-center text-lg font-semibold leading-loose tracking-wider md:px-0',
          inView && 'animate-fade-up-in',
        )}
      >
        近年のビジネスにおけるIT(Information Technology)の活用は、
        <br />
        目覚しいハードウェアの進化により刻々と変わりつつあります。
        <br />
        ソフトウェアの利用方法は従来のPCにおけるアプリケーションの利用に加えて、
        <br />
        スマートフォンなどでも利用できるWebブラウザやネイティブをフロントエンドとした
        <br />
        サーバー、クライアント型ソフトウェア活用が盛んに行われております。
        <br />
        このような環境の中でお客様にとっての最適なITソリューションをご提案します。
      </p>
    </div>
  )
}
