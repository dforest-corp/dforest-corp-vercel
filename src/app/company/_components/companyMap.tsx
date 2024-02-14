/** @package */

import {ReaderLayout} from '@/components/readerLayout'
import {SectionTitle} from '@/components/sectionTitle'

export const CompanyMap = () => {
  return (
    <ReaderLayout>
      <div className="grid gap-10">
        <SectionTitle>アクセス</SectionTitle>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.245974246613!2d135.50382271275296!3d34.6989753831899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e6c20a68873b%3A0x3b465e1b71a80817!2z77yI5qCq77yJ44OH44Kj44O844O744OV44Kp44Os44K544OI!5e0!3m2!1sja!2sjp!4v1707874398904!5m2!1sja!2sjp"
          width="100%"
          height="450"
          className="rounded border-none shadow"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </ReaderLayout>
  )
}
