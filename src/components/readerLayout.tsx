import {PropsWithChildren} from 'react'

export const ReaderLayout = ({children}: PropsWithChildren) => {
  return (
    <div>
      <div className="mx-auto max-w-screen-sm px-4 xl:px-0">{children}</div>
    </div>
  )
}
