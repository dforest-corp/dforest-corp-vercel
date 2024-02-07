import {memo, useRef} from 'react'
import {Player} from '@lottiefiles/react-lottie-player'
import {useInView} from 'react-intersection-observer'

const IntroductionLottie = memo(() => {
  const playerRef = useRef<Player>(null)
  const [ref] = useInView({
    onChange: (inView) => {
      if (inView) {
        playerRef.current?.play()
      } else {
        playerRef.current?.pause()
      }
    },
  })

  return (
    <div ref={ref}>
      <Player
        ref={playerRef}
        src="/lottie/intro.json"
        loop
        autoplay
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice'
        }}
        className="cursor-default max-w-[1000px]"
      />
    </div>
  )
})
IntroductionLottie.displayName = 'IntroductionLottie'

export default IntroductionLottie
