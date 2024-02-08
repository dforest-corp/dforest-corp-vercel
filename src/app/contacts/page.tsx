import {Metadata} from 'next'
import {ContactForm, ContactTel} from '@/app/contacts/_components'

export const metadata: Metadata = {
  title: 'お問い合わせ',
}

export default function Contact() {
  return (
    <div className="grid grid-cols-1 gap-20 py-20">
      <ContactTel />
      <ContactForm />
    </div>
  )
}
