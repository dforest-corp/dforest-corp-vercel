import ky from 'ky'

const cmsClient = ky.create({
  prefixUrl: process.env.MICROCMS_ENDPOINT,
  headers: {
    'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY
  }
})

export default cmsClient