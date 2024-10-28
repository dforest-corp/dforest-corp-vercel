import NewsDetailAPI from '@/api/newsDetail'
import {NewsView} from '@/app/news/[id]/_components'

type Props = {
  params: Promise<{
    id: string
  }>
}

export const runtime = 'edge'

export async function generateMetadata(props: Props) {
  const params = await props.params
  const news = await NewsDetailAPI.fetch(params.id)

  return {
    title: news.title,
  }
}

export default async function NewsDetail(props: Props) {
  const params = await props.params
  const news = await NewsDetailAPI.fetch(params.id)

  return (
    <div className="grid grid-cols-1 gap-20 py-20">
      <NewsView news={news} />
    </div>
  )
}
