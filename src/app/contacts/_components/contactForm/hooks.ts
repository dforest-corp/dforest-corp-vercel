import {useEffect, useMemo} from 'react'
import {useRouter} from 'next/navigation'
import {toast} from 'react-toastify'
import {useForm} from 'react-hook-form'
import {valibotResolver} from '@hookform/resolvers/valibot'
import {useForm as useFormSpree} from '@formspree/react'
import {email, Input, maxLength, minLength, object, string} from 'valibot'

const formSchema = object({
  name: string([
    minLength(1, 'お名前を入力してください。'),
    maxLength(60, '60文字以内で入力してください。'),
  ]),
  email: string([email('正しいメールアドレスを入力してください。')]),
  title: string([maxLength(100, '100文字以内で入力してください。')]),
  message: string([
    minLength(1, 'お問い合せ内容を入力してください。'),
    maxLength(4000, '4000文字以内で入力してください。'),
  ]),
})

type FormSchemaType = Input<typeof formSchema>

export const useContactFormHook = () => {
  const [{submitting, succeeded, errors: sendError}, onSubmit] = useFormSpree(
    `${process.env.NEXT_PUBLIC_FORM_KEY}`,
  )
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormSchemaType>({
    resolver: valibotResolver(formSchema),
  })
  const router = useRouter()

  const handleSubmitForm = useMemo(
    () => handleSubmit(onSubmit),
    [handleSubmit, onSubmit],
  )

  useEffect(() => {
    if (sendError) {
      toast.error(
        'お問い合わせを送信できませんでした。しばらく経ってから再度やり直してください。',
      )
    }
  }, [sendError])

  useEffect(() => {
    if (succeeded) {
      toast.success('お問い合わせを送信しました。')
      router.push('/')
    }
  }, [router, succeeded])

  return {
    register,
    handleSubmitForm,
    errors,
    submitting,
  }
}
