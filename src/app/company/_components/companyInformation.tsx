/** @package */

import {ReaderLayout} from '@/components/readerLayout'
import {SectionTitle} from '@/components/sectionTitle'
import {Content} from '@/components/content'
import PostAPI from '@/api/post'

export async function CompanyInformation() {
  const post = await PostAPI.fetchCompany()

  return (
    <ReaderLayout>
      <div className="grid gap-10">
        <SectionTitle>{post.title}</SectionTitle>
        <Content content={post.content} />
      </div>
    </ReaderLayout>
  )
}
