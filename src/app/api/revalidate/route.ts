import * as crypto from 'crypto'
import {type NextRequest, NextResponse} from 'next/server'
import type {Webhook} from '@/types/cmsType'
import {revalidatePath} from 'next/cache'

async function handler(req: NextRequest) {
  const data: Webhook = await req.json()

  const expectedSignature = crypto
    .createHmac('sha256', `${process.env.MICROCMS_SECRET}`)
    .update(JSON.stringify(data))
    .digest('hex')

  const signature = `${req.headers.get('x-microcms-signature')}`
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new Error('Invalid signature.')
  }

  if (data.id === process.env.COMPANY_POST_ID) {
    revalidatePath('/company')
    return NextResponse.json({revalidated: true})
  }
  if (data.id === process.env.WORKS_POST_ID) {
    revalidatePath('/works')
    return NextResponse.json({revalidated: true})
  }
  revalidatePath('/')
  revalidatePath(`/news/${data.id}`)
  return NextResponse.json({revalidated: true})
}

export const POST = handler
