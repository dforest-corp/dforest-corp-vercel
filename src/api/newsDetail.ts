import {APIError, cmsClient} from '@/dataSource/cmsClient'
import {EndPoints} from '@/types/cmsType'
import {notFound} from 'next/navigation'

const NewsDetailAPI = {
  fetch: async (id: string) => {
    try {
      return await cmsClient<EndPoints['get']['news']>(`news/${id}`)
    } catch (e: unknown) {
      if (e instanceof APIError) {
        if (e.response.status === 404) {
          notFound()
        }
      }
      throw e
    }
  },
}

export default NewsDetailAPI
