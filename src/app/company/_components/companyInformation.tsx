/** @package */

import {EndPoints} from '@/types/cmsType'
import {ReaderLayout} from '@/components/readerLayout'
import {SectionTitle} from '@/components/sectionTitle'
import {Content} from '@/components/content'

export type CompanyInformationProps = {
  post: EndPoints['get']['news']
}

export const CompanyInformation = ({post}: CompanyInformationProps) => {
  return (
    <ReaderLayout>
      <div className="grid gap-10">
        <SectionTitle>{post.title}</SectionTitle>
        <Content content={post.content} />
      </div>
    </ReaderLayout>
  )
}
