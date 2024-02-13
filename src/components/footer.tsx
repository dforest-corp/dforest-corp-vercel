import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="mt-auto bg-dforest-green pb-20 pt-10 text-white">
      <div className="flex justify-center">
        <Link href={'/privacy'} className="text-sm text-gray-200">
          プライバシーポリシー
        </Link>
      </div>
      <p className="mt-10 px-2 text-center">&copy; 2012 D-FOREST Co., Ltd.</p>
    </footer>
  )
}
