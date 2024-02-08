import cmsClient from '@/dataSource/cmsClient'
import {EndPoints} from '@/types/cmsType'

const PostAPI = {
  fetchCompany: () => {
    return cmsClient.get(`news/${process.env.COMPANY_POST_ID}`).json<EndPoints['get']['news']>()
  },
  fetchWork: () => {
    return cmsClient.get(`news/${process.env.WORKS_POST_ID}`).json<EndPoints['get']['news']>()
  }
}

export default PostAPI
