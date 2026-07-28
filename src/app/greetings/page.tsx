import PostAPI from '@/api/post'
import {Metadata} from 'next'
import {SectionTitle} from '@/components/sectionTitle'
import {Content} from '@/components/content'
import {ReaderLayout} from '@/components/readerLayout'

// Webhook が届かなかった場合の保険（src/app/news/[id]/page.tsx 参照）
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'ご挨拶',
  description:
    '株式会社ディー・フォレストのご挨拶ページです。自社システムとしてオンライン予約システム、動画配信システム、お店ポイントアプリの紹介を行っています。',
}

export default async function Greetings() {
  const post = await PostAPI.fetchGreetings()

  return (
    <div className="grid grid-cols-1 gap-20 py-20">
      <ReaderLayout>
        <div className="grid gap-10">
          <SectionTitle>{post.title}</SectionTitle>
          <Content content={post.content} />
        </div>
      </ReaderLayout>
    </div>
  )
}
