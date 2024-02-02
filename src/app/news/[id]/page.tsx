import NewsDetailAPI from '@/api/newsDetail'
import Header from '@/components/common/header'
import NewsView from '@/components/news/newsView'
import Footer from '@/components/common/footer'

type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({params}: Props) {
  const news = await NewsDetailAPI.fetch(params.id)

  return {
    title: news.title
  }
}

export default async function NewsDetail({params}: Props) {
  const news = await NewsDetailAPI.fetch(params.id)

  return (
    <div className="grid grid-cols-1 gap-20">
      <Header />
      <NewsView news={news} />
      <Footer />
    </div>
  )
}
