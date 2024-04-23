import {email, Input, maxLength, minLength, object, string} from 'valibot'

export const formSchema = object({
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
  'g-recaptcha-response': string(
    'リクエストを確認できませんでした。しばらく経ってから再度やり直してください。',
    [
      minLength(
        1,
        'リクエストを確認できませんでした。しばらく経ってから再度やり直してください。',
      ),
    ],
  ),
})

export type FormSchemaType = Input<typeof formSchema>
