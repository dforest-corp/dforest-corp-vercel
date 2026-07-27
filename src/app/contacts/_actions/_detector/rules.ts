import {DECORATION_RUN_PATTERN} from '@/app/contacts/_actions/_detector/normalize'
import {
  everyOf,
  hasUrlFromDomain,
  lineStartCountAtLeast,
  not,
  onNormalized,
  someOf,
} from '@/app/contacts/_actions/_detector/predicates'
import {Rule} from '@/app/contacts/_actions/_detector/types'

// ---------------------------------------------------------------------------
// このファイルが判定基準の唯一の置き場。
//
// 重要な制約（invariants.spec.ts で機械的に検証している）:
// - weight の絶対値は MAX_RULE_WEIGHT(4) 以下。どのルールも単独では件名タグを
//   付けられない
// - カテゴリごとの上限があるため、同種の証拠だけを積み上げても隔離に到達しない
//
// 語句マッチは正規化済みテキスト（空白除去・NFKC・小文字化）に対して行うため、
// 文字数窓（[^。]{0,24} 等）は原文より狭く見積もる必要がある。
// ---------------------------------------------------------------------------

/** 日程調整SaaS。正当な問い合わせでは使われない */
const SCHEDULING_DOMAINS = [
  'timerex.net',
  'calendar.app.google',
  'crowd-calendar.com',
  'crowdcalendar.com',
  'spirinc.com',
  'spir.co.jp',
  'youcanbook.me',
  'calendly.com',
  'jicoo.com',
  'eeasy.jp',
  'chouseisan.com',
  'waaq.jp',
  'timerex.jp',
]

/** URL短縮サービス。送信元を隠す用途が中心で、営業メール固有のシグナル */
const SHORTENER_DOMAINS = [
  'x.gd',
  'bit.ly',
  'tinyurl.com',
  'is.gd',
  't.co',
  'lin.ee',
  'cutt.ly',
  'rebrand.ly',
  'onl.bz',
  'urx.cloud',
  'bit.do',
]

const FREEMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.co.jp',
  'yahoo.com',
  'outlook.com',
  'outlook.jp',
  'hotmail.com',
  'hotmail.co.jp',
  'icloud.com',
  'me.com',
  'live.jp',
  'aol.com',
  'proton.me',
]

/** 個人ではなく部門・機能に割り当てられたアドレス */
const ROLE_LOCAL_PARTS = [
  'sales',
  'contact',
  'info',
  'information',
  'marketing',
  'support',
  'office',
  'inquiry',
  'news',
  'noreply',
  'no-reply',
  'mail',
  'admin',
]

/**
 * 一斉送信の指紋。機械的に大量送信していることの痕跡で、
 * 正当な問い合わせにはまず現れない。
 */
const bulkRules: readonly Rule[] = [
  {
    id: 'scheduling_link',
    category: 'bulk',
    weight: 4,
    description: '日程調整SaaSの予約URLが貼られている',
    test: hasUrlFromDomain(SCHEDULING_DOMAINS),
  },
  {
    id: 'noreply_sender',
    category: 'bulk',
    weight: 4,
    description:
      '入力されたメールアドレスが no-reply。返信を受け取らない相手が' +
      '問い合わせフォームを使うのは自己矛盾',
    test: (input) => /no-?reply/.test(input.emailLocalPart),
  },
  {
    id: 'url_shortener',
    category: 'bulk',
    weight: 3,
    description: 'URL短縮サービスのリンクが貼られている',
    test: hasUrlFromDomain(SHORTENER_DOMAINS),
  },
  {
    id: 'decoration_rule_line',
    category: 'bulk',
    weight: 3,
    description: '装飾記号が5個以上連続する罫線がある',
    test: (input) => DECORATION_RUN_PATTERN.test(input.messageWithoutUrls),
  },
  {
    id: 'decoration_density',
    category: 'bulk',
    weight: 2,
    description: 'URLを除いた本文の装飾記号が25個以上',
    test: (input) => input.decorationCount >= 25,
  },
  {
    id: 'bullet_headings',
    category: 'bulk',
    weight: 2,
    description: '行頭が箇条書き見出し記号の行が3行以上',
    test: lineStartCountAtLeast(/^[■□▼▽▲△★☆◆◇●◎✓☑✔▶▷]/, 3),
  },
  {
    id: 'url_list',
    category: 'bulk',
    weight: 2,
    description: '本文中のURLが3本以上（実績リンク集・資料DL・予約の並列）',
    test: (input) => input.urls.length >= 3,
  },
  {
    id: 'tracking_params',
    category: 'bulk',
    weight: 2,
    description: 'URLに配信計測パラメータ（utm_*）が付いている',
    test: (input) =>
      input.urls.some((url) => /utm_(source|medium|campaign)=/i.test(url)),
  },
]

