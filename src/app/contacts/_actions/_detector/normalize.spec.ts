import {expect, test} from 'bun:test'
import {
  buildDetectorInput,
  DECORATION_RUN_PATTERN,
  normalizeForMatch,
  URL_PATTERN,
} from '@/app/contacts/_actions/_detector/normalize'
import {ContactContent} from '@/app/contacts/_actions/_detector/types'

function withMessage(message: string, title = ''): ContactContent {
  return {name: '山田', email: 'yamada@example-a.co.jp', title, message}
}

test('半角・全角スペース挿入による回避を無効化する', () => {
  expect(normalizeForMatch('営 業\u3000代 行')).toBe('営業代行')
})

test('半角カナは NFKC で全角に揃う', () => {
  expect(normalizeForMatch('ｴﾝｼﾞﾆｱ派遣')).toBe('エンジニア派遣')
})

test('ゼロ幅スペースによる語の分断を無効化する', () => {
  expect(normalizeForMatch('営\u200b業\u200b代\u200b行')).toBe('営業代行')
})

test('全角英数は半角小文字に揃う', () => {
  expect(normalizeForMatch('ＲＦＰ')).toBe('rfp')
})

test('句点は残るので文をまたがない窓を書ける', () => {
  expect(normalizeForMatch('一文目です。二文目です。')).toBe(
    '一文目です。二文目です。',
  )
})

test('正規化テキストから URL が除去される', () => {
  const normalized = normalizeForMatch(
    '詳細は https://example.com/sales-support/ をご覧ください',
  )
  expect(normalized).not.toContain('sales')
  expect(normalized).toBe('詳細はをご覧ください')
})

test('URL 抽出は末尾の句点や括弧を含めない', () => {
  expect('資料は https://example.com/a。'.match(URL_PATTERN)).toEqual([
    'https://example.com/a',
  ])
  expect('（https://example.com/b）を参照'.match(URL_PATTERN)).toEqual([
    'https://example.com/b',
  ])
})

test('装飾記号カウントは URL 内の記号を数えない', () => {
  const input = buildDetectorInput(
    withMessage('資料はこちらです https://example.com/a-b_c=d~e/f|g'),
  )
  expect(input.decorationCount).toBe(0)
})

test('長音符は装飾記号として数えない', () => {
  // 「メーカー」「サーバー」など通常の日本語に現れるため除外している
  const input = buildDetectorInput(
    withMessage('サーバー移行について、メーカーに確認しました'),
  )
  expect(input.decorationCount).toBe(0)
})

test('罫線は装飾記号として数える', () => {
  const input = buildDetectorInput(withMessage('■お知らせ\n━━━━━━━━━━'))
  expect(input.decorationCount).toBe(11)
})

test('同一記号の罫線は装飾の連続として検出される', () => {
  expect(DECORATION_RUN_PATTERN.test('━━━━━━━━━━')).toBe(true)
  expect(DECORATION_RUN_PATTERN.test('****************')).toBe(true)
  expect(DECORATION_RUN_PATTERN.test('┏┏┏┏┏┏┏┏')).toBe(true)
})

test('交互に並ぶ装飾も連続として検出される', () => {
  expect(DECORATION_RUN_PATTERN.test('∵∴∵∴∵∴∵∴')).toBe(true)
  expect(DECORATION_RUN_PATTERN.test('▼△▼△＝＝＝＝')).toBe(true)
})

test('装飾の連続は行をまたいで一致しない', () => {
  expect(DECORATION_RUN_PATTERN.test('■あ\n■い\n■う\n■え\n■お')).toBe(false)
})

test('電話番号や日時のハイフンは装飾の連続と見なさない', () => {
  expect(DECORATION_RUN_PATTERN.test('TEL: 03-1234-5678')).toBe(false)
  expect(DECORATION_RUN_PATTERN.test('10:00~11:00 / 13:00~14:00')).toBe(false)
})

test('メールアドレスはローカルパートとドメインに分解される', () => {
  const input = buildDetectorInput({
    name: '佐藤',
    email: '  Sales@Example-B.CO.JP ',
    title: '',
    message: 'テスト',
  })
  expect(input.email).toBe('sales@example-b.co.jp')
  expect(input.emailLocalPart).toBe('sales')
  expect(input.emailDomain).toBe('example-b.co.jp')
})

test('タイトルは語句マッチの対象に含まれる', () => {
  const input = buildDetectorInput(withMessage('本文です', '【ご提案】協業'))
  expect(input.normalizedText).toContain('ご提案')
})

test('行の分割は本文のみを対象にする', () => {
  const input = buildDetectorInput(withMessage('一行目\n二行目', 'タイトル'))
  expect(input.rawLines).toEqual(['一行目', '二行目'])
})
