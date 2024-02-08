'use client'

import HtmlView from '@/components/common/htmlView'

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
