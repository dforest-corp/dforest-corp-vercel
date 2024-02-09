'use client'

import {usePathname} from 'next/navigation'
import {useEffect, useRef} from 'react'

function isReload() {
  const perfEntries = performance.getEntriesByType('navigation')
  if (!perfEntries.length) return false
  const entry = perfEntries[0] as PerformanceNavigationTiming
  return entry.type === 'reload'
}

function IntroScreenContent() {
  useEffect(() => {
    document.body.classList.add('overflow-hidden')
    setTimeout(() => {
      document.body.classList.remove('overflow-hidden')
    }, 2000)
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  return (
    <div className="fixed left-0 top-0 h-full w-full animate-slide-up bg-dforest-green delay-2000">
      <div className="absolute left-0 top-0 flex h-full w-full animate-fade-out items-center justify-center bg-white delay-1500">
        <p className="animate-up-fade text-4xl font-bold italic text-dforest-green delay-1000 lg:text-6xl">
          D-FOREST
        </p>
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
