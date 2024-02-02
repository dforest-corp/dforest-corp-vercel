import Header from '@/components/common/header'
import CompanyInformation from '@/components/company/companyInformation'
import CompanyMap from '@/components/company/companyMap'
import Footer from '@/components/common/footer'
import PostAPI from '@/api/post'
import {Metadata} from 'next'

export const metadata: Metadata = {
  title: '会社案内',
  description: '株式会社ディー・フォレストの会社案内です。'
}

export default async function Company() {
  const post = await PostAPI.fetchCompany()

  return (
    <div className="grid grid-cols-1 gap-20">
      <Header />
      <CompanyInformation post={post} />
      <CompanyMap />
      <Footer />
    </div>
  )
}
