import React from 'react'
import Link from 'next/link'
import {SectionTitle} from '@/components/sectionTitle'

export default function PrivacyPolicy() {
  return (
    <div className="prose prose-blue mx-auto max-w-screen-lg px-4 py-20 lg:px-0">
      <SectionTitle>プライバシーポリシー（個人情報保護方針）</SectionTitle>
      <p>
        株式会社ディーフォレスト（以下、当社）は、以下のとおり個人情報保護方針を定め、
        個人情報保護の仕組みを構築し、全従業員に個人情報保護の重要性の認識と取組みを徹底させることにより、個人情報の保護を推進致します。
      </p>
      <h3>個人情報の管理</h3>
      <p>
        当社は、お客さまの個人情報を正確かつ最新の状態に保ち、個人情報への不正アクセス・紛失・破損・改ざん・漏洩などを防止するため、
        セキュリティシステムの維持・管理体制の整備・社員教育の徹底等の必要な措置を講じ、安全対策を実施し個人情報の厳重な管理を行ないます。
      </p>
      <h3>個人情報の利用目的</h3>
      <p>
        お客さまからお預かりした個人情報は、弊社からのご連絡やご質問に対する回答に利用いたします。
      </p>
      <h3>個人情報の第三者への開示・提供の禁止</h3>
      <p>
        当社は、お客さまよりお預かりした個人情報を適切に管理し、次のいずれかに該当する場合を除き、個人情報を第三者に開示いたしません。
      </p>
      <ul>
        <li>お客さまの同意がある場合</li>
        <li>
          お客さまが希望されるサービスを行なうために弊社が業務を委託する業者に対して開示する場合
        </li>
        <li>法令に基づき開示することが必要である場合</li>
      </ul>
      <h3>Google Analyticsの使用について</h3>
      <p>
        当サイトでは、サービス向上やサイトの改善のためにGoogle
        LLCの提供するウェブ解析ツール「Google
        Analytics」を利用した計測を行っております。 <br />
        Google
        Analyticsは、当サイトが発行するクッキー（Cookie）を利用して、個人を特定する情報を含みません。
        <br />
        またユーザーのIPアドレスを匿名化しています。 <br />
        詳しくは
        <a
          href="https://marketingplatform.google.com/about/analytics/terms/jp/"
          target="_blank"
          rel="noreferrer"
        >
          Google Analyticsのサービス利用規約
        </a>
        及び
        <a
          href="https://policies.google.com/privacy?hl=ja"
          target="_blank"
          rel="noreferrer"
        >
          Googleのプライバシーポリシー
        </a>
        をご覧ください。
      </p>
      <h3>法令、規範の遵守と見直し</h3>
      <p>
        当社は、保有する個人情報に関して適用される日本の法令、その他規範を遵守するとともに、本ポリシーの内容を適宜見直し、その改善に努めます。
      </p>
      <h3>お問い合わせ</h3>
      <p>当社の個人情報の取扱に関するお問い合せは下記までご連絡ください。</p>
      <p>
        <Link href={'/contacts'}>お問い合わせフォーム</Link>
      </p>
    </div>
  )
}
