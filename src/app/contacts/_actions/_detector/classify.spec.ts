// 注意: ここでは index.ts ではなく ./classify を直接 import している。
// index.ts は 'server-only' を読み込むため、bun test からは評価できない。
import {expect, test} from 'bun:test'
import {classifyContact} from '@/app/contacts/_actions/_detector/classify'
import {legitFixtures} from '@/app/contacts/_actions/_detector/fixtures/legitFixtures'
import {salesFixtures} from '@/app/contacts/_actions/_detector/fixtures/salesFixtures'
import {
  syntheticLegitFixtures,
  syntheticSalesFixtures,
} from '@/app/contacts/_actions/_detector/fixtures/syntheticFixtures'
import {
  BLOCK_SCORE,
  SUSPECT_SCORE,
} from '@/app/contacts/_actions/_detector/thresholds'
import {ContactFixture} from '@/app/contacts/_actions/_detector/fixtures/types'

const allSalesFixtures = [...salesFixtures, ...syntheticSalesFixtures]
/** 正当な問い合わせ。1件でもタグが付いてはいけない */
const strictLegitFixtures = [
  ...legitFixtures.filter((fixture) => fixture.label === 'legit'),
  ...syntheticLegitFixtures,
]
/** 営業寄りだが隔離してはいけないもの。タグは許容する */
const grayFixtures = legitFixtures.filter((fixture) => fixture.label === 'gray')

function describeScore(fixture: ContactFixture) {
  const {score, level, hitRuleIds} = classifyContact(fixture)
  return `${fixture.id} score=${score} level=${level} rules=${hitRuleIds.join('|')}`
}

test('営業フィクスチャの85%以上が [営業?] 以上に分類される', () => {
  const detected = allSalesFixtures.filter(
    (fixture) => classifyContact(fixture).level !== 'normal',
  )
  // 実測は 100%（39/39）。ルール追加やリファクタで下がったら気づけるよう
  // 下限を 85% に置いている
  const rate = detected.length / allSalesFixtures.length
  expect(rate).toBeGreaterThanOrEqual(0.85)
})

test('営業フィクスチャの30%以上が隔離対象になる', () => {
  const blocked = allSalesFixtures.filter(
    (fixture) => classifyContact(fixture).level === 'sales',
  )
  // 実測は 46%。BLOCK_SCORE を下げれば上がるが、誤爆の確認が取れるまでは
  // 保守的な閾値のままにしておく
  const rate = blocked.length / allSalesFixtures.length
  expect(rate).toBeGreaterThanOrEqual(0.3)
})

test('正当な問い合わせは1件も [営業?] 以上にならない', () => {
  const misclassified = strictLegitFixtures
    .filter((fixture) => classifyContact(fixture).level !== 'normal')
    .map(describeScore)
  expect(misclassified).toEqual([])
})

test('グレーゾーンの問い合わせは1件も隔離されない', () => {
  const quarantined = grayFixtures
    .filter((fixture) => classifyContact(fixture).level === 'sales')
    .map(describeScore)
  expect(quarantined).toEqual([])
})

test('正当な問い合わせの最高スコアと SUSPECT 閾値の間に余裕がある', () => {
  const scores = strictLegitFixtures.map(
    (fixture) => classifyContact(fixture).score,
  )
  const worst = Math.max(...scores)
  // 実測の最悪ケースは「無料メディアの取材依頼」の 5 点
  expect(SUSPECT_SCORE - worst).toBeGreaterThanOrEqual(2)
})

test('グレーゾーンの最高スコアと BLOCK 閾値の間に余裕がある', () => {
  const scores = grayFixtures.map((fixture) => classifyContact(fixture).score)
  const worst = Math.max(...scores)
  expect(BLOCK_SCORE - worst).toBeGreaterThanOrEqual(3)
})

test('隔離されたメールは2カテゴリ以上のルールに引っかかっている', () => {
  // 単一種類の証拠だけで隔離されていないことを、実データに対して確認する
  const suspicious = allSalesFixtures
    .filter((fixture) => classifyContact(fixture).level === 'sales')
    .filter((fixture) => classifyContact(fixture).hitRuleIds.length < 3)
    .map(describeScore)
  expect(suspicious).toEqual([])
})

test('旧NGワードを含むだけでは何も起きない', () => {
  // 旧実装は message に「営業代行」等が含まれるだけで送信を拒否していた。
  // 単語の存在だけでは分類が動かないことを確認する
  for (const ngWord of [
    '成果報酬',
    '営業代行',
    'テレアポ',
    '採用代行',
    '相互リンク',
    'エンジニア派遣',
    '仲介支援',
    '無償で掲載',
    '情報交換',
    '採用支援',
  ]) {
    const result = classifyContact({
      name: '山田 太郎',
      email: 'yamada@example-a.co.jp',
      title: '開発のご相談',
      message: `${ngWord}についてお伺いしたく、ご連絡いたしました。`,
    })
    expect(result.level).toBe('normal')
  }
})

test('正規化により空白や半角カナを挟んだ回避は効かない', () => {
  const evaded = {
    name: '山田 太郎',
    email: 'sales@example-b.co.jp',
    title: '【ご 提 案】協 業 に つ い て',
    message: [
      '突 然 の ご 連 絡 失 礼 い た し ま す。',
      'ご 担 当 者 様',
      '弊社は技術者が500名ほど在籍しており、ｼｽﾃﾑ開発事業を行っております。',
      'まずは情 報 交 換の機会を頂けますと幸いです。',
      '30分ほどオンラインでお打ち合わせのお時間をいただけますでしょうか。',
    ].join('\n'),
  }
  const result = classifyContact(evaded)
  expect(result.hitRuleIds).toContain('abrupt_greeting')
  expect(result.hitRuleIds).toContain('generic_addressee')
  expect(result.hitRuleIds).toContain('info_exchange')
  expect(result.hitRuleIds).toContain('self_spec_numbers')
  expect(result.level).not.toBe('normal')
})

/**
 * 閾値をチューニングするときの全件スコア表。
 * `DETECTOR_REPORT=1 bun test src/app/contacts/_actions/_detector/classify.spec.ts`
 */
test.skipIf(!process.env.DETECTOR_REPORT)('スコア一覧を出力する', () => {
  const rows = [
    ...allSalesFixtures,
    ...legitFixtures,
    ...syntheticLegitFixtures,
  ]
    .map((fixture) => ({fixture, result: classifyContact(fixture)}))
    .sort((left, right) => right.result.score - left.result.score)

  for (const {fixture, result} of rows) {
    console.log(
      `${String(result.score).padStart(3)} ${fixture.label.padEnd(6)} ` +
        `${result.level.padEnd(7)} ${fixture.id.padEnd(34)} ` +
        `${result.hitRuleIds.join(',')}`,
    )
  }

  const salesScores = allSalesFixtures.map(
    (fixture) => classifyContact(fixture).score,
  )
  const nonSalesScores = [...legitFixtures, ...syntheticLegitFixtures].map(
    (fixture) => classifyContact(fixture).score,
  )
  console.log('\n閾値  営業検出  非営業の誤検出')
  for (let threshold = 4; threshold <= 16; threshold += 1) {
    const hit = salesScores.filter((score) => score >= threshold).length
    const falsePositive = nonSalesScores.filter(
      (score) => score >= threshold,
    ).length
    console.log(
      `${String(threshold).padStart(3)}   ${hit}/${salesScores.length}     ${falsePositive}/${nonSalesScores.length}`,
    )
  }
})
