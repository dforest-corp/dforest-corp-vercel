import {expect, test} from 'bun:test'
import {legitFixtures} from '@/app/contacts/_actions/_detector/fixtures/legitFixtures'
import {salesFixtures} from '@/app/contacts/_actions/_detector/fixtures/salesFixtures'
import {
  syntheticLegitFixtures,
  syntheticSalesFixtures,
} from '@/app/contacts/_actions/_detector/fixtures/syntheticFixtures'
import {buildDetectorInput} from '@/app/contacts/_actions/_detector/normalize'
import {
  allRules,
  legitSignalRules,
  salesRules,
} from '@/app/contacts/_actions/_detector/rules'
import {ContactContent} from '@/app/contacts/_actions/_detector/types'

const allSalesFixtures = [...salesFixtures, ...syntheticSalesFixtures]
const allNonSalesFixtures = [...legitFixtures, ...syntheticLegitFixtures]

function ruleById(id: string) {
  const rule = allRules.find((candidate) => candidate.id === id)
  if (!rule) {
    throw new Error(`ルールが見つかりません: ${id}`)
  }
  return rule
}

function fires(id: string, content: Partial<ContactContent>) {
  return ruleById(id).test(
    buildDetectorInput({
      name: '山田 太郎',
      email: 'yamada@example-a.co.jp',
      title: 'お問い合わせ',
      message: '本文です。',
      ...content,
    }),
  )
}

// ---------------------------------------------------------------------------
// 個別ルール: 発火する文と発火しない文を対にする。
// 「発火しない」側は、正当な問い合わせで実際に起こりうる表現を選んでいる。
// ---------------------------------------------------------------------------

const positiveCases: readonly [string, Partial<ContactContent>][] = [
  ['scheduling_link', {message: 'https://timerex.net/s/aa/000 よりご予約を'}],
  ['noreply_sender', {email: 'mktg-noreply@example-b.com'}],
  ['url_shortener', {message: '資料は https://x.gd/aa001 をご覧ください'}],
  ['decoration_rule_line', {message: '■お知らせ\n━━━━━━━━━━\n以上'}],
  ['decoration_density', {message: '■'.repeat(25)}],
  ['bullet_headings', {message: '■特徴\n▼実績\n★ポイント'}],
  [
    'url_list',
    {
      message:
        '実績 https://example-1.co.jp/ https://example-2.co.jp/ https://example-3.co.jp/',
    },
  ],
  [
    'tracking_params',
    {message: 'https://example-a.co.jp/lp/?utm_source=formmail'},
  ],
  ['not_sales_disclaimer', {message: '本メールは営業ではなくご相談です。'}],
  ['abrupt_greeting', {message: '突然のご連絡失礼いたします。'}],
  ['viewed_your_site', {message: '貴社のホームページを拝見しご連絡しました。'}],
  ['meeting_slot', {message: '30分ほどオンラインでお話しできませんか。'}],
  [
    'appointment_request',
    {message: 'ぜひ一度お打ち合わせの機会をいただけますと幸いです。'},
  ],
  ['no_pressure', {message: '急なご決断を求めるものではございません。'}],
  ['hyperbole', {message: '日本トップクラスの実績がございます。'}],
  ['info_exchange', {message: 'まずは情報交換の機会を頂けますと幸いです。'}],
  ['generic_addressee', {message: 'ご担当者様\n\nお世話になります。'}],
  ['if_interested_cta', {message: 'ご興味がございましたらご返信ください。'}],
  ['self_spec_numbers', {message: '技術者が500名ほど在籍しております。'}],
  ['formal_addressee_name', {message: '代表取締役　山田　太郎　様'}],
  [
    'supply_side_offer',
    {message: '弊社を下請けとして使っていただける企業様を募集しております。'},
  ],
  ['logo_dropping', {message: '東証グロース市場上場（証券コード：0000）'}],
  [
    'self_intro_pitch',
    {message: '弊社は大阪を拠点にシステム開発事業を行っております。'},
  ],
  ['your_clients', {message: '貴社のクライアントの中にお困りの企業は。'}],
  ['service_menu', {message: '■サービス概要\n・内容'}],
  ['empty_title', {title: ''}],
  ['bracket_title', {title: '【ご提案】協業について'}],
  ['freemail', {email: 'yamada1990@gmail.com'}],
  ['role_address', {email: 'sales@example-b.co.jp'}],
  ['long_body', {message: 'あ'.repeat(1200)}],
  [
    'asks_us_to_do',
    {message: '御社にて製作が出来ないかご相談させてください。'},
  ],
  ['job_application', {message: 'エンジニア職への応募を希望しております。'}],
  [
    'admits_lack',
    {message: '恥ずかしながら弊社では開発が出来ず困っております。'},
  ],
  [
    'existing_contact',
    {message: '先日納品いただいたサイトについてご相談です。'},
  ],
  ['procurement', {message: '概算のお見積りをいただけますでしょうか。'}],
  [
    'own_problem',
    {message: '現在、在庫を紙とExcelで管理しており困っております。'},
  ],
]

