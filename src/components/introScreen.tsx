'use client'

import {usePathname} from 'next/navigation'
import {useRef} from 'react'
import logoImage from '@/assets/logo.png'
import Image from 'next/image'
import {useScrollLock} from '@/utils/useScrollLock'

function isReload() {
  const perfEntries = performance.getEntriesByType('navigation')
  if (!perfEntries.length) return false
  const entry = perfEntries[0] as PerformanceNavigationTiming
  return entry.type === 'reload'
}

function IntroScreenContent() {
  useScrollLock(true, 2000)

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

export default function IntroScreen() {
  const pathName = useRef(usePathname()).current
  const isNotTop = pathName !== '/'
  const reload = isReload()

  const hideIntro = isNotTop || reload

  if (hideIntro) return null

  return <IntroScreenContent />
}
