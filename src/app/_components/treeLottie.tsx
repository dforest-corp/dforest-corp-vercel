/** @package */

import {memo, useRef, useState} from 'react'
import {useInView} from 'react-intersection-observer'
import {
  LazyLottiePlayer,
  Player,
  PlayerEvent,
} from '@/components/lazyLottiePlayer'

export type TreeLottieProps = {
  animationPath: any
}

export const TreeLottie = memo(({animationPath}: TreeLottieProps) => {
  const playerRef = useRef<Player>(null)
  const [loaded, setLoaded] = useState(false)

  const [ref, inView] = useInView({
    onChange: (inView) => {
      if (!loaded) {
        return
      }
      if (inView) {
        playerRef.current?.play()
      } else {
        playerRef.current?.stop()
      }
    },
  })

  const onEvent = (event: PlayerEvent) => {
    if (event === 'instanceSaved') {
      setLoaded(true)
      if (inView) {
        playerRef.current?.play()
      } else {
        playerRef.current?.stop()
      }
    }
  }

  return (
    <div ref={ref} className={`aspect-square`}>
      <LazyLottiePlayer
        ref={playerRef}
        src={animationPath}
        loop
        onEvent={onEvent}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid meet',
        }}
        className="aspect-square max-w-[1000px]"
        renderer="canvas"
      />
    </div>
  )
})
TreeLottie.displayName = 'TreeLottie'
