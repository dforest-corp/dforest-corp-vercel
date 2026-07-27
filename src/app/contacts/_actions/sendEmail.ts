'use server'

import {
  classifyContact,
  ClassifyResult,
  SalesLevel,
} from '@/app/contacts/_actions/_detector'
import {formSchema, FormSchemaType} from '@/app/contacts/_schema/formSchema'
import nodemailer from 'nodemailer'
import {safeParseAsync} from 'valibot'

const subjectPrefix: Record<SalesLevel, string> = {
  normal: '',
  suspect: '[営業?] ',
  sales: '[営業] ',
}

async function validateRecaptcha(cRes: string) {
  const response = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${cRes}`,
    },
  )
  const result = await response.json()
  if (!result.success) {
    throw new Error('reCAPTCHA validation failed')
  }
}

/**
 * 営業メール判定。例外時は必ず通常送信に倒す（フェイルオープン）。
 *
 * 判定機構の不具合で本物の問い合わせを失うことは絶対に避ける。
 */
function classifySafely(data: FormSchemaType): ClassifyResult {
  try {
    return classifyContact(data)
  } catch (error: unknown) {
    // 問い合わせ内容が混入しないよう、例外の名前とメッセージだけを出す
    const summary =
      error instanceof Error ? `${error.name}: ${error.message}` : 'unknown'
    console.error(`[contact] detector failed: ${summary}`)
    return {level: 'normal', score: 0, hitRuleIds: []}
  }
}

export async function sendEmail(data: FormSchemaType) {
  const {success} = await safeParseAsync(formSchema, data)
  if (!success) {
    throw new Error('Invalid form data')
  }

  const cRes = data['g-recaptcha-response']
  await validateRecaptcha(cRes)

  const judgement = classifySafely(data)

  // 問い合わせ内容・氏名・メールアドレス・タイトルはログに出さない。
  // ルールIDは英数字とアンダースコアのみなので本文は復元できない。
  console.log(
    `[contact] level=${judgement.level} score=${judgement.score} ` +
      `rules=${judgement.hitRuleIds.join('|') || '-'}`,
  )

  const transporter = nodemailer.createTransport({
    host: `${process.env.MAIL_HOST}`,
    port: Number(`${process.env.MAIL_PORT}`),
    secure: true,
    auth: {
      user: `${process.env.MAIL_USERNAME}`,
      pass: `${process.env.MAIL_PASSWORD}`,
    },
  })

  const lines = [
    `お名前: ${data.name}`,
    `メールアドレス: ${data.email}`,
    `タイトル: ${data.title}`,
    `お問い合わせ内容:`,
    data.message,
  ]

  // 閾値チューニング用の内訳は、隔離ボックスと [営業?] のメールにだけ付ける。
  // 大多数の正当な問い合わせの本文は汚さない。
  if (judgement.level !== 'normal') {
    lines.push(
      '',
      '--- 営業メール判定 ---',
      `レベル: ${judgement.level} / スコア: ${judgement.score}`,
      `ヒットしたルール: ${judgement.hitRuleIds.join(', ') || '(なし)'}`,
    )
  }

  // MAIL_TO_QUARANTINE が未設定でもメールを失わないよう通常の宛先に倒す。
  // 件名は [営業] のままなので、設定漏れは受信箱で気づける。
  const quarantineTo = process.env.MAIL_TO_QUARANTINE
  const to =
    judgement.level === 'sales' && quarantineTo
      ? quarantineTo
      : `${process.env.MAIL_TO}`

  await transporter.sendMail({
    from: `問い合わせフォーム <${process.env.MAIL_FROM}>`,
    replyTo: data.email,
    to,
    subject: `${subjectPrefix[judgement.level]}${data.title || 'お問い合わせ'}`,
    text: lines.join('\n'),
  })
}
