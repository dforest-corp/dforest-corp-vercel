import {memo} from 'react'
import {Player} from '@lottiefiles/react-lottie-player'

const IntroductionLottie = memo(() => {
  return (
    <Player
      src="/lottie/intro.json"
      loop
      autoplay
      rendererSettings={{
        preserveAspectRatio: 'xMidYMid slice'
      }}
      className="cursor-default max-w-[1000px]"
    />
  )
})
IntroductionLottie.displayName = 'IntroductionLottie'

export default IntroductionLottie
