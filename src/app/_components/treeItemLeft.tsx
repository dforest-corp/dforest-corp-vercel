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
      <div
        className={clsx(
          'flex flex-col-reverse items-center opacity-0 md:flex-row',
          inView && 'animate-tree-left',
        )}
      >
        <div className="mr-0 mt-4 flex-1 text-center md:mr-4  md:mt-0">
          <TreeLottie animationPath={lottiePath} />
        </div>
        <TreeItemText title={title}>{children}</TreeItemText>
      </div>
    </div>
  )
}
