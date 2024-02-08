/** @package */

import {ReaderLayout} from '@/components/readerLayout'
import {SectionTitle} from '@/components/sectionTitle'
import {Content} from '@/components/content'
import PostAPI from '@/api/post'

export async function WorksInformation() {
  const post = await PostAPI.fetchWork()

  return (
    <ReaderLayout>
      <div className="grid gap-10">
        <SectionTitle>{post.title}</SectionTitle>
        <Content content={post.content} />
      </div>
    </ReaderLayout>
  )
}
