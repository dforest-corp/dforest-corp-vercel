'use server'

import {formSchema, FormSchemaType} from '@/app/contacts/_schema/formSchema'
import nodemailer from 'nodemailer'
import {checkSalesMail} from '@/utils/checkSalesMail'
import {safeParseAsync} from 'valibot'

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

export async function sendEmail(data: FormSchemaType) {
  const {success} = await safeParseAsync(formSchema, data)
  if (!success) {
    throw new Error('Invalid form data')
  }

  const cRes = data['g-recaptcha-response']
  await validateRecaptcha(cRes)

  const transporter = nodemailer.createTransport({
    host: `${process.env.MAIL_HOST}`,
    port: Number(`${process.env.MAIL_PORT}`),
    secure: true,
    auth: {
      user: `${process.env.MAIL_USERNAME}`,
      pass: `${process.env.MAIL_PASSWORD}`,
    },
  })

  // const isSalesMail = await checkSalesMail(data.title, data.message)

  const lines = [
    `お名前: ${data.name}`,
    `メールアドレス: ${data.email}`,
    `タイトル: ${data.title}`,
    `お問い合わせ内容:`,
    data.message,
  ]

  const titleText = data.title || 'お問い合わせ'

  await transporter.sendMail({
    from: `問い合わせフォーム <${process.env.MAIL_FROM}>`,
    replyTo: data.email,
    to: `${process.env.MAIL_TO}`,
    subject: titleText,
    text: lines.join('\n'),
  })
}
