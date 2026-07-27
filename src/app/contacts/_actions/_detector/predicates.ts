import {DetectorInput} from '@/app/contacts/_actions/_detector/types'

/** @package */
export type Predicate = (input: DetectorInput) => boolean

/**
 * 正規化済みテキストに対する語句マッチ。空白が除去済みなので、
 * 文字数窓は原文より狭く見積もる必要がある。
 *
 * @package
 */
export const onNormalized =
  (pattern: RegExp): Predicate =>
  (input) =>
    pattern.test(input.normalizedText)

/**
 * 原文に対するマッチ。装飾記号・改行構造・全角スペースを見るルールで使う。
 *
 * @package
 */
export const onRaw =
  (pattern: RegExp): Predicate =>
  (input) =>
    pattern.test(input.rawText)

/**
 * 共起を要求する。全条件が成立したときだけ true。
 * 「面談時間 × オンライン」のように、単独では弱いシグナルを束ねるのに使う。
 *
 * @package
 */
export const everyOf =
  (...predicates: readonly Predicate[]): Predicate =>
  (input) =>
    predicates.every((predicate) => predicate(input))

/** @package */
export const someOf =
  (...predicates: readonly Predicate[]): Predicate =>
  (input) =>
    predicates.some((predicate) => predicate(input))

/** @package */
export const not =
  (predicate: Predicate): Predicate =>
  (input) =>
    !predicate(input)

/**
 * 行頭が pattern に一致する行が threshold 行以上あるか。
 * 行頭の空白（全角含む）は無視する。
 *
 * @package
 */
export const lineStartCountAtLeast =
  (pattern: RegExp, threshold: number): Predicate =>
  (input) =>
    input.rawLines.filter((line) => pattern.test(line.replace(/^[\s　]+/, '')))
      .length >= threshold

/**
 * 本文中の URL のいずれかが、与えられたドメインのいずれかに属するか。
 * `example.com` は `sub.example.com` にも一致するが、`notexample.com` には
 * 一致しない（ホスト部の境界を見る）。
 *
 * @package
 */
export const hasUrlFromDomain =
  (domains: readonly string[]): Predicate =>
  (input) =>
    input.urls.some((url) => {
      const host = url
        .replace(/^https?:\/\//i, '')
        .split('/')[0]
        .toLowerCase()
      return domains.some(
        (domain) => host === domain || host.endsWith(`.${domain}`),
      )
    })
