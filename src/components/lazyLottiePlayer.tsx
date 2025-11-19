import type {
  IPlayerProps,
  Player,
  PlayerEvent,
} from '@lottiefiles/react-lottie-player'
import dynamic from 'next/dynamic'
import {forwardRef, PropsWithoutRef} from 'react'

const LottiePlayer = dynamic(() => import('@/components/lottiePlayer'), {
  ssr: false,
})

export const LazyLottiePlayer = forwardRef<
  Player,
  PropsWithoutRef<IPlayerProps>
>(function LazyLottiePlayer(props, ref) {
  return <LottiePlayer {...props} playerRef={ref} />
})

export type {Player, PlayerEvent}
