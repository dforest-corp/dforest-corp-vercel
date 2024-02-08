/** @package */

import {EndPoints} from '@/types/cmsType'
import {ReaderLayout} from '@/components/readerLayout'
import {SectionTitle} from '@/components/sectionTitle'
import {Content} from '@/components/content'

type WorksInformationProps = {
  post: EndPoints['get']['news']
}

export const WorksInformation = ({post}: WorksInformationProps) => {
  return (
    <ReaderLayout>
      <div className="grid gap-10">
        <SectionTitle>{post.title}</SectionTitle>
        <Content content={post.content} />
      </div>
    </ReaderLayout>
  )
}
