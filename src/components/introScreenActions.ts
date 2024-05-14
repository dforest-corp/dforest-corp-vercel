'use server'

import {cookies, headers} from 'next/headers'

const cookieName = '__first__load__'

export async function setReloadCookie() {
  cookies().set(cookieName, 'true')
}

export async function isReload() {
  const cookie = cookies().get(cookieName)
  return !!cookie?.value
}

export async function isRobot() {
  const userAgent = headers().get('user-agent')
  if (!userAgent) return false
  return /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent)
}
