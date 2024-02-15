/** @package */

import {ReactNode} from 'react'
import clsx from '@/utils/clsx'

type Props = {
  title: string
  children: ReactNode
  className?: string
}

export const TreeItemText = ({title, children, className}: Props) => {
  return (
    <div className={clsx('grid flex-1 gap-4 opacity-0', className)}>
      <h4 className="text-3xl font-bold tracking-wide text-white xl:font-black">
        {title}
      </h4>
      <p className="leading-relaxed text-green-50">{children}</p>
    </div>
  )
}
