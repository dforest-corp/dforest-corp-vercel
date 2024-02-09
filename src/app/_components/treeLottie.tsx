/** @package */

import {memo, useRef, useState} from 'react'
import {Player, PlayerEvent} from '@lottiefiles/react-lottie-player'
import {useInView} from 'react-intersection-observer'

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
    if (event === PlayerEvent.Load) {
      setLoaded(true)
      if (inView) {
        requestAnimationFrame(() => {
          playerRef.current?.play()
        })
      } else {
        playerRef.current?.stop()
      }
    }
  }

  return (
    <div ref={ref} className={`aspect-square`}>
      <Player
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
