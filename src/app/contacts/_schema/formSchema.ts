import {
  email,
  InferInput,
  maxLength,
  minLength,
  object,
  string,
  pipe,
} from 'valibot'

export const formSchema = object({
  name: pipe(
    string(),
    minLength(1, 'お名前を入力してください。'),
    maxLength(60, '60文字以内で入力してください。'),
  ),
  email: pipe(string(), email('正しいメールアドレスを入力してください。')),
  title: pipe(string(), maxLength(100, '100文字以内で入力してください。')),
  message: pipe(
    string(),
    minLength(1, 'お問い合せ内容を入力してください。'),
    maxLength(4000, '4000文字以内で入力してください。'),
  ),
  'g-recaptcha-response': pipe(
    string(
      'リクエストを確認できませんでした。しばらく経ってから再度やり直してください。',
    ),
    minLength(
      1,
      'リクエストを確認できませんでした。しばらく経ってから再度やり直してください。',
    ),
  ),
})

export type FormSchemaType = InferInput<typeof formSchema>
