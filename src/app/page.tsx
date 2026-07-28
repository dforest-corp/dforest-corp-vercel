import {Metadata} from 'next'
import {
  BottomContactGuide,
  Guidance,
  Introduction,
  NewsList,
  ServiceTree,
  ShopAppInformation,
} from '@/app/_components'

// Webhook が届かなかった場合の保険（src/app/news/[id]/page.tsx 参照）
export const revalidate = 86400

export const metadata: Metadata = {
  description:
    '大阪のソフトウェア開発会社 - スマホアプリ・ホームページを制作します。スマートフォンへの対応もおまかせください。',
}

export default function Index() {
  return (
    <div className="overflow-x-hidden">
      <Introduction />
      <ShopAppInformation />
      <Guidance />
      <ServiceTree />
      <NewsList />
      <BottomContactGuide />
    </div>
  )
}
