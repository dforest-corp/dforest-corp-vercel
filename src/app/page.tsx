import NewsListAPI from '@/api/newsList'
import Header from '@/components/common/header'
import Introduction from '@/components/home/introduction'
import ShopAppInformation from '@/components/home/shopAppInformation'
import Guidance from '@/components/home/guidance'
import ServiceTree from '@/components/home/serviceTree'
import NewsList from '@/components/home/newsList'
import BottomContactGuide from '@/components/home/bottomContactGuide'
import Footer from '@/components/common/footer'
import {Metadata} from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'D-FOREST | Creative Web and Smart phone application'
  },
  description: 'スマホアプリ・ホームページを制作します。スマートフォンへの対応もおまかせください。'
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
