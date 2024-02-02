'use client'

import {useAnimation, motion} from 'framer-motion'
import {useInView} from 'react-intersection-observer'
import {useEffect} from 'react'

const boxVariant = {
  visible: {opacity: 1, y: 0, transition: {duration: 0.5}},
  hidden: {opacity: 0, y: 100}
}

const Guidance = () => {
  const control = useAnimation()
  const [ref, inView] = useInView({
    rootMargin: '-20%',
    triggerOnce: true,
  })
  useEffect(() => {
    if (inView) {
      control.start('visible')
    }
  }, [control, inView])

  return (
    <div ref={ref}>
      <motion.p
        className='text-center max-w-screen-md mx-auto px-2 md:px-0 py-20 tracking-wider leading-loose text-lg font-semibold'
        animate={control}
        initial={'hidden'}
        variants={boxVariant}>
        近年のビジネスにおけるIT(Information Technology)の活用は、<br />
        目覚しいハードウェアの進化により刻々と変わりつつあります。<br />
        ソフトウェアの利用方法は従来のPCにおけるアプリケーションの利用に加えて、<br />
        スマートフォンなどでも利用できるWebブラウザやネイティブをフロントエンドとした<br />
        サーバー、クライアント型ソフトウェア活用が盛んに行われております。<br />
        このような環境の中でお客様にとっての最適なITソリューションをご提案します。
      </motion.p>
    </div>
  )
}

export default Guidance
