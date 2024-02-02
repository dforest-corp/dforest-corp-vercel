import Link from 'next/link'
import {EndPoints} from '@/types/cmsType'
import ForEach from '@/components/common/ForEach'
import {formatDateTime} from '@/utils/formatDateTime'

type NewsListProps = {
  items: EndPoints['gets']['news']['contents']
}

const NewsList = ({items}: NewsListProps) => {
  return (
    <div className='pt-10 md:pt-0 pb-20 grid gap-20'>
      <h3 className='text-center font-bold xl:font-black tracking-wider text-3xl'>お知らせ</h3>
      <div className='w-full'>
        <div className='max-w-screen-xl mx-auto px-2 xl:px-0'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <ForEach items={items}>
              {item => (
                <div key={item.id} className='text-center grid gap-1'>
                  <Link href={`/news/${item.id}`} className='font-bold' title={item.title}>

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
  );
}

export default NewsList