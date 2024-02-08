'use client'

/** @package */

import {useContactFormHook} from '@/app/contacts/_components/contactForm/hooks'
import {FormError} from '@/app/contacts/_components/formError'
import {ReaderLayout} from '@/components/readerLayout'
import ReCAPTCHA from 'react-google-recaptcha'
import {FormEventHandler, useRef} from 'react'

export const ContactForm = () => {
  const {register, handleSubmitForm, errors, submitting, onSetRecaptcha} =
    useContactFormHook()
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const onSubmitWithRecaptcha: FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()
    const captcha = recaptchaRef.current
    if (!captcha) return
    const token = await captcha.executeAsync()
    onSetRecaptcha(token)
    return handleSubmitForm(event)
  }

  return (
    <ReaderLayout>
      <form className="grid gap-4" onSubmit={onSubmitWithRecaptcha}>
        <div>
          <label>お名前 (必須)</label>
          <input
            {...register('name')}
            type="text"
            className="mt-2 block w-full rounded border-gray-300 shadow"
          />
          <FormError error={errors.name} />
        </div>
        <div>
          <label>メールアドレス (必須)</label>
          <input
            {...register('email')}
            type="email"
            className="mt-2 block w-full rounded border-gray-300 shadow"
          />
          <FormError error={errors.email} />
        </div>
        <div>
          <label>タイトル</label>
          <input
            {...register('title')}
            type="text"
            className="mt-2 block w-full rounded border-gray-300 shadow"
          />
          <FormError error={errors.title} />
        </div>
        <div>
          <label>お問い合せ内容</label>
          <textarea
            {...register('message')}
            className="mt-2 block w-full resize-none rounded border-gray-300 shadow"
            rows={8}
          />
          <FormError error={errors.message} />
          <FormError error={errors['g-recaptcha-response']} />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded border border-dforest-green bg-dforest-green p-4 text-lg text-white transition hover:bg-white hover:text-dforest-green"
        >
          送信
        </button>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={String(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)}
          size="invisible"
        />
      </form>
    </ReaderLayout>
  )
}
