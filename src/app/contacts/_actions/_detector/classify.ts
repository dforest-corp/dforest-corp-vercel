import {buildDetectorInput} from '@/app/contacts/_actions/_detector/normalize'
import {allRules} from '@/app/contacts/_actions/_detector/rules'
import {scoreRules} from '@/app/contacts/_actions/_detector/scoring'
import {
  BLOCK_SCORE,
  SUSPECT_SCORE,
} from '@/app/contacts/_actions/_detector/thresholds'
import {
  ClassifyResult,
  ContactContent,
  SalesLevel,
} from '@/app/contacts/_actions/_detector/types'

function levelOf(score: number): SalesLevel {
  if (score >= BLOCK_SCORE) {
    return 'sales'
  }
  if (score >= SUSPECT_SCORE) {
    return 'suspect'
  }
  return 'normal'
}

/**
 * 問い合わせ内容が営業メールかどうかをスコアリングで判定する。
 *
 * 同期・純関数（I/O なし）。呼び出し側でタイムアウトを考える必要はないが、
 * 判定の不具合で問い合わせを失わないよう、呼び出し側は必ず try/catch で
 * フェイルオープンにすること。
 *
 * @package
 */
export function classifyContact(content: ContactContent): ClassifyResult {
  const input = buildDetectorInput(content)
  const {score, hitRuleIds} = scoreRules(input, allRules)

  return {level: levelOf(score), score, hitRuleIds}
}
