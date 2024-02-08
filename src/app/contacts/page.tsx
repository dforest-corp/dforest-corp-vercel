import Header from '@/components/common/header'
import ContactTel from '@/components/contact/contactTel'
import ContactForm from '@/components/contact/contactForm'
import Footer from '@/components/common/footer'
import {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'お問い合わせ',
}

export default function Contact() {
  return (
    <div className='grid grid-cols-1 gap-20'>
      <Header />
      <ContactTel />
      <ContactForm />
      <Footer />
    </div>
  )
}
