'use client'

import {MdKeyboardArrowUp} from 'react-icons/md'

export function BackToTopButton() {
  const handleClick = () => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow transition-opacity hover:bg-gray-200 lg:hidden"
    >
      <span className="sr-only">一番上に戻る</span>
      <MdKeyboardArrowUp className="h-8 w-8 text-dforest-green" />
    </button>
  )
}
