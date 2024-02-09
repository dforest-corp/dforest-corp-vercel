/** @package */

import {memo, useRef} from 'react'
import {Player} from '@lottiefiles/react-lottie-player'
import {useInView} from 'react-intersection-observer'

export const IntroductionLottie = memo(() => {
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
    <div ref={ref} className="-mt-[15%] overflow-visible">
      <Player
        ref={playerRef}
        src="/lottie/intro.json"
        loop
        autoplay
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice',
        }}
        className="aspect-[865/602] w-full cursor-default"
        renderer="canvas"
      />
    </div>
  )
})
IntroductionLottie.displayName = 'IntroductionLottie'
