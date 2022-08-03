import type {GetStaticProps, NextPage} from 'next'
import {NextSeo} from 'next-seo'
import {EndPoints} from '@/types/cmsType'
import TreeLottiePrefetch from '@/components/home/treeLottiePrefetch'
import Header from '../components/common/header'
import Introduction from '@/components/home/introduction'
import ShopAppInformation from '../components/home/shopAppInformation'
import Guidance from '../components/home/guidance'
import ServiceTree from '../components/home/serviceTree'
import NewsList from '../components/home/newsList'
import BottomContactGuide from '@/components/home/bottomContactGuide'
import Footer from '../components/common/footer'
import NewsListAPI from '@/api/newsList'

type HomeProps = {
  news: EndPoints['gets']['news']
}

const Home: NextPage<HomeProps> = ({news}) => {
  return (
    <>
      <TreeLottiePrefetch />
      <NextSeo
        title={'D-FOREST | Creative Web and Smart phone application'}
        description={'スマホアプリ・ホームページを制作します。スマートフォンへの対応もおまかせください。'}
      />
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

export const getStaticProps: GetStaticProps<HomeProps> = async (context) => {
  const news = await NewsListAPI.fetchList()
  return {
    props: {
      news
    },
    revalidate: 86400
  }
}

export default Home
