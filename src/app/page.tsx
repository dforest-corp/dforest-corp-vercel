import {Metadata} from 'next'
import {
  BottomContactGuide,
  Guidance,
  Introduction,
  NewsList,
  ServiceTree,
  ShopAppInformation,
} from '@/app/_components'

export const metadata: Metadata = {
  description:
    'スマホアプリ・ホームページを制作します。スマートフォンへの対応もおまかせください。',
}

export default function Index() {
  return (
    <>
      <Introduction />
      <ShopAppInformation />
      <Guidance />
      <ServiceTree />
      <NewsList />
      <BottomContactGuide />
    </>
  )
}
