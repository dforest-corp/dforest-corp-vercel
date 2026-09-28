import {describe, expect, test} from 'bun:test'
import {splitHtmlBeforeHeading} from './splitHtmlBeforeHeading'

describe('splitHtmlBeforeHeading', () => {
  test('見出しの直前で分割する', () => {
    const html = '<p>挨拶文</p><h3 id="hb6bf662ea1">理念</h3><p>本文</p>'
    expect(splitHtmlBeforeHeading(html, '理念')).toEqual({
      before: '<p>挨拶文</p>',
      after: '<h3 id="hb6bf662ea1">理念</h3><p>本文</p>',
    })
  })

  test('属性なし・前後の空白ありの見出しも対象にする', () => {
    const html = '<p>a</p><h2> 理念 </h2>'
    expect(splitHtmlBeforeHeading(html, '理念')).toEqual({
      before: '<p>a</p>',
      after: '<h2> 理念 </h2>',
    })
  })

  test('見出し以外に含まれるテキストでは分割しない', () => {
    const html = '<p>理念</p><h3>理念</h3>'
    expect(splitHtmlBeforeHeading(html, '理念')).toEqual({
      before: '<p>理念</p>',
      after: '<h3>理念</h3>',
    })
  })

  test('見出しが無ければ全体を after に入れる', () => {
    const html = '<p>挨拶文</p>'
    expect(splitHtmlBeforeHeading(html, '理念')).toEqual({
      before: '',
      after: html,
    })
  })

  test('見出しテキストの正規表現メタ文字をエスケープする', () => {
    const html = '<p>a</p><h3>理念(案)</h3>'
    expect(splitHtmlBeforeHeading(html, '理念(案)').before).toBe('<p>a</p>')
  })
})
