import {TreeItemRight} from './treeItemRight'
import {TreeItemLeft} from './treeItemLeft'

/** @package */
export const ServiceTree = () => {
  return (
    <div className="pb-[11%]">
      <div className='relative after:absolute after:left-0  after:top-0 after:-z-10 after:h-full after:w-full after:origin-top-right after:-skew-y-6 after:bg-dforest-green after:content-[""]'>
        <div className="overflow-x-hidden">
          <div className="mx-auto grid max-w-screen-xl gap-20 px-4 py-40 xl:gap-40 xl:px-0">
            <TreeItemRight
              lottiePath={'/lottie/tree1.json'}
              title="スマートフォンアプリ開発"
            >
              スマートフォン、タブレット向けソフトウェアを中心にお客様のニーズに合わせ、ソフトウェアを開発いたします。
              <br />
              現在のお客様のお手持ちのソフトウエア、システムをタブレットなどでご活用になりたい場合なども、ご相談ください。
            </TreeItemRight>
            <TreeItemLeft
              lottiePath={'/lottie/tree2.json'}
              title={'Webアプリケーション'}
            >
              Webアプリを制作します。スマートフォンへの対応もおまかせください。
              <br />
              またデータベースからの商品一覧、スライドショー、お客様によるニュースなどの変更、商品の変更などプログラミングの必要なサイトも承ります。
            </TreeItemLeft>
            <TreeItemRight
              lottiePath={'/lottie/tree3.json'}
              title="ITコンサルティング"
            >
              様々な業務に合わせ、ハードウェア、パッケージソフト、WEBアプリケーションの開発など、業務に向けた最適なソリューションを当社のネットワークにてご提案させていただきます。
              <br />
              また、小規模のネット環境でも重要となってきたセキュリティの確保についてもご相談ください。オフィスでのUTM(Unified
              Threat Management)装置をご提案します。
            </TreeItemRight>
            <TreeItemLeft
              lottiePath={'/lottie/tree4.json'}
              title={'ホームページ制作'}
            >
              ホームページを制作します。スマートフォンへの対応もおまかせください。
              <br />
              またデータベースからの商品一覧、スライドショー、お客様によるニュースなどの変更、商品の変更などプログラミングの必要なサイトも承ります。
            </TreeItemLeft>
          </div>
        </div>
      </div>
    </div>
  )
}