/**
 * 営業メールの定型文。1つ2つでは正当な問い合わせでも起こりうるので、
 * カテゴリ上限を BLOCK_SCORE より十分低く抑えている。
 */
const templateRules: readonly Rule[] = [
  {
    id: 'not_sales_disclaimer',
    category: 'template',
    weight: 3,
    description: '「営業ではない」「完全無料」と自ら断る（逆説的シグナル）',
    test: onNormalized(
      /(営業|勧誘|売り込み)では(なく|ありません|ございません)|完全無料|本当に無料|費用は一切かかりません|一切費用はかかりません/,
    ),
  },
  {
    id: 'abrupt_greeting',
    category: 'template',
    weight: 2,
    description: '面識のない相手への定型的な前置き',
    test: onNormalized(
      /突然の(ご連絡|ご案内|ご提案|メール)|度重なる(ご連絡|ご案内)|突然で(恐縮|失礼)|初めてご連絡|突然のメール/,
    ),
  },
  {
    id: 'viewed_your_site',
    category: 'template',
    weight: 2,
    description: '「貴社のサイトを拝見し」型の入り',
    test: onNormalized(/(貴社|御社)の[^。]{0,24}(拝見|見させて)/),
  },
  {
    id: 'meeting_slot',
    category: 'template',
    weight: 2,
    description: '面談時間の明示とオンライン打診の共起',
    test: everyOf(
      onNormalized(/(10|15|20|30|40|45|60)分/),
      onNormalized(
        /オンライン|web会議|zoom|googlemeet|google\s?meet|teams|お打ち?合わ?せ|ご面談/,
      ),
    ),
  },
  {
    id: 'appointment_request',
    category: 'template',
    weight: 2,
    description: '打ち合わせ・訪問・挨拶の時間や機会を求める定型文',
    test: onNormalized(
      /(お打ち?合わ?せ|ご面談|ご訪問|訪問の|ご挨拶|お時間を)[^。]{0,20}(お時間|機会)[^。]{0,16}(いただけ|頂け|頂戴|賜れ|ください)/,
    ),
  },
  {
    id: 'no_pressure',
    category: 'template',
    weight: 2,
    description: '断りやすさを強調してハードルを下げる定型文',
    test: onNormalized(
      /急なご決断|読み流し|一度話だけ|話だけ聞いて|ご不要でした|不要でしたら|程度で構いません|のみのご返信/,
    ),
  },
  {
    id: 'hyperbole',
    category: 'template',
    weight: 2,
    description: '誇張・過剰約束',
    test: onNormalized(
      /日本トップクラス|業界最安|業界最速|業界no\.?1|必ず[^。]{0,20}お約束|圧倒的|安価かつ高品質|工数が半減|最大\d+[%％]削減|\d+倍を?達成|売上\d+倍/,
    ),
  },
  {
    id: 'info_exchange',
    category: 'template',
    weight: 2,
    description:
      '「情報交換」。用件を明示せずに接点を作る営業の定型句。' +
      'ただし発注検討側も使うため単独では閾値に届かない重みにしている',
    test: onNormalized(/情報交換/),
  },
  {
    id: 'generic_addressee',
    category: 'template',
    weight: 1,
    description: '個人ではなく役割宛の宛名',
    test: onNormalized(
      /ご担当者(様|さま|各位)|(開発|採用|人事|技術|営業|広報)責任者様|各社様|代表者様|ご担当の方/,
    ),
  },
  {
    id: 'if_interested_cta',
    category: 'template',
    weight: 1,
    description: '「ご興味がございましたら」型の CTA',
    test: onNormalized(
      /ご(興味|関心)[^。]{0,14}(ござい|御座い|いただけ|お持ち|あれ|あり|お寄せ)/,
    ),
  },
]

/**
 * 送り手が自分を売り込んでいることの痕跡。
 * 発注側は自分の規模や実績を並べないので、正当な問い合わせとの分離が効く。
 */
