import {useEffect, useMemo} from 'react'
import {useRouter} from 'next/router'
import {toast} from 'react-toastify'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm as useFormSpree} from '@formspree/react'
import {z} from 'zod'

const formSchema = z.object({
  name: z.string().min(1, 'お名前を入力してください。').max(60, '60文字以内で入力してください。'),
  email: z.string().email('正しいメールアドレスを入力してください。'),
  title: z.string(),
  message: z.string().min(1, 'お問い合せ内容を入力してください。').max(4000, '4000文字以内で入力してください。')
})

type FormSchemaType = z.infer<typeof formSchema>

export const useContactFormHook = () => {
  const [{submitting, succeeded, errors: sendError}, onSubmit] = useFormSpree(`${process.env.NEXT_PUBLIC_FORM_KEY}`)
  const {register, handleSubmit, formState: {errors}} = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema)
  })
  const router = useRouter()

  const handleSubmitForm = useMemo(() => handleSubmit(onSubmit), [handleSubmit, onSubmit])

  useEffect(() => {
    if (sendError) {
      toast.error('お問い合わせを送信できませんでした。しばらく経ってから再度やり直してください。')
    }
  }, [sendError])

  useEffect(() => {
    if (succeeded) {
      toast.success('お問い合わせを送信しました。')
      router.push('/').catch(console.log)
    }
  }, [router, succeeded])

  return {
    register,
    handleSubmitForm,
    errors,
    submitting
  }
}
