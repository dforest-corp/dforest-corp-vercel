import {CATEGORY_CAPS} from '@/app/contacts/_actions/_detector/thresholds'
import {
  DetectorInput,
  Rule,
  RuleCategory,
} from '@/app/contacts/_actions/_detector/types'

/** @package */
export type ScoreBreakdown = {
  readonly score: number
  readonly hitRuleIds: readonly string[]
}

/**
 * ルールを評価してスコアを合算する。
 *
 * カテゴリごとに合算 → カテゴリ上限でクリップ → 総和 → 下限0でクリップ の順。
 * カテゴリ単位でクリップするのが要点で、これによって「同種の証拠をいくら
 * 積み上げても単独では隔離に到達しない」という性質が生まれる。
 *
 * @package
 */
export function scoreRules(
  input: DetectorInput,
  rules: readonly Rule[],
): ScoreBreakdown {
  const hitRuleIds: string[] = []
  const perCategory: Partial<Record<RuleCategory, number>> = {}

  for (const rule of rules) {
    if (!rule.test(input)) {
      continue
    }
    hitRuleIds.push(rule.id)
    perCategory[rule.category] = (perCategory[rule.category] ?? 0) + rule.weight
  }

  let total = 0
  for (const [category, sum] of Object.entries(perCategory)) {
    const cap = CATEGORY_CAPS[category as RuleCategory]
    total += cap < 0 ? Math.max(sum, cap) : Math.min(sum, cap)
  }

  return {score: Math.max(total, 0), hitRuleIds}
}
