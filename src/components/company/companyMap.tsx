const CompanyMap = () => {
  return (
    <div>
      <div className='max-w-screen-sm mx-auto px-4 xl:px-0'>
        <h2 className='text-3xl tracking-wider font-bold'>アクセス</h2>
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.2463739545074!2d135.506431!3d34.6989653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e6c20a68bf0f%3A0xc9f8029cebefb398!2z44CSNTMwLTAwNDcg5aSn6Ziq5bqc5aSn6Ziq5biC5YyX5Yy66KW_5aSp5rqA77yV5LiB55uu77yR77yU4oiS77yXIOWSjOWFieODk-ODqyDkuIPpmo4!5e0!3m2!1sja!2sjp!4v1655882910096!5m2!1sja!2sjp'
          width='100%' height='450'
          className='border-none mt-4 rounded shadow'
          allowFullScreen
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'></iframe>
      </div>
    </div>
  )
}

export default CompanyMap