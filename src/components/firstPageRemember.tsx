'use client'

import {useEffect, useRef} from 'react'
import {usePathname} from 'next/navigation'
import {create} from 'zustand'

interface FirstPageState {
  pathName: string | undefined
  setPathName: (pathName: string) => void
}

const useFirstPageState = create<FirstPageState>((set) => ({
  pathName: undefined,
  setPathName: (pathName: string) => set({pathName}),
}))

export function useFirstPageRemember() {
  return useFirstPageState((state) => state.pathName)
}

export function FirstPageRemember() {
  const pathName = useRef(usePathname()).current
  const setPathName = useFirstPageState((state) => state.setPathName)

  useEffect(() => {
    setPathName(pathName)
  }, [pathName, setPathName])

  return null
}
