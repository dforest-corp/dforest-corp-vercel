import {Header} from '@/components/header'
import {Footer} from '@/components/footer'
import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <Header />
      <section className="p-4">
        <h2 className="text-2xl font-bold">ページが見つかりません</h2>
        <p className="mt-4">
          お探しのページは見つかりませんでした。URLが間違っているか、削除された可能性があります。
        </p>
        <Link href="/" className="mt-4 text-blue-500 underline">
          トップページに戻る
        </Link>
      </section>
      <Footer />
    </>
  )
}
