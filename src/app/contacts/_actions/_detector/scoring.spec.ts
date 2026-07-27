import {expect, test} from 'bun:test'
import {buildDetectorInput} from '@/app/contacts/_actions/_detector/normalize'
import {scoreRules} from '@/app/contacts/_actions/_detector/scoring'
import {CATEGORY_CAPS} from '@/app/contacts/_actions/_detector/thresholds'
import {Rule, RuleCategory} from '@/app/contacts/_actions/_detector/types'

const input = buildDetectorInput({
  name: '山田',
  email: 'yamada@example-a.co.jp',
  title: 'テスト',
  message: 'テスト本文',
})

function alwaysHit(id: string, category: RuleCategory, weight: number): Rule {
  return {id, category, weight, description: id, test: () => true}
}

function neverHit(id: string, category: RuleCategory, weight: number): Rule {
  return {id, category, weight, description: id, test: () => false}
}

test('ヒットしたルールの重みが合算される', () => {
  const result = scoreRules(input, [
    alwaysHit('a', 'bulk', 3),
    alwaysHit('b', 'template', 2),
  ])
  expect(result.score).toBe(5)
  expect(result.hitRuleIds).toEqual(['a', 'b'])
})

test('ヒットしなかったルールは無視される', () => {
  const result = scoreRules(input, [
    alwaysHit('a', 'bulk', 3),
    neverHit('b', 'bulk', 4),
  ])
  expect(result.score).toBe(3)
  expect(result.hitRuleIds).toEqual(['a'])
})

test('ルールが1件もヒットしなければスコアは0になる', () => {
  const result = scoreRules(input, [neverHit('a', 'bulk', 4)])
  expect(result.score).toBe(0)
  expect(result.hitRuleIds).toEqual([])
})

test('同一カテゴリの合計はカテゴリ上限でクリップされる', () => {
  // bulk の上限は 7。4 + 4 + 4 = 12 だが 7 に丸められる
  const result = scoreRules(input, [
    alwaysHit('a', 'bulk', 4),
    alwaysHit('b', 'bulk', 4),
    alwaysHit('c', 'bulk', 4),
  ])
  expect(CATEGORY_CAPS.bulk).toBe(7)
  expect(result.score).toBe(7)
})

test('クリップはカテゴリごとに独立して行われる', () => {
  // bulk は 8 → 7 に丸められるが、template の 2 はそのまま加算される
  const result = scoreRules(input, [
    alwaysHit('a', 'bulk', 4),
    alwaysHit('b', 'bulk', 4),
    alwaysHit('c', 'template', 2),
  ])
  expect(result.score).toBe(9)
})

test('減点の合計は下限でクリップされる', () => {
  // legit の下限は -12。-6 * 3 = -18 だが -12 で止まる
  const result = scoreRules(input, [
    alwaysHit('base', 'bulk', 4),
    alwaysHit('a', 'legit', -6),
    alwaysHit('b', 'legit', -6),
    alwaysHit('c', 'legit', -6),
  ])
  expect(CATEGORY_CAPS.legit).toBe(-12)
  // 4 + (-12) = -8 → 下限0でクリップ
  expect(result.score).toBe(0)
})

test('減点は加点を打ち消す', () => {
  const result = scoreRules(input, [
    alwaysHit('a', 'bulk', 4),
    alwaysHit('b', 'template', 4),
    alwaysHit('c', 'legit', -6),
  ])
  expect(result.score).toBe(2)
})

test('総合スコアは0未満にならない', () => {
  const result = scoreRules(input, [alwaysHit('a', 'legit', -4)])
  expect(result.score).toBe(0)
})

test('ヒットしたルールIDはルール定義の順序で返る', () => {
  const result = scoreRules(input, [
    alwaysHit('z', 'meta', 1),
    alwaysHit('a', 'meta', 1),
  ])
  expect(result.hitRuleIds).toEqual(['z', 'a'])
})
