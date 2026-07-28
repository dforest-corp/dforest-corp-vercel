import {Metadata} from 'next'
import {BottomImage, WorksInformation} from '@/app/works/_components'

// Webhook が届かなかった場合の保険（src/app/news/[id]/page.tsx 参照）
export const revalidate = 86400

export const metadata: Metadata = {
  title: '事業案内',
  description: '株式会社ディー・フォレストの事業案内です。',
}

export default async function Works() {
  return (
    <div className="grid grid-cols-1 gap-20 py-20">
      <WorksInformation />
      <BottomImage />
    </div>
  )
}
