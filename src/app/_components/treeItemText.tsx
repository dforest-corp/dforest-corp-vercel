/** @package */

import {ReactNode} from 'react'

type Props = {
  title: string
  children: ReactNode
}

export const TreeItemText = ({title, children}: Props) => {
  return (
    <div className="grid flex-1 gap-4">
      <h4 className="text-3xl font-bold tracking-wide text-white xl:font-black">
        {title}
      </h4>
      <p className="leading-relaxed text-green-50">{children}</p>
    </div>
  )
}
