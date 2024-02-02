import Lottie, {Options} from 'react-lottie'
import {memo, useEffect, useMemo, useState} from 'react'
import ky from 'ky'
import MayBe from '@/components/common/MayBe'

const IntroductionLottie = memo(() => {
  const [animationData, setAnimationData] = useState<any>()

  const defaultOptions = useMemo((): Options => ({
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }), [animationData])

  useEffect(() => {
    ky.get('/lottie/intro.json').json<any>().then(setAnimationData)
  }, [])

  return (
    <MayBe test={animationData !== undefined}>
      <Lottie options={defaultOptions}
              isClickToPauseDisabled
              style={{cursor: 'default', maxWidth: 1000}} />
    </MayBe>
  )
})
IntroductionLottie.displayName = 'IntroductionLottie'

export default IntroductionLottie
