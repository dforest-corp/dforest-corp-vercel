'use client'

import {ReactNode} from 'react'
import {TreeItemText} from './treeItemText'
import {useInView} from 'react-intersection-observer'
import {TreeLottie} from '@/app/_components/treeLottie'
import clsx from '@/utils/clsx'

type TreeItemLeftProps = {
  lottiePath: string
  title: string
  children: ReactNode
}

/** @package */
export const TreeItemLeft = ({
  lottiePath,
  title,
  children,
}: TreeItemLeftProps) => {
  const [ref, inView] = useInView({
    rootMargin: '-20%',
    triggerOnce: true,
  })

  return (
    <div ref={ref}>
      <div className="flex flex-col-reverse items-center md:flex-row">
        <div
          className={clsx(
            'mr-0 mt-4 flex-1 text-center opacity-0  md:mr-4 md:mt-0',
            inView && 'animate-fade-in',
          )}
        >
          <TreeLottie animationPath={lottiePath} />
        </div>
        <TreeItemText
          title={title}
          className={clsx(inView && 'animate-tree-left')}
        >
          {children}
        </TreeItemText>
      </div>
    </div>
  )
}
