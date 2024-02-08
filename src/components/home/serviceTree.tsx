'use client'

import TreeItemRight from './treeItemRight'
import TreeItemLeft from './treeItemLeft'

const ServiceTree = () => {
  return (
    <div className='pb-[11%]'>
      <div
        className='relative after:content-[""] after:absolute  after:left-0 after:top-0 after:-skew-y-6 after:origin-top-right after:-z-10 after:w-full after:h-full after:bg-dforest-green'>
        <div className='overflow-x-hidden'>
          <div className='max-w-screen-xl mx-auto px-4 xl:px-0 py-40 grid gap-20 xl:gap-40'>
            <TreeItemRight lottiePath={'/lottie/tree1.json'} title='スマートフォンアプリ開発'>
              スマートフォン、タブレット向けソフトウェアを中心にお客様のニーズに合わせ、ソフトウェアを開発いたします。<br />
              現在のお客様のお手持ちのソフトウエア、システムをタブレットなどでご活用になりたい場合なども、ご相談ください。
            </TreeItemRight>
            <TreeItemLeft lottiePath={'/lottie/tree2.json'} title={'Webアプリケーション'}>
              Webアプリを制作します。スマートフォンへの対応もおまかせください。<br />
              またデータベースからの商品一覧、スライドショー、お客様によるニュースなどの変更、商品の変更などプログラミングの必要なサイトも承ります。
            </TreeItemLeft>
            <TreeItemRight lottiePath={'/lottie/tree3.json'} title='ITコンサルティング'>
              様々な業務に合わせ、ハードウェア、パッケージソフト、WEBアプリケーションの開発など、業務に向けた最適なソリューションを当社のネットワークにてご提案させていただきます。<br />
              また、小規模のネット環境でも重要となってきたセキュリティの確保についてもご相談ください。オフィスでのUTM(Unified Threat Management)装置をご提案します。
            </TreeItemRight>
            <TreeItemLeft lottiePath={'/lottie/tree4.json'} title={'ホームページ制作'}>
              ホームページを制作します。スマートフォンへの対応もおまかせください。<br />
              またデータベースからの商品一覧、スライドショー、お客様によるニュースなどの変更、商品の変更などプログラミングの必要なサイトも承ります。
            </TreeItemLeft>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceTree
