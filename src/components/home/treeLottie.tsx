import {memo, useRef} from 'react'
import {Player} from '@lottiefiles/react-lottie-player'
import {useInView} from 'react-intersection-observer'

export type TreeLottieProps = {
  animationPath: any
}

const TreeLottie = memo(({animationPath}: TreeLottieProps) => {
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
    <div ref={ref} className={`aspect-square`}>
      <Player
        ref={playerRef}
        src={animationPath}
        loop
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid meet'
        }}
        className="cursor-default max-w-[1000px]"
      />
    </div>
  )
})
TreeLottie.displayName = 'TreeLottie'

export default TreeLottie
