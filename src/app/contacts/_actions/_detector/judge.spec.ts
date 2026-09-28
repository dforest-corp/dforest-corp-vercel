import {expect, test, describe} from 'bun:test'
import {classifyContact} from '@/app/contacts/_actions/_detector/classify'
import {salesFixtures} from '@/app/contacts/_actions/_detector/fixtures/salesFixtures'
import {JevError} from '@/app/contacts/_actions/_detector/jev'
import {combine, judge} from '@/app/contacts/_actions/_detector/judge'
import {
  BLOCK_SCORE,
  JEV_BLOCK_PROBABILITY,
  JEV_SUSPECT_PROBABILITY,
  SUSPECT_SCORE,
} from '@/app/contacts/_actions/_detector/thresholds'
import {
  ClassifyResult,
  ContactContent,
} from '@/app/contacts/_actions/_detector/types'

const content: ContactContent = {
  name: '山田太郎',
  email: 'yamada@example.com',
  title: 'AI活用のご案内',
  message: '突然のご連絡失礼いたします。',
}

function rule(level: ClassifyResult['level'], score: number): ClassifyResult {
  return {level, score, hitRuleIds: ['x']}
}

describe('combine', () => {
  test('jevの確率がBLOCK閾値以上ならruleに関わらずsales/jev', () => {
    const result = combine(rule('normal', 0), {
      ok: true,
      probability: JEV_BLOCK_PROBABILITY,
    })
    expect(result).toEqual({level: 'sales', source: 'jev'})
  })

  test('ruleがnullでもjevのBLOCK閾値以上ならsales/jev', () => {
    const result = combine(null, {
      ok: true,
      probability: JEV_BLOCK_PROBABILITY,
    })
    expect(result).toEqual({level: 'sales', source: 'jev'})
  })

  test('jevの確率がSUSPECT以上BLOCK未満ならsuspect/jev', () => {
    const result = combine(rule('normal', 0), {
      ok: true,
      probability: JEV_SUSPECT_PROBABILITY,
    })
    expect(result).toEqual({level: 'suspect', source: 'jev'})
  })

  test('jevの確率がBLOCK閾値をわずかに下回るとsuspectどまり', () => {
    const result = combine(rule('normal', 0), {
      ok: true,
      probability: JEV_BLOCK_PROBABILITY - 0.0001,
    })
    expect(result.level).not.toBe('sales')
  })

  test('jevの確率がSUSPECT閾値をわずかに下回りruleがnormalならnormal/jev', () => {
    const result = combine(rule('normal', 0), {
      ok: true,
      probability: JEV_SUSPECT_PROBABILITY - 0.0001,
    })
    expect(result).toEqual({level: 'normal', source: 'jev'})
  })

  test('jevがnormal域でもruleがsuspect以上ならsuspect/rules', () => {
    const result = combine(rule('suspect', SUSPECT_SCORE), {
      ok: true,
      probability: 0.1,
    })
    expect(result).toEqual({level: 'suspect', source: 'rules'})
  })

  test('jevが成功している限りruleがsalesでも隔離まで到達させずsuspectに丸める', () => {
    const result = combine(rule('sales', BLOCK_SCORE), {
      ok: true,
      probability: 0.1,
    })
    expect(result).toEqual({level: 'suspect', source: 'rules'})
  })

  test('jevがnormal域かつruleもnormalならnormal/jev', () => {
    const result = combine(rule('normal', 0), {
      ok: true,
      probability: 0.1,
    })
    expect(result).toEqual({level: 'normal', source: 'jev'})
  })

  test('jevが失敗しruleがあればruleのlevelがそのまま採用される（salesも許容）', () => {
    const result = combine(rule('sales', BLOCK_SCORE), {
      ok: false,
      failure: 'timeout',
    })
    expect(result).toEqual({level: 'sales', source: 'rules'})
  })

  test('jevが失敗しruleがsuspectならsuspect/rules', () => {
    const result = combine(rule('suspect', SUSPECT_SCORE), {
      ok: false,
      failure: 'no_key',
    })
    expect(result).toEqual({level: 'suspect', source: 'rules'})
  })

  test('jevが失敗しruleもnullならnormal/none', () => {
    const result = combine(null, {ok: false, failure: 'unknown'})
    expect(result).toEqual({level: 'normal', source: 'none'})
  })
})

