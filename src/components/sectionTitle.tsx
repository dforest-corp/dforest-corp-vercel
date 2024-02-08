import {PropsWithChildren} from 'react'

export const SectionTitle = ({children}: PropsWithChildren) => {
  return (
    <h2 className="text-3xl font-bold tracking-wider text-dforest-green">
      {children}
    </h2>
  )
}
