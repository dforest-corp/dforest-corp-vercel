import {type NextRequest, NextResponse} from 'next/server'
import type {Webhook} from '@/types/cmsType'
import {revalidatePath} from 'next/cache'

export const runtime = 'edge'

async function handler(req: NextRequest) {
  const data: Webhook = await req.json()

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(process.env.MICROCMS_SECRET),
    {name: 'HMAC', hash: 'SHA-256'},
    false,
    ['sign'],
  )

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(JSON.stringify(data)),
  )

  const expectedSignature = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  const headerSignature = `${req.headers.get('x-microcms-signature')}`

  if (headerSignature !== expectedSignature) {
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
  if (data.id === process.env.GREETINGS_POST_ID) {
    revalidatePath('/greetings')
    return NextResponse.json({revalidated: true})
  }
  revalidatePath('/')
  revalidatePath(`/news/${data.id}`)
  return NextResponse.json({revalidated: true})
}

export const POST = handler
