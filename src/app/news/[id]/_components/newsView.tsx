/** @package */

import {EndPoints} from '@/types/cmsType'
import {ReaderLayout} from '@/components/readerLayout'
import {SectionTitle} from '@/components/sectionTitle'
import {Content} from '@/components/content'

type NewsViewProps = {
  news: EndPoints['get']['news']
}

export const NewsView = ({news}: NewsViewProps) => {
  return (
    <ReaderLayout>
      <div className="grid gap-10">
        <SectionTitle>{news.title}</SectionTitle>
        <Content content={news.content} />
      </div>
    </ReaderLayout>
  )
}
