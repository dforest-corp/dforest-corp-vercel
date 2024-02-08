import cmsClient from '@/dataSource/cmsClient'
import {EndPoints} from '@/types/cmsType'

const NewsDetailAPI = {
  fetch: (id: string) => {
    return cmsClient.get(`news/${id}`).json<EndPoints['get']['news']>()
  }
}

export default NewsDetailAPI
