import {Header} from '@/components/header'
import {Footer} from '@/components/footer'
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
  title: {
    absolute: 'D-FOREST | Creative Web and Smart phone application',
  },
  description:
    'スマホアプリ・ホームページを制作します。スマートフォンへの対応もおまかせください。',
}

export default function Index() {
  return (
    <>
      <Header />
      <Introduction />
      <ShopAppInformation />
      <Guidance />
      <ServiceTree />
      <NewsList />
      <BottomContactGuide />
      <Footer />
    </>
  )
}
