'use server'

import {FormSchemaType} from '@/app/contacts/_schema/formSchema'
import nodemailer from 'nodemailer'

export async function sendEmail(data: FormSchemaType) {
  const cRes = data['g-recaptcha-response']
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

  await transporter.sendMail({
    from: `問い合わせフォーム <${process.env.MAIL_FROM}>`,
    replyTo: data.email,
    to: `${process.env.MAIL_TO}`,
    subject: data.title,
    text: lines.join('\n'),
  })
}
