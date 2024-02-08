'use client'

import dynamic from 'next/dynamic'

const HtmlView = dynamic(() => import('@/components/common/htmlView'), {ssr: false})

export type ContentProps = {
  content: string
}

const Content = ({content}: ContentProps) => {
  return (
    <div className='prose prose-blue max-w-none'>
      <HtmlView html={content} />
    </div>
  )
}

export default Content
