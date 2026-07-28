import {type NextRequest, NextResponse} from 'next/server'
import type {Webhook} from '@/types/cmsType'
import {revalidatePath} from 'next/cache'

function hexToBytes(hex: string) {
  if (hex.length === 0 || hex.length % 2 !== 0 || /[^0-9a-f]/i.test(hex)) {
    return null
  }
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

/**
 * microCMS の署名は「受信したリクエストボディそのもの」に対する HMAC-SHA256 なので、
 * JSON.parse したものを再シリアライズしたのでは検証できない（日本語のエスケープや
 * 空白の差で不一致になる）。必ず生ボディの文字列に対して検証する。
 */
async function verifySignature(rawBody: string, headerSignature: string) {
  const secret = process.env.MICROCMS_SECRET
  if (!secret) throw new Error('MICROCMS_SECRET is not set.')

  const expected = hexToBytes(headerSignature)
  if (!expected) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    {name: 'HMAC', hash: 'SHA-256'},
    false,
    ['verify'],
  )
  return crypto.subtle.verify('HMAC', key, expected, encoder.encode(rawBody))
}

async function handler(req: NextRequest) {
  const rawBody = await req.text()
  const headerSignature = req.headers.get('x-microcms-signature') ?? ''

  if (!(await verifySignature(rawBody, headerSignature))) {
    return NextResponse.json({message: 'Invalid signature.'}, {status: 401})
  }

  let data: Webhook
  try {
    data = JSON.parse(rawBody) as Webhook
  } catch {
    return NextResponse.json({message: 'Invalid payload.'}, {status: 400})
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
  if (data.id) revalidatePath(`/news/${data.id}`)
  return NextResponse.json({revalidated: true})
}

export const POST = handler