const pitchRules: readonly Rule[] = [
  {
    id: 'self_spec_numbers',
    category: 'pitch',
    weight: 3,
    description: '在籍人数・実績件数といった自社スペックの数値を並べる',
    test: someOf(
      onNormalized(
        /\d[\d,]*名(ほど|程|程度|前後)?[^。]{0,14}(在籍|稼働|抱え|所属|技術者|エンジニア|社員|クリエーター|クリエイター|要員)/,
      ),
      onNormalized(
        /(社員数|従業員数|技術者数|プロパー)[はもが]?[^。]{0,8}\d+名/,
      ),
      onNormalized(/\d[\d,]*(名|社|件|本|アカウント|拠点)以上/),
    ),
  },
  {
    id: 'formal_addressee_name',
    category: 'pitch',
    weight: 3,
    description: '代表者のフルネームを宛名にする。M&A・資本提携勧誘の指紋',
    test: onNormalized(/代表取締役[^。]{0,10}(様|さま)/),
  },
  {
    id: 'supply_side_offer',
    category: 'pitch',
    weight: 3,
    description: 'リソースの供給側として協業先・発注元を募る申し出',
    test: everyOf(
      onNormalized(
        /人材|技術者|エンジニア|下請け|常駐|リソース|パートナー|代行|支援|協業|提携|クリエイター/,
      ),
      onNormalized(
        /(企業|会社|協業先|パートナー|協力先)様?[をも](募集|常時募集|探して)|使っていただける|ご協業(いただ|させて|頂け|につき|の(ご依頼|お願い))|お力添え|お力になれれば|協業パートナー|協力企業として|協業できれば|協業をさせて|協業を検討|ご協力いただける|業務提携の(ご相談|お願い)|提携についてのお(伺い|願い)|ご支援させて(頂き|いただき)/,
      ),
    ),
  },
  {
    id: 'logo_dropping',
    category: 'pitch',
    weight: 2,
    description: '取引先や上場区分を並べて権威付けする',
    test: someOf(
      onNormalized(
        /証券コード|東証(グロース|プライム|スタンダード)|ナショナルクライアント|上場企業経営者/,
      ),
      (input) =>
        (input.normalizedText.match(/様[・\/／、]/g)?.length ?? 0) >= 2,
    ),
  },
  {
    id: 'self_intro_pitch',
    category: 'pitch',
    weight: 2,
    description: '「弊社は〜を行っております」型の自己紹介',
    test: onNormalized(
      /(弊社|当社|私たち)(は|も|では)[^。]{0,60}(行っており|行なっており|展開して|提供して|ご提供して|手がけて|特化した|専門|扱っており|事業を展開|会社です|会社でございます|会社になります|会社となります|企業です|企業でございます|チームです|事業所となります)/,
    ),
  },
  {
    id: 'your_clients',
    category: 'pitch',
    weight: 2,
    description:
      '受け手の顧客を話題にする。下請け・代行営業の指紋（発注側は使わない）',
    test: onNormalized(/(貴社|御社)の(クライアント|お客様|顧客|エンド)/),
  },
  {
    id: 'service_menu',
    category: 'pitch',
    weight: 1,
    description: '販促資料的な見出し（サービス概要・導入メリットなど）',
    test: onNormalized(
      /(サービス|支援)(一覧|概要)|導入(いただく)?メリット|(当社|弊社)の(特徴|特長|強み)|注目ポイント|対応業務】|開発人材例/,
    ),
  },
]

/**
 * メタ情報。単独ではほぼ無力にしてある（カテゴリ上限3）。
 * 正当な問い合わせでも起こりうるものばかりなので、他の証拠の補強にしか使わない。
 */
const metaRules: readonly Rule[] = [
  {
    id: 'empty_title',
    category: 'meta',
    weight: 1,
    description: 'タイトル欄が空',
    test: (input) => input.title.trim().length === 0,
  },
  {
    id: 'bracket_title',
    category: 'meta',
    weight: 1,
    description: 'タイトルに【】による強調がある',
    test: (input) => /[【】]/.test(input.title),
  },
  {
    id: 'freemail',
    category: 'meta',
    weight: 1,
    description: 'フリーメールアドレスから送信されている',
    test: (input) => FREEMAIL_DOMAINS.includes(input.emailDomain),
  },
  {
    id: 'role_address',
    category: 'meta',
    weight: 1,
    description: '個人ではなく部門・機能のアドレスから送信されている',
    test: (input) =>
      ROLE_LOCAL_PARTS.some(
        (role) =>
          input.emailLocalPart === role ||
          input.emailLocalPart.startsWith(`${role}.`) ||
          input.emailLocalPart.startsWith(`${role}-`) ||
          input.emailLocalPart.startsWith(`${role}_`),
      ),
  },
  {
    id: 'long_body',
    category: 'meta',
    weight: 1,
    description: '本文が1200文字以上',
    test: (input) => input.messageLength >= 1200,
  },
]

