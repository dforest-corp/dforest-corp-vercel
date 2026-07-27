import {
  ContactContent,
  DetectorInput,
} from '@/app/contacts/_actions/_detector/types'

/**
 * 本文中の URL を拾う。末尾の句読点・括弧・引用符は URL に含めない。
 *
 * @package
 */
export const URL_PATTERN =
  /https?:\/\/[^\s　<>()\[\]（）【】〈〉《》「」『』。、"']+/g

/**
 * ゼロ幅スペース・双方向制御文字・BOM・ソフトハイフン。
 * 語の間にゼロ幅文字を挟む回避（営 + U+200B + 業）を無効化するために落とす。
 */
const INVISIBLE_PATTERN =
  /[\u00ad\u200b-\u200f\u202a-\u202e\u2060-\u2064\ufeff]/g

/**
 * 装飾に使われる記号。罫線・箇条書き見出し・区切り線を数えるために使う。
 *
 * 長音符 `ー`(U+30FC) と `〇`(U+3007) は「メーカー」「〇〇」のように通常の
 * 日本語として出現するため、意図的に含めていない。`<` `>` も引用記号
 * （`>>>>>`）として使われうるので除外している。
 */
const DECORATION_PATTERN =
  /[*#=+_~|\/\\＊＃＝＋｜／＿～－‐‑‒–—―─━│┃┌┏┐┓└┗┘┛├┣┤┫┬┳┴┻┼╋═║■□▪▫▲▼△▽◆◇●○◎★☆♪✓☑✔▶▷◀◁※〓∵∴-]/g

/**
 * 装飾記号が5個以上連続する箇所。`━━━━━` のような単一記号の罫線だけでなく、
 * `∵∴∵∴∵` `▼△▼△＝` のような交互の装飾も拾う。
 * 改行は文字クラスに含まれないので行をまたいで一致することはない。
 *
 * @package
 */
export const DECORATION_RUN_PATTERN = new RegExp(
  `(?:${DECORATION_PATTERN.source}){5,}`,
)

/**
 * 語句マッチ用の正規化。
 *
 * 空白を全て落とすため、この文字列に対するルールの文字数窓（`[^。]{0,24}` 等）は
 * 原文より狭くなる。重みと閾値はすべてこの正規化を前提に実測しているので、
 * 正規化の仕様を変えたら閾値を再計測する必要がある。
 *
 * @package
 */
export function normalizeForMatch(text: string) {
  return text
    .normalize('NFKC')
    .replace(INVISIBLE_PATTERN, '')
    .replace(URL_PATTERN, '')
    .replace(/[\s　]+/g, '')
    .toLowerCase()
}

/** @package */
export function buildDetectorInput(content: ContactContent): DetectorInput {
  // 改行を LF に揃える。textarea からは LF で届くが、
  // 貼り付けや別経路の入力で CRLF が混ざっても行単位の判定が壊れないようにする。
  const message = content.message.replace(/\r\n?/g, '\n')
  const rawText = `${content.title}\n${message}`
  const messageWithoutUrls = message.replace(URL_PATTERN, '')
  const email = content.email.trim().toLowerCase()
  const atIndex = email.lastIndexOf('@')

  return {
    rawText,
    rawLines: message.split('\n'),
    messageWithoutUrls,
    normalizedText: normalizeForMatch(rawText),
    email,
    emailLocalPart: atIndex === -1 ? email : email.slice(0, atIndex),
    emailDomain: atIndex === -1 ? '' : email.slice(atIndex + 1),
    title: content.title,
    urls: message.match(URL_PATTERN) ?? [],
    decorationCount: messageWithoutUrls.match(DECORATION_PATTERN)?.length ?? 0,
    messageLength: message.length,
  }
}
