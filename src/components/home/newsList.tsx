import Link from 'next/link'
import {EndPoints} from '@/types/cmsType'
import ForEach from '@/components/common/ForEach'
import {formatDateTime} from '@/utils/formatDateTime'

type NewsListProps = {
  items: EndPoints['gets']['news']['contents']
}

const NewsList = ({items}: NewsListProps) => {
  return (
    <div className="grid gap-20 pb-20 pt-10 md:pt-0">
      <h3 className="text-center text-3xl font-bold tracking-wider xl:font-black">
        お知らせ
      </h3>
      <div className="w-full">
        <div className="mx-auto max-w-screen-xl px-2 xl:px-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ForEach items={items}>
              {(item) => (
                <div key={item.id} className="space-y-1 text-center">
                  <Link
                    href={`/news/${item.id}`}
                    className="border-animation font-bold"
                    title={item.title}
                  >
                    {item.title}
                  </Link>
                  <p>{formatDateTime(item.publishedAt)}</p>
                </div>
              )}
            </ForEach>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsList
