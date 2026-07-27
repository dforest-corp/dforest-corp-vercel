import {expect, test} from 'bun:test'
import {classifyContact} from '@/app/contacts/_actions/_detector/classify'
import {
  allRules,
  legitSignalRules,
  salesRules,
} from '@/app/contacts/_actions/_detector/rules'
import {
  BLOCK_SCORE,
  CATEGORY_CAPS,
  MAX_RULE_WEIGHT,
  SUSPECT_SCORE,
} from '@/app/contacts/_actions/_detector/thresholds'
import {RuleCategory} from '@/app/contacts/_actions/_detector/types'

// ---------------------------------------------------------------------------
// ここは「複数の強シグナルの同時成立を要求する」という設計を、実装が満たして
// いることの機械的な証明。
//
// 単純NGワードの部分一致でブロックしていた旧実装は、1語追加するだけで誤ブロックが
// 始まる構造だった。以下の不変条件が守られている限り、その状態には戻れない。
// ---------------------------------------------------------------------------

const positiveCaps = (
  Object.entries(CATEGORY_CAPS) as [RuleCategory, number][]
).filter(([, cap]) => cap > 0)

test('ルールIDは一意', () => {
  const ids = allRules.map((rule) => rule.id)
  expect(new Set(ids).size).toBe(ids.length)
})

test('ルールIDはログに出しても本文が復元できない文字種のみ', () => {
  const invalid = allRules
    .filter((rule) => !/^[a-z0-9_]+$/.test(rule.id))
    .map((rule) => rule.id)
  expect(invalid).toEqual([])
})

test('加点ルールの重みは MAX_RULE_WEIGHT 以下', () => {
  const tooHeavy = salesRules
    .filter((rule) => rule.weight > MAX_RULE_WEIGHT)
    .map((rule) => `${rule.id}:${rule.weight}`)
  expect(tooHeavy).toEqual([])
})

test('減点ルール単体の重みは legit カテゴリの下限を超えない', () => {
  // 減点は「隔離しない方向」にしか働かないので MAX_RULE_WEIGHT は適用しないが、
  // 単体でカテゴリ下限を超える重みは付けられないようにしておく
  const tooHeavy = legitSignalRules
    .filter((rule) => rule.weight < CATEGORY_CAPS.legit)
    .map((rule) => `${rule.id}:${rule.weight}`)
  expect(tooHeavy).toEqual([])
})

test('どの単一ルールも単独では [営業?] タグに到達できない', () => {
  // MAX_RULE_WEIGHT < SUSPECT_SCORE なので、タグ付けには最低2ルールの
  // 同時成立が必要になる
  expect(MAX_RULE_WEIGHT).toBeLessThan(SUSPECT_SCORE)
})

test('どの単一カテゴリも単独では隔離に到達できない', () => {
  // 加点カテゴリの上限がすべて BLOCK_SCORE 未満 = 隔離には2カテゴリ以上の
  // 独立した証拠が必要
  const reachable = positiveCaps.filter(([, cap]) => cap >= BLOCK_SCORE)
  expect(reachable).toEqual([])
})

test('言い回しとメタ情報だけでは隔離されない', () => {
  // template（営業の定型文）と meta（件名の【】・フリーメール・本文長）を
  // 全部踏んでも隔離に届かない。隔離には bulk（一斉送信の痕跡）か
  // pitch（自己PR）の証拠が必須になる
  expect(CATEGORY_CAPS.template + CATEGORY_CAPS.meta).toBeLessThan(BLOCK_SCORE)
})

test('閾値は SUSPECT < BLOCK の順', () => {
  expect(SUSPECT_SCORE).toBeLessThan(BLOCK_SCORE)
})

test('加点ルールの重みは正、減点ルールの重みは負', () => {
  expect(salesRules.filter((rule) => rule.weight <= 0)).toEqual([])
  expect(legitSignalRules.filter((rule) => rule.weight >= 0)).toEqual([])
})

test('減点ルールのカテゴリは legit のみ', () => {
  const misplaced = legitSignalRules
    .filter((rule) => rule.category !== 'legit')
    .map((rule) => rule.id)
  expect(misplaced).toEqual([])
})

test('legit カテゴリに加点ルールが混ざっていない', () => {
  const misplaced = salesRules
    .filter((rule) => rule.category === 'legit')
    .map((rule) => rule.id)
  expect(misplaced).toEqual([])
})

test('すべてのルールに説明が書かれている', () => {
  const missing = allRules
    .filter((rule) => rule.description.trim().length === 0)
    .map((rule) => rule.id)
  expect(missing).toEqual([])
})

test('本文4000文字の最悪ケースでも採点が50ms未満で終わる', () => {
  // 正規表現は上限付きの量指定子（[^。]{0,24} 等）だけで書いており、
  // ネストした量指定子による破滅的バックトラックが起きないことを確認する
  const worst = {
    name: 'あ'.repeat(60),
    email: 'sales@example-worst.co.jp',
    title: '【'.repeat(50),
    message:
      '弊社は貴社の御社にてご担当者様と情報交換の機会をいただけますでしょうか'
        .repeat(200)
        .slice(0, 4000),
  }

  const start = performance.now()
  classifyContact(worst)
  const elapsed = performance.now() - start

  expect(elapsed).toBeLessThan(50)
})

test('装飾記号だけを4000文字並べても採点が50ms未満で終わる', () => {
  const start = performance.now()
  classifyContact({
    name: '山田',
    email: 'yamada@example-a.co.jp',
    title: 'テスト',
    message: '━'.repeat(4000),
  })
  expect(performance.now() - start).toBeLessThan(50)
})

test('空の入力でも例外を投げず normal のままになる', () => {
  // タイトル未入力の1点しか付かない（メタ情報だけでは何も起きない）
  const result = classifyContact({name: '', email: '', title: '', message: ''})
  expect(result.hitRuleIds).toEqual(['empty_title'])
  expect(result.score).toBe(1)
  expect(result.level).toBe('normal')
})
