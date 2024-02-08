import Link from 'next/link'
import {ReaderLayout} from '@/components/readerLayout'

export default function NotFound() {
  return (
    <>
      <ReaderLayout>
        <section className="py-20">
          <h2 className="text-2xl font-bold">ページが見つかりません</h2>
          <p className="mt-4">
            お探しのページは見つかりませんでした。URLが間違っているか、削除された可能性があります。
          </p>
          <p className="mt-4">
            <Link href="/" className="text-blue-500 underline">
              トップページに戻る
            </Link>
          </p>
        </section>
      </ReaderLayout>
    </>
  )
}
