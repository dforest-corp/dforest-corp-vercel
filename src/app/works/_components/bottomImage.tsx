import Image from 'next/image'
import worksImage from './assets/works-image.webp'

export function BottomImage() {
  return (
    <Image
      src={worksImage}
      alt="事業イメージ"
      className="mx-auto w-full max-w-md"
    />
  )
}
