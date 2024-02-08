import {cmsClient} from '@/dataSource/cmsClient'
import {EndPoints} from '@/types/cmsType'

const NewsListAPI = {
  fetchList: async () => {
    return cmsClient<EndPoints['gets']['news']>('news', {
      searchParams: {
        filters: `category[equals]${process.env.NOTICE_CATEGORY_ID}`,
        fields: `id,title,publishedAt`,
      },
    })
  },
  fetchIdPaths: async () => {
    const news = await cmsClient<EndPoints['gets']['news']>('news', {
      searchParams: {
        filters: `category[equals]${process.env.NOTICE_CATEGORY_ID}`,
        fields: `id`,
        limit: '100',
      },
    })
    return news.contents.map((item) => ({
      params: {
        id: item.id,
      },
    }))
  },
}

export default NewsListAPI
