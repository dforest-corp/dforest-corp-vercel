import {expect, test} from 'bun:test'
import {formatDateTime} from '@/utils/formatDateTime'

test('UTC 深夜は JST でも同じ日付になり、月日はゼロ埋めされる', () => {
  expect(formatDateTime('2024-03-05T00:00:00.000Z')).toBe('2024/03/05')
})

test('UTC 15時は JST で翌日になる', () => {
  expect(formatDateTime('2024-03-05T15:00:00.000Z')).toBe('2024/03/06')
})

test('日付が繰り上がる直前は当日のまま', () => {
  expect(formatDateTime('2024-03-05T14:59:59.999Z')).toBe('2024/03/05')
})

test('年をまたぐ変換', () => {
  expect(formatDateTime('2023-12-31T15:00:00.000Z')).toBe('2024/01/01')
})

test('オフセット付きの文字列も JST の日付に変換される', () => {
  expect(formatDateTime('2024-03-05T09:00:00+09:00')).toBe('2024/03/05')
})
