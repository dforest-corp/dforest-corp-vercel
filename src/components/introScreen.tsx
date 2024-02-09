'use client'

import {usePathname} from 'next/navigation'
import {useEffect, useRef, useState} from 'react'

function isRobot() {
  if (typeof navigator === 'undefined') return false
  const userAgent = navigator.userAgent
  if (!userAgent) return false
  return !!userAgent.match(/bot|crawl|slurp|spider/i)
}

function isReload() {
  if (typeof performance === 'undefined') return false
  const perfEntries = performance.getEntriesByType('navigation')
  if (!perfEntries.length) return false
  const entry = perfEntries[0] as PerformanceNavigationTiming
  return entry.type === 'reload'
}

export function IntroScreen() {
  const [hideIntro, setHideIntro] = useState<boolean>()
  const pathName = useRef(usePathname()).current

  useEffect(() => {
    const isNotTop = pathName !== '/'
    const robot = isRobot()
    const reload = isReload()
    setHideIntro(robot || reload || isNotTop)
  }, [pathName])

  useEffect(() => {
    if (hideIntro !== false) return
    document.body.classList.add('overflow-hidden')
    setTimeout(() => {
      document.body.classList.remove('overflow-hidden')
    }, 2000)
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [hideIntro])

  if (hideIntro === undefined) {
    return <div className="fixed left-0 top-0 h-full w-full bg-white" />
  }
  if (hideIntro) return null

  return (
    <div className="fixed left-0 top-0 h-full  w-full animate-slide-up bg-dforest-green delay-2000">
      <div className="absolute left-0 top-0 flex h-full w-full animate-fade-out items-center justify-center bg-white delay-1500">
        <p className="animate-up-fade text-4xl font-bold italic text-dforest-green delay-1000 lg:text-6xl">
          D-FOREST
        </p>
      </div>
    </div>
  )
}
