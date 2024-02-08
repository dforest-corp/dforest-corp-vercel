import cmsClient from '@/dataSource/cmsClient'
import {EndPoints} from '@/types/cmsType'

const PostAPI = {
  fetchCompany: () => {
    return cmsClient<EndPoints['get']['news']>(`news/${process.env.COMPANY_POST_ID}`)
  },
  fetchWork: () => {
    return cmsClient<EndPoints['get']['news']>(`news/${process.env.WORKS_POST_ID}`)
  }
}

export default PostAPI
