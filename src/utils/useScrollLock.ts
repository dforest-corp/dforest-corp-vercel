import {useEffect} from 'react'

export function useScrollLock(lock: boolean, timeout?: number) {
  useEffect(() => {
    if (!lock) return
    if (typeof document === 'undefined') return
    document.body.classList.add('overflow-hidden')
    if (timeout) {
      setTimeout(() => {
        document.body.classList.remove('overflow-hidden')
      }, timeout)
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [lock, timeout])
}
