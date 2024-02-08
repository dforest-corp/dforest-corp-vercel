import {Metadata} from 'next'
import {CompanyInformation, CompanyMap} from '@/app/company/_components'

export const metadata: Metadata = {
  title: '会社案内',
  description: '株式会社ディー・フォレストの会社案内です。',
}

export default async function Company() {
  return (
    <div className="grid grid-cols-1 gap-20 py-20">
      <CompanyInformation />
      <CompanyMap />
    </div>
  )
}
