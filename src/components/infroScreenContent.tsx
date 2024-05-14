'use client'

import {useScrollLock} from '@/utils/useScrollLock'
import Image from 'next/image'
import logoImage from '@/assets/logo.png'
import {useEffect, useRef} from 'react'
import {setReloadCookie} from '@/components/introScreenActions'
import {useFirstPageRemember} from '@/components/firstPageRemember'
import {usePathname} from 'next/navigation'

export function IntroScreenContent() {
  const loadPathName = useRef(usePathname()).current
  const pathName = useFirstPageRemember()
  const isTop =
    pathName === '/' || (pathName === undefined && loadPathName === '/')

  useScrollLock(isTop, 2000)

  useEffect(() => {
    if (!isTop) return
    setTimeout(() => {
      void setReloadCookie()
    }, 3000)
  }, [isTop])

  if (!isTop) return null

  return (
    <div className="fixed left-0 top-0 h-full w-full animate-slide-up bg-dforest-green delay-2000">
      <div className="absolute left-0 top-0 flex h-full w-full animate-fade-out items-center justify-center bg-white delay-1500">
        <Image
          src={logoImage}
          alt="D-FOREST"
          className="w-full max-w-[200px] animate-up-fade delay-1000 lg:max-w-[296px]"
          sizes="(max-width: 1024px) 200px, 296px"
        />
      </div>
    </div>
  )
}