describe('judge', () => {
  test('evaluateがnullの場合はjevがno_keyで失敗し、evaluateは呼ばれない', async () => {
    const classify = () => rule('normal', 0)
    const result = await judge(content, null, classify)

    expect(result.jev).toEqual({ok: false, failure: 'no_key'})
    expect(result.rule).toEqual(rule('normal', 0))
  })

  test('evaluateにはtitleとmessageのみが渡される（name/emailを含まない）', async () => {
    let received: unknown
    const evaluate = async (arg: {title: string; message: string}) => {
      received = arg
      return 0.1
    }
    const classify = () => rule('normal', 0)

    await judge(content, evaluate, classify)

    expect(received).toEqual({title: content.title, message: content.message})
    expect(received).not.toHaveProperty('name')
    expect(received).not.toHaveProperty('email')
  })

  test('evaluateが成功すればjev.okはtrueでprobabilityが入り、ruleも計算される', async () => {
    const classify = () => rule('suspect', SUSPECT_SCORE)
    const evaluate = async () => 0.3

    const result = await judge(content, evaluate, classify)

    expect(result.jev).toEqual({ok: true, probability: 0.3})
    expect(result.rule).toEqual(rule('suspect', SUSPECT_SCORE))
    expect(result.level).toBe('suspect')
    expect(result.source).toBe('rules')
  })

  test('evaluateがJevError(http,429)で失敗するとfailureはhttp_429になる', async () => {
    const classify = () => rule('normal', 0)
    const evaluate = async () => {
      throw new JevError('http', 429)
    }

    const result = await judge(content, evaluate, classify)

    expect(result.jev).toEqual({ok: false, failure: 'http_429'})
  })

  test('evaluateがJevError(timeout)で失敗するとfailureはtimeoutになる', async () => {
    const classify = () => rule('normal', 0)
    const evaluate = async () => {
      throw new JevError('timeout')
    }

    const result = await judge(content, evaluate, classify)

    expect(result.jev).toEqual({ok: false, failure: 'timeout'})
  })

  test('evaluateがJevError(network)で失敗するとfailureはnetworkになる', async () => {
    const classify = () => rule('normal', 0)
    const evaluate = async () => {
      throw new JevError('network')
    }

    const result = await judge(content, evaluate, classify)

    expect(result.jev).toEqual({ok: false, failure: 'network'})
  })

  test('evaluateがJevError(invalid_response)で失敗するとfailureはinvalid_responseになる', async () => {
    const classify = () => rule('normal', 0)
    const evaluate = async () => {
      throw new JevError('invalid_response')
    }

    const result = await judge(content, evaluate, classify)

    expect(result.jev).toEqual({ok: false, failure: 'invalid_response'})
  })

  test('evaluateがJevError以外の例外で失敗するとfailureはunknownになる', async () => {
    const classify = () => rule('normal', 0)
    const evaluate = async () => {
      throw new Error('何かよくわからない失敗')
    }

    const result = await judge(content, evaluate, classify)

    expect(result.jev).toEqual({ok: false, failure: 'unknown'})
  })

  test('classifyが例外を投げてもjudgeは投げず、ruleはnullになる', async () => {
    const classify = () => {
      throw new Error('rule classifier broken')
    }
    const evaluate = async () => 0.1

    const result = await judge(content, evaluate, classify)

    expect(result.rule).toBeNull()
  })

  test('classifyが投げ、evaluateも失敗した場合はnormal/noneになりjudge自体は例外を投げない', async () => {
    const classify = () => {
      throw new Error('rule classifier broken')
    }
    const evaluate = async () => {
      throw new Error('jev broken')
    }

    const result = await judge(content, evaluate, classify)

    expect(result.level).toBe('normal')
    expect(result.source).toBe('none')
    expect(result.rule).toBeNull()
    expect(result.jev).toEqual({ok: false, failure: 'unknown'})
  })

  test('classifyを省略すると既定でclassifyContactが使われる', async () => {
    const fixture = salesFixtures[0]
    const fixtureContent: ContactContent = {
      name: fixture.name,
      email: fixture.email,
      title: fixture.title,
      message: fixture.message,
    }
    const expectedRule = classifyContact(fixtureContent)

    const evaluate = async () => {
      throw new JevError('timeout')
    }

    const result = await judge(fixtureContent, evaluate)

    expect(result.rule).toEqual(expectedRule)
    expect(result.level).toBe(expectedRule.level)
    expect(result.source).toBe('rules')
  })
})
