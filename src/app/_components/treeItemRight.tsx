'use client'

import {ReactNode} from 'react'
import {TreeItemText} from './treeItemText'
import {useInView} from 'react-intersection-observer'
import {TreeLottie} from '@/app/_components/treeLottie'
import clsx from '@/utils/clsx'

type TreeItemRightProps = {
  lottiePath: string
  title: string
  children: ReactNode
}

/** @package */
export const TreeItemRight = ({
  title,
  lottiePath,
  children,
}: TreeItemRightProps) => {
  const [ref, inView] = useInView({
    rootMargin: '-20%',
    triggerOnce: true,
  })

  return (
    <div ref={ref}>
      <div className="flex flex-col items-center md:flex-row">
        <TreeItemText
          title={title}
          className={clsx(inView && 'animate-tree-right')}
        >
          {children}
        </TreeItemText>
        <div
          className={clsx(
            'ml-0 mt-4 flex-1 text-center opacity-0 md:ml-4 md:mt-0',
            inView && 'animate-fade-in',
          )}
        >
          <TreeLottie animationPath={lottiePath} />
        </div>
      </div>
    </div>
  )
}
