'use client'

import {memo, useRef, useState} from 'react'
import {useInView} from 'react-intersection-observer'
import {
  LazyLottiePlayer,
  Player,
  PlayerEvent,
} from '@/components/lazyLottiePlayer'

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
    if (event === 'instanceSaved') {
      setLoaded(true)
      if (inView && checkMatchMedia()) {
        playerRef.current?.play()
      } else {
        playerRef.current?.stop()
      }
    }
  }

  return (
    <div ref={ref} className="-mr-[15%] -mt-[20%] overflow-visible">
      <div className="aspect-[865/602]">
        <LazyLottiePlayer
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
    </div>
  )
})
IntroductionLottie.displayName = 'IntroductionLottie'
