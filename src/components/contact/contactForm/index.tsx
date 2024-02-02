'use client'

import {useContactFormHook} from '@/components/contact/contactForm/hooks'
import FormError from '@/components/contact/formError'
import ReaderLayout from '@/components/common/readerLayout'

const ContactForm = () => {
  const {register, handleSubmitForm, errors} = useContactFormHook()
  return (
    <ReaderLayout>
      <form className='grid gap-4' onSubmit={handleSubmitForm}>
        <div>
          <label>お名前 (必須)</label>
          <input
            {...register('name')}
            type='text'
            className='mt-2 block w-full rounded shadow border-gray-300' />
          <FormError error={errors.name} />
        </div>
        <div>
          <label>メールアドレス (必須)</label>
          <input
            {...register('email')}
            type='email'
            className='mt-2 block w-full rounded shadow border-gray-300' />
          <FormError error={errors.email} />
        </div>
        <div>
          <label>タイトル</label>
          <input
            {...register('title')}
            type='text'
            className='mt-2 block w-full rounded shadow border-gray-300' />
          <FormError error={errors.title} />
        </div>
        <div>
          <label>お問い合せ内容</label>
          <textarea
            {...register('message')}
            className='mt-2 block w-full rounded shadow border-gray-300 resize-none'
            rows={8} />
          <FormError error={errors.message} />
        </div>
        <button
          type='submit'
          className='bg-emerald-900 text-white text-lg p-4 rounded'>
          送信
        </button>
      </form>
    </ReaderLayout>
  )
}

export default ContactForm
