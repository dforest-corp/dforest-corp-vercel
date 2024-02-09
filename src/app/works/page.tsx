import {Metadata} from 'next'
import {BottomImage, WorksInformation} from '@/app/works/_components'

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
