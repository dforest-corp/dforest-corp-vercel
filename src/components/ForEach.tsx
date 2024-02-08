import React from 'react'

export type ForEachProps<T> = {
  children: (item: T) => React.ReactElement
  items: T[]
}

export const ForEach = <T,>({items, children}: ForEachProps<T>) => {
  return <>{items.map((item) => children(item))}</>
}
