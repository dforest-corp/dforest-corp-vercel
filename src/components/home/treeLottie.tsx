import {memo, useEffect, useMemo, useState} from 'react'
import Lottie, {Options} from 'react-lottie'
import ky from 'ky'
import {useInView} from 'react-intersection-observer'
import MayBe from '@/components/common/MayBe'

export type TreeLottieProps = {
  animationPath: any
}

const TreeLottie = memo(({animationPath}: TreeLottieProps) => {
  const [animationData, setAnimationData] = useState<any>()

  const [ref, inView] = useInView({
    triggerOnce: true
  })

  useEffect(() => {
    if (inView) {
      ky.get(animationPath).json<any>().then(setAnimationData)
    }
  }, [animationPath, inView])

  const defaultOptions = useMemo((): Options => ({
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet'
    }
  }), [animationData])

  return (
    <div ref={ref} className={`aspect-square`}>
      <MayBe test={animationData !== undefined}>
        <Lottie options={defaultOptions}
                isClickToPauseDisabled
                style={{cursor: 'default', maxWidth: 1000}} />
      </MayBe>
    </div>
  )
})
TreeLottie.displayName = 'TreeLottie'

export default TreeLottie