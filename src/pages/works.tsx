import type {GetStaticProps, NextPage} from 'next'
import {NextSeo} from 'next-seo'
import {EndPoints} from '@/types/cmsType'
import Header from '@/components/common/header'
import WorksInformation from '@/components/works/worksInformation'
import Footer from '@/components/common/footer'
import PostAPI from '@/api/post'

type WorksProps = {
  post: EndPoints['get']['news']
}

const Works: NextPage<WorksProps> = ({post}) => {
  return (
    <>
      <NextSeo
        title={'事業案内 | D-FOREST'}
        description={'株式会社ディー・フォレストの事業案内です。'}
      />
      <div className='grid grid-cols-1 gap-20'>
        <Header />
        <WorksInformation post={post} />
        <Footer />
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps<WorksProps> = async () => {
  const post = await PostAPI.fetchWork()

  return {
    props: {
      post
    },
    revalidate: 86400
  }
}

export default Works