'use client'

import {usePathname} from 'next/navigation'

function isRobot() {
  const userAgent = navigator.userAgent
  if (!userAgent) return false;
  return userAgent.match(/bot|crawl|slurp|spider/i);
}

function isReload() {
  if (typeof performance === 'undefined') return false
  const perfEntries = performance.getEntriesByType('navigation')
  if (!perfEntries.length) return false
  const entry = perfEntries[0] as PerformanceNavigationTiming
  return entry.type === 'reload'
}

export function IntroScreen() {
  const pathName = usePathname()
  const robot = isRobot()
  const reload = isReload()

  if (robot || reload || pathName !== '/') return null

  return (
    <div className="animate-slide-up delay-2000 fixed left-0  top-0 h-full w-full bg-dforest-green">
      <div className="animate-fade-out delay-1500 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-white">
        <p className="animate-up-fade text-4xl font-bold text-dforest-green italic delay-1000 lg:text-6xl">
          D-FOREST
        </p>
      </div>
    </div>
  );
}
