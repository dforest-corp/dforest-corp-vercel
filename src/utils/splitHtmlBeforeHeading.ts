const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * 指定テキストを持つ見出し（h1〜h6）の直前で HTML を2分割する。
 * 見出しが無い場合は before を空文字、after を元の HTML とする。
 */
export const splitHtmlBeforeHeading = (html: string, headingText: string) => {
  const pattern = new RegExp(
    `<h[1-6](?:\\s[^>]*)?>\\s*${escapeRegExp(headingText)}\\s*</h[1-6]>`,
  )
  const match = pattern.exec(html)
  if (!match) {
    return {before: '', after: html}
  }
  return {
    before: html.slice(0, match.index),
    after: html.slice(match.index),
  }
}
