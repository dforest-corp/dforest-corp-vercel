import cmsClient from '@/dataSource/cmsClient'
import {EndPoints} from '@/types/cmsType'

const NewsDetailAPI = {
  fetch: (id: string) => {
    return cmsClient<EndPoints['get']['news']>(`news/${id}`)
  }
}

export default NewsDetailAPI
