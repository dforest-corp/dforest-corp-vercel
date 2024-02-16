'use client'

import {ReaderLayout} from '@/components/readerLayout'
import Link from 'next/link'

export default function Error() {
  return (
    <ReaderLayout>
      <section className="py-20">
        <h2 className="text-2xl font-bold">エラーが発生しました</h2>
        <p className="mt-4">
          ページの表示中にエラーが発生しました。
          <br />
          恐れ入りますが、トップページに戻って再度お試しください。
        </p>
        <p className="mt-4">
          <Link href="/" className="text-blue-500 underline">
            トップページに戻る
          </Link>
        </p>
      </section>
    </ReaderLayout>
  )
}
