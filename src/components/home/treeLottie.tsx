import {memo} from 'react'
import {Player} from '@lottiefiles/react-lottie-player'

export type TreeLottieProps = {
  animationPath: any
}

const TreeLottie = memo(({animationPath}: TreeLottieProps) => {
  return (
    <div className={`aspect-square`}>
      <Player
        src={animationPath}
        loop
        autoplay
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
