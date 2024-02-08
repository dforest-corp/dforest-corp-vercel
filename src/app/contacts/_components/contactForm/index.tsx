'use client'

/** @package */

import {useContactFormHook} from '@/app/contacts/_components/contactForm/hooks'
import {FormError} from '@/app/contacts/_components/formError'
import {ReaderLayout} from '@/components/readerLayout'

export const ContactForm = () => {
  const {register, handleSubmitForm, errors} = useContactFormHook()
  return (
    <ReaderLayout>
      <form className="grid gap-4" onSubmit={handleSubmitForm}>
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
        </div>
        <button
          type="submit"
          className="rounded border border-dforest-green bg-dforest-green p-4 text-lg text-white transition hover:bg-white hover:text-dforest-green"
        >
          送信
        </button>
      </form>
    </ReaderLayout>
  )
}
