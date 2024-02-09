'use client'

import {memo, useRef, useState} from 'react'
import {Player, PlayerEvent} from '@lottiefiles/react-lottie-player'
import {useInView} from 'react-intersection-observer'

/** @package */
export const IntroductionLottie = memo(() => {
  const playerRef = useRef<Player>(null)
  const [loaded, setLoaded] = useState(false)

  const checkMatchMedia = () => {
    return window.matchMedia('(min-width: 768px)').matches
  }

  const [ref, inView] = useInView({
    onChange: (inView) => {
      setTimeout(() => {
        if (!loaded) {
          return
        }
        if (inView && checkMatchMedia()) {
          playerRef.current?.play()
        } else {
          playerRef.current?.stop()
        }
      }, 100)
    },
  })

  const onEvent = (event: PlayerEvent) => {
    if (event === PlayerEvent.Load) {
      setLoaded(true)
      if (inView && checkMatchMedia()) {
        requestAnimationFrame(() => {
          playerRef.current?.play()
        })
      } else {
        playerRef.current?.stop()
      }
    }
  }

  return (
    <div ref={ref} className="-mr-[15%] -mt-[20%] overflow-visible">
      <Player
        ref={playerRef}
        src="/lottie/intro.json"
        loop
        onEvent={onEvent}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice',
        }}
        className="aspect-[865/602] w-full"
        renderer="canvas"
      />
    </div>
  )
})
IntroductionLottie.displayName = 'IntroductionLottie'
