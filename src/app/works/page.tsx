import {Metadata} from 'next'
import {WorksInformation} from '@/app/works/_components'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '事業案内',
  description: '株式会社ディー・フォレストの事業案内です。',
}

export default async function Works() {
  return (
    <div className="grid grid-cols-1 gap-20 py-20">
      <WorksInformation />
      <Image
        src="/images/works-image.webp"
        alt="事業イメージ"
        width={750}
        height={582}
        className="mx-auto w-full max-w-md"
      />
    </div>
  )
}