const negativeCases: readonly [string, Partial<ContactContent>][] = [
  ['scheduling_link', {message: 'https://example-a.co.jp/ をご覧ください'}],
  ['noreply_sender', {email: 'yamada@example-b.com'}],
  ['url_shortener', {message: 'https://example-a.co.jp/x をご覧ください'}],
  // 電話番号のハイフンは装飾の連続と見なさない
  ['decoration_rule_line', {message: 'TEL: 03-1234-5678'}],
  ['decoration_density', {message: 'サーバーとメーカーの話です。'}],
  ['bullet_headings', {message: '■特徴\n通常の行\nもう一行'}],
  ['url_list', {message: 'https://example-1.co.jp/ をご覧ください'}],
  ['tracking_params', {message: 'https://example-a.co.jp/lp/'}],
  ['not_sales_disclaimer', {message: '無料でご相談いただけます。'}],
  ['abrupt_greeting', {message: 'はじめまして。山田と申します。'}],
  // 「貴社の実績を踏まえ」だけでは発火しない（拝見・見させて が必要）
  ['viewed_your_site', {message: '貴社の開発実績を踏まえご連絡しました。'}],
  // 面談時間が書かれていなければ発火しない
  ['meeting_slot', {message: 'オンラインでお打ち合わせをお願いできますか。'}],
  ['appointment_request', {message: '打ち合わせの日程はいつでも構いません。'}],
  ['no_pressure', {message: 'お手数ですがご確認をお願いいたします。'}],
  ['hyperbole', {message: '実績を教えていただけますでしょうか。'}],
  ['info_exchange', {message: '情報をご提供いただけますでしょうか。'}],
  ['generic_addressee', {message: '山田様\n\nお世話になります。'}],
  ['if_interested_cta', {message: 'ご不明点があればお知らせください。'}],
  // 発注側が自社の利用人数を書くケースは発火させない
  ['self_spec_numbers', {message: '利用者は社内10名程度、取引先が30社です。'}],
  ['formal_addressee_name', {message: '代表取締役の山田と申します。'}],
  ['supply_side_offer', {message: '開発をお願いできる会社を探しております。'}],
  ['logo_dropping', {message: '山田様、お世話になっております。'}],
  ['self_intro_pitch', {message: '弊社は自動車部品の製造メーカでございます。'}],
  ['your_clients', {message: '弊社のお客様からお問い合わせをいただきました。'}],
  ['service_menu', {message: '希望する機能は以下の通りです。'}],
  ['empty_title', {title: 'お問い合わせ'}],
  ['bracket_title', {title: '開発のご相談'}],
  ['freemail', {email: 'yamada@example-gmail-clone.co.jp'}],
  ['role_address', {email: 'salesforce.tanaka@example-b.co.jp'}],
  ['long_body', {message: 'あ'.repeat(1199)}],
  // 「弊社から発注したい」型の営業には発火しない（主語アンカー）
  [
    'asks_us_to_do',
    {
      message:
        '弊社からの発注させていただけるような協業先様も常時募集しております。',
    },
  ],
  // 勧誘（協賛のお願い）は発注ではないので発火しない
  [
    'asks_us_to_do',
    {message: '本イベントに貴社にご協賛いただけないかと考えております。'},
  ],
  // 「応募期間」は応募行為ではない
  ['job_application', {message: '応募期間は3月2日から5月12日までです。'}],
  // 受け手側の能力不足を語る下請け営業には発火しない
  [
    'admits_lack',
    {message: '原稿作成の知見が社内になく手つかずの企業は少なくありません。'},
  ],
  // 前置きのない「納品」「請求書」では発火しない
  ['existing_contact', {message: '取材設計から原稿作成・納品まで対応します。'}],
  ['existing_contact', {message: '請求書払いにも対応しております。'}],
  // 要件定義・仕様・納期の単独出現では発火しない
  [
    'procurement',
    {message: '要件定義から設計・開発、保守運用まで対応いたします。'},
  ],
  // 受け手の顧客の課題を語る下請け営業には発火しない
  [
    'own_problem',
    {message: '貴社のクライアントの中に課題となっている企業はございませんか。'},
  ],
]

test.each(positiveCases)('%s が発火する', (id, content) => {
  expect(fires(id, content)).toBe(true)
})

test.each(negativeCases)('%s が発火しない', (id, content) => {
  expect(fires(id, content)).toBe(false)
})

// ---------------------------------------------------------------------------
// 網羅性: 旧実装は NGワード10語のうち8語が実データに1件もヒットしていなかった。
// 同じ状態に戻らないよう、全ルールが最低1件のフィクスチャで発火することを見る。
// ---------------------------------------------------------------------------

test('positiveCases / negativeCases が全ルールを網羅している', () => {
  const covered = new Set(positiveCases.map(([id]) => id))
  const missing = allRules
    .filter((rule) => !covered.has(rule.id))
    .map((rule) => rule.id)
  expect(missing).toEqual([])

  const negativeCovered = new Set(negativeCases.map(([id]) => id))
  const missingNegative = allRules
    .filter((rule) => !negativeCovered.has(rule.id))
    .map((rule) => rule.id)
  expect(missingNegative).toEqual([])
})

test('すべての加点ルールが少なくとも1件の営業フィクスチャで発火する', () => {
  const dead = salesRules
    .filter(
      (rule) =>
        !allSalesFixtures.some((fixture) =>
          rule.test(buildDetectorInput(fixture)),
        ),
    )
    .map((rule) => rule.id)
  expect(dead).toEqual([])
})

test('すべての減点ルールが少なくとも1件の非営業フィクスチャで発火する', () => {
  const dead = legitSignalRules
    .filter(
      (rule) =>
        !allNonSalesFixtures.some((fixture) =>
          rule.test(buildDetectorInput(fixture)),
        ),
    )
    .map((rule) => rule.id)
  expect(dead).toEqual([])
})

test('減点ルールは正当な問い合わせのフィクスチャでのみ発火する', () => {
  // 減点ルールが営業メールで発火すると、隔離をすり抜ける穴になる
  const leaked: string[] = []
  for (const fixture of allSalesFixtures) {
    const input = buildDetectorInput(fixture)
    for (const rule of legitSignalRules) {
      if (rule.test(input)) {
        leaked.push(`${fixture.id}:${rule.id}`)
      }
    }
  }
  expect(leaked).toEqual([])
})
