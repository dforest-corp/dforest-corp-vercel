import {IPlayerProps, Player} from '@lottiefiles/react-lottie-player'
import {ForwardedRef} from 'react'

type PlayerProps = IPlayerProps & {playerRef: ForwardedRef<Player>}

export default function LottiePlayer({playerRef, ...props}: PlayerProps) {
  return <Player {...props} ref={playerRef} />
}
