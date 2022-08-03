import {GetStaticPaths, GetStaticProps, NextPage} from 'next'
import {NextSeo} from 'next-seo'
import {EndPoints} from '@/types/cmsType'
import Header from '@/components/common/header'
import NewsView from '@/components/news/newsView'
import Footer from '@/components/common/footer'
import NewsListAPI from '@/api/newsList'
import NewsDetailAPI from '@/api/newsDetail'

type NewsPageProps = {
  news: EndPoints['get']['news']
}

const NewsPage: NextPage<NewsPageProps> = ({news}) => {
  return (
    <>
      <NextSeo
        title={`${news.title} | D-FOREST`}
      />
      <div className='grid grid-cols-1 gap-20'>
        <Header />
        <NewsView news={news} />
        <Footer />
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await NewsListAPI.fetchIdPaths()
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<NewsPageProps, {id: string}> = async ({params}) => {
  if (params === undefined) {
    return {
      notFound: true
    }
  }
  const news = await NewsDetailAPI.fetch(params.id)
  return {
    props: {
      news
    },
    revalidate: 86400
  }
}

export default NewsPage