import {expect, test} from 'bun:test'
import {legitFixtures} from '@/app/contacts/_actions/_detector/fixtures/legitFixtures'
import {salesFixtures} from '@/app/contacts/_actions/_detector/fixtures/salesFixtures'
import {
  syntheticLegitFixtures,
  syntheticSalesFixtures,
} from '@/app/contacts/_actions/_detector/fixtures/syntheticFixtures'
import {URL_PATTERN} from '@/app/contacts/_actions/_detector/normalize'

const allFixtures = [
  ...salesFixtures,
  ...legitFixtures,
  ...syntheticLegitFixtures,
  ...syntheticSalesFixtures,
]

/**
 * URL のホストとして許可するもの。
 * 日程調整SaaS と短縮URL は判定の強いシグナルなのでドメインを保持しており、
 * その代わりトークン部分を差し替えてある。
 */
const ALLOWED_URL_HOSTS = [
  'timerex.net',
  'calendar.app.google',
  'crowd-calendar.com',
  'x.gd',
]

/** 匿名化で使う電話番号・郵便番号のプレースホルダ */
const PLACEHOLDER_NUMBERS = [
  '00-0000-0000',
  '090-0000-0000',
  '〒000-0000',
  '+84 (000) - 0000 - 0000',
]

function blobOf(fixture: {
  name: string
  email: string
  title: string
  message: string
}) {
  return [fixture.name, fixture.email, fixture.title, fixture.message].join(
    '\n',
  )
}

test('フィクスチャが揃っている', () => {
  expect(salesFixtures.length).toBeGreaterThanOrEqual(36)
  expect(legitFixtures.length).toBeGreaterThanOrEqual(6)
  expect(syntheticLegitFixtures.length).toBeGreaterThanOrEqual(12)
  expect(syntheticSalesFixtures.length).toBeGreaterThanOrEqual(1)
})

test('フィクスチャの id は一意', () => {
  const ids = allFixtures.map((fixture) => fixture.id)
  expect(new Set(ids).size).toBe(ids.length)
})

test('配列とラベルが対応している', () => {
  expect(salesFixtures.every((fixture) => fixture.label === 'sales')).toBe(true)
  expect(
    syntheticSalesFixtures.every((fixture) => fixture.label === 'sales'),
  ).toBe(true)
  expect(
    legitFixtures.every(
      (fixture) => fixture.label === 'legit' || fixture.label === 'gray',
    ),
  ).toBe(true)
  expect(
    syntheticLegitFixtures.every((fixture) => fixture.label === 'legit'),
  ).toBe(true)
})

test('メールアドレスは example ドメインかフリーメールのみ', () => {
  const leaked = allFixtures
    .filter((fixture) => {
      const domain = fixture.email.slice(fixture.email.lastIndexOf('@') + 1)
      return !domain.includes('example') && domain !== 'gmail.com'
    })
    .map((fixture) => `${fixture.id}: ${fixture.email}`)
  expect(leaked).toEqual([])
})

test('本文中のメールアドレスも example ドメインかフリーメールのみ', () => {
  const leaked: string[] = []
  for (const fixture of allFixtures) {
    const matches = blobOf(fixture).match(/[\w.+-]+@[\w.-]+\.\w+/g) ?? []
    for (const match of matches) {
      const domain = match.slice(match.lastIndexOf('@') + 1)
      if (!domain.includes('example') && domain !== 'gmail.com') {
        leaked.push(`${fixture.id}: ${match}`)
      }
    }
  }
  expect(leaked).toEqual([])
})

test('URL のホストは example か日程調整SaaS・短縮URLのみ', () => {
  const leaked: string[] = []
  for (const fixture of allFixtures) {
    const urls = fixture.message.match(URL_PATTERN) ?? []
    for (const url of urls) {
      const host = url.replace(/^https?:\/\//i, '').split('/')[0]
      const allowed =
        host.includes('example') ||
        ALLOWED_URL_HOSTS.some(
          (candidate) => host === candidate || host.endsWith(`.${candidate}`),
        )
      if (!allowed) {
        leaked.push(`${fixture.id}: ${url}`)
      }
    }
  }
  expect(leaked).toEqual([])
})

test('電話番号・FAX番号が残っていない', () => {
  const leaked: string[] = []
  for (const fixture of allFixtures) {
    const matches =
      blobOf(fixture).match(
        /(?:\+\d{2} \(\d{3}\) - \d{4} - \d{4})|0\d{1,3}-\d{2,4}-\d{4}/g,
      ) ?? []
    for (const match of matches) {
      if (!PLACEHOLDER_NUMBERS.includes(match)) {
        leaked.push(`${fixture.id}: ${match}`)
      }
    }
  }
  expect(leaked).toEqual([])
})

test('郵便番号が残っていない', () => {
  const leaked: string[] = []
  for (const fixture of allFixtures) {
    const matches = blobOf(fixture).match(/〒\s*\d{3}[-‐]\d{4}/g) ?? []
    for (const match of matches) {
      if (!PLACEHOLDER_NUMBERS.includes(match)) {
        leaked.push(`${fixture.id}: ${match}`)
      }
    }
  }
  expect(leaked).toEqual([])
})

test('note に説明が書かれている', () => {
  const missing = allFixtures
    .filter((fixture) => fixture.note.trim().length === 0)
    .map((fixture) => fixture.id)
  expect(missing).toEqual([])
})
