import {ReactNode} from 'react'
import TreeItemText from './treeItemText'
import {useInView} from 'react-intersection-observer'
import TreeLottie from '@/components/home/treeLottie'
import clsx from '@/utils/clsx'

type TreeItemRightProps = {
  lottiePath: string
  title: string
  children: ReactNode
}

const TreeItemRight = ({title, lottiePath, children}: TreeItemRightProps) => {
  const [ref, inView] = useInView({
    rootMargin: '-20%',
    triggerOnce: true,
  })

  return (
    <div ref={ref}>
      <div
        className={clsx(
          'flex flex-col items-center opacity-0 md:flex-row',
          inView && 'animate-tree-right',
        )}
      >
        <TreeItemText title={title}>{children}</TreeItemText>
        <div className="ml-0 mt-4 flex-1 text-center md:ml-4 md:mt-0">
          <TreeLottie animationPath={lottiePath} />
        </div>
      </div>
    </div>
  )
}

export default TreeItemRight
