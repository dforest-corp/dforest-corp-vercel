import NewsListAPI from '@/api/newsList'
import {Header} from '@/components/header'
import {Footer} from '@/components/footer'
import {Metadata} from 'next'
import {
  BottomContactGuide,
  Guidance,
  Introduction,
  NewsList,
  ServiceTree,
  ShopAppInformation,
} from '@/app/_components'

export const metadata: Metadata = {
  title: {
    absolute: 'D-FOREST | Creative Web and Smart phone application',
  },
  description:
    'スマホアプリ・ホームページを制作します。スマートフォンへの対応もおまかせください。',
}

export default async function Index() {
  const news = await NewsListAPI.fetchList()

  return (
    <>
      <Header />
      <Introduction />
      <ShopAppInformation />
      <Guidance />
      <ServiceTree />
      <NewsList items={news.contents} />
      <BottomContactGuide />
      <Footer />
    </>
  )
}
