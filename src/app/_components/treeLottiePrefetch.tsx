'use client'

/** @package */

import ReactDOM from 'react-dom'

export const TreeLottiePrefetch = () => {
  ReactDOM.preload('/lottie/tree1.json', {
    as: 'fetch',
    crossOrigin: 'anonymous',
  })
  ReactDOM.preload('/lottie/tree2.json', {
    as: 'fetch',
    crossOrigin: 'anonymous',
  })
  ReactDOM.preload('/lottie/tree3.json', {
    as: 'fetch',
    crossOrigin: 'anonymous',
  })
  ReactDOM.preload('/lottie/tree4.json', {
    as: 'fetch',
    crossOrigin: 'anonymous',
  })

  return null
}
