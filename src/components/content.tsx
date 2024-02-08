'use client'

import {HtmlView} from '@/components/htmlView'

export type ContentProps = {
  content: string
}

export const Content = ({content}: ContentProps) => {
  return (
    <div className="prose prose-blue max-w-none">
      <HtmlView html={content} />
    </div>
  )
}
