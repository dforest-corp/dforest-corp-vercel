import {PropsWithChildren} from 'react'

export const ReaderLayout = ({children}: PropsWithChildren) => {
  return (
    <div>
      <div className="mx-auto max-w-(--breakpoint-md) px-4 xl:px-0">
        {children}
      </div>
    </div>
  )
}
