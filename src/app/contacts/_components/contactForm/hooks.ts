import {useCallback, useEffect, useMemo, useState} from 'react'
import {useRouter} from 'next/navigation'
import {toast} from 'react-toastify'
import {useForm} from 'react-hook-form'
import {valibotResolver} from '@hookform/resolvers/valibot'
import {formSchema, FormSchemaType} from '@/app/contacts/_schema/formSchema'
import {sendEmail} from '@/app/contacts/_actions/sendEmail'

export function useSendEmailAction() {
  const [submitting, setSubmitting] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [sendError, setSendError] = useState<Error | null>(null)

  const onSubmit = useCallback(async (data: FormSchemaType) => {
    setSubmitting(true)
    setSendError(null)
    setSucceeded(false)
    try {
      await sendEmail(data)
      setSucceeded(true)
    } catch (error: unknown) {
      setSendError(error as Error)
    } finally {
      setSubmitting(false)
    }
  }, [])

  return [{submitting, succeeded, errors: sendError}, onSubmit] as const
}

export const useContactFormHook = () => {
  const [{submitting, succeeded, errors: sendError}, onSubmit] =
    useSendEmailAction()
  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm<FormSchemaType>({
    resolver: valibotResolver(formSchema),
  })
  const router = useRouter()

  const confirmSubmit = useCallback(
    (data: FormSchemaType) => {
      if (!confirm('お問い合わせを送信してもよろしいですか？')) {
        return
      }
      return onSubmit(data)
    },
    [onSubmit],
  )

  const handleSubmitForm = useMemo(
    () => handleSubmit(confirmSubmit),
    [confirmSubmit, handleSubmit],
  )

  const handleSetRecaptcha = useCallback(
    (value: string | null) => {
      setValue('g-recaptcha-response', value ?? '')
    },
    [setValue],
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
    onSetRecaptcha: handleSetRecaptcha,
  }
}
