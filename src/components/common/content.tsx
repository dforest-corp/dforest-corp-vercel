'use client'

import HtmlView from '@/components/common/htmlView'
import {sanitize} from '@/utils/sanitize'

export type ContentProps = {
  content: string
}

const Content = ({content}: ContentProps) => {
  return (
    <div className='prose prose-blue max-w-none'>
      <HtmlView html={sanitize(content)} />
    </div>
  )
}

export default Content
