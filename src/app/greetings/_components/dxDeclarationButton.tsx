/** @package */

import {MdPictureAsPdf} from 'react-icons/md'

export const DxDeclarationButton = () => {
  return (
    <p>
      <a
        href="/assets/dforest-dx.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex flex-row items-center rounded-full border border-green-700 bg-green-700 px-6 py-3 text-white shadow-lg transition hover:bg-white hover:text-green-700"
      >
        <MdPictureAsPdf className="mr-2 text-lg" />
        <span className="text-lg tracking-wider">ディーフォレスト DX宣言</span>
      </a>
    </p>
  )
}
