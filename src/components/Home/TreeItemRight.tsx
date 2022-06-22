import Image from 'next/image'
import {ReactNode, useEffect} from 'react'
import TreeItemText from './TreeItemText'
import {useAnimation, motion} from 'framer-motion'
import {useInView} from 'react-intersection-observer'

const boxVariant = {
  visible: {opacity: 1, x: 0, transition: {duration: 0.5}},
  hidden: {opacity: 0, x: 500}
}

type TreeItemRightProps = {
  src: string
  title: string
  children: ReactNode
}

const TreeItemRight = ({title, src, children}: TreeItemRightProps) => {
  const control = useAnimation()
  const [ref, inView] = useInView({
    rootMargin: '-20%',
    triggerOnce: true
  })
  useEffect(() => {
    if (inView) {
      control.start('visible')
    }
  }, [control, inView])

  return (
    <div ref={ref}>
      <motion.div
        className='flex flex-col md:flex-row items-center'
        initial={'hidden'}
        animate={control}
        variants={boxVariant}>
        <TreeItemText title={title}>{children}</TreeItemText>
        <div className='flex-1 ml-0 md:ml-4 mt-4 md:mt-0 text-center'>
          <Image src={src}
                 alt={title}
                 className='rounded-md mx-auto'
                 objectFit='cover'
                 width={512}
                 height={376} />
        </div>
      </motion.div>
    </div>
  )
}

export default TreeItemRight