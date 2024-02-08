/** @package */

import {ReaderLayout} from '@/components/readerLayout'
import {SectionTitle} from '@/components/sectionTitle'

export const ContactTel = () => {
  return (
    <ReaderLayout>
      <div className="grid gap-4">
        <SectionTitle>お問い合わせ</SectionTitle>
        <p className="tracking-wide">
          電話でのお問い合わせの場合は、
          <br />
          <strong>06-6809-7520</strong> (9:30から17:00まで）
          <br />
          またはメールの場合、以下のお問い合わせフォームへご記入の上、送信してください。
        </p>
      </div>
    </ReaderLayout>
  )
}