/**
 * 正当な問い合わせのシグナル。減点のみ。
 *
 * ここに入れる語は「営業メールには絶対に出てこない」ことを実データで確認した
 * ものだけにする。実測で営業メールに誤爆した語（納品・請求書・要件定義・仕様・
 * 納期の単独出現、以前、探しております）は意図的に除外している。
 */
const legitSignalRules: readonly Rule[] = [
  {
    id: 'asks_us_to_do',
    category: 'legit',
    weight: -6,
    description:
      '受け手を主語にして仕事を依頼する（発注側の言い回し）。' +
      '主語アンカーを置いているので「弊社から発注したい」型の営業には一致しない。' +
      '「できないか」等の汎用の依頼形は、対象が制作・開発であることを要求している' +
      '（「貴社にご協賛いただけないか」のような勧誘を発注と誤認しないため）',
    test: someOf(
      onNormalized(
        /(御社|貴社)(にて|に|で|へ)[^。]{0,24}(発注|ご依頼|依頼させて|お願いでき|ご相談|制作いただ|開発いただ|作っていただ|構築いただ)/,
      ),
      onNormalized(
        /(御社|貴社)(にて|に|で|へ)[^。]{0,20}(製作|制作|開発|構築|対応|受け入れ|お願い|実装)[^。]{0,8}(できないか|出来ないか|可能でしょうか|いただけ)/,
      ),
    ),
  },
  {
    id: 'job_application',
    category: 'legit',
    weight: -5,
    description: '採用への応募・インターン希望',
    test: onNormalized(
      /応募(を|し|さ|希望|いた)|職務経歴書|履歴書|インターンシップ|中途採用で|求人情報を拝見/,
    ),
  },
  {
    id: 'admits_lack',
    category: 'legit',
    weight: -4,
    description:
      '自社の能力・リソース不足を告白する。売り込む側は絶対に書かない',
    test: someOf(
      onNormalized(
        /(弊社|当社|自社|社内|当方|当院)[^。]{0,16}(できず|出来ず|ノウハウが(なく|ありません)|知見がなく|対応できず|手が回ら|リソースが足りな|詳しい人間がおらず|人間がおりません|わかる者がおらず)/,
      ),
      onNormalized(/恥ずかしながら/),
    ),
  },
  {
    id: 'existing_contact',
    category: 'legit',
    weight: -4,
    description:
      '既にやり取りがある相手からの連絡。' +
      '「納品」「請求書」の単独出現は営業メールでも起こるので前置きを必須にしている',
    test: someOf(
      onNormalized(
        /(先日|昨日|昨年|前回|過日|本日)[^。]{0,14}(ご対応|納品|お電話|お打ち合わせ|ご訪問|ありがとう|いただいた|導入いただ)/,
      ),
      onNormalized(/お電話で(お伝えした|伺った|お話しした)/),
      onNormalized(/ご連絡いただき(誠に)?ありがとう/),
      onNormalized(/保守契約/),
    ),
  },
  {
    id: 'procurement',
    category: 'legit',
    weight: -3,
    description: '見積・予算・調達手続きの具体的な言及',
    test: onNormalized(
      /[おご]見積|概算(費用|見積|金額|の)|予算[はをもが][^。]{0,16}(確保|想定|考えて|決まって|程度|あまり|ござい)|rfp|提案依頼書|参加表明|いくらぐらい|費用感/,
    ),
  },
  {
    id: 'own_problem',
    category: 'legit',
    weight: -3,
    description:
      '自社の課題や検討状況を語る。' +
      '「貴社のクライアントの課題」を語る下請け営業は後段の否定条件で除外する',
    test: everyOf(
      onNormalized(
        /(弊社|当社|自社|社内|当方|我々|現在|今回)[^。]{0,40}(を検討して|導入を検討|課題[とに]なって|課題です|困って|運用しており|管理しており|事象が発生|刷新したい|作りたい)/,
      ),
      not(onNormalized(/(貴社|御社)の(クライアント|お客様|顧客|エンド)/)),
    ),
  },
]

/** @package 加点ルール */
export const salesRules: readonly Rule[] = [
  ...bulkRules,
  ...templateRules,
  ...pitchRules,
  ...metaRules,
]

/** @package 減点ルール */
export {legitSignalRules}

/** @package 判定に使うルールの全体 */
export const allRules: readonly Rule[] = [...salesRules, ...legitSignalRules]
