# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

D-FOREST コーポレートサイト（https://d-forest-corp.com/）。Next.js 16 App Router + React 19 で構築し、Vercel に ISR でデプロイ。コンテンツは microCMS から取得する日本語サイト。

## コマンド

パッケージ管理・テスト実行は **Bun**（`bun.lockb`）、Node ランタイムは Volta 管理の Node 24。

```bash
bun install              # 依存インストール
bun run dev              # 開発サーバー（Turbopack。mailpit 用に NODE_EXTRA_CA_CERTS=./certs/cert.pem を設定済み）
bun run build            # プロダクションビルド
bun run lint             # ESLint（eslint .）
bun test                 # 全テスト（bun:test）
bun test src/utils/formatDateTime.spec.ts   # 単一テストファイル
```

- テストは `*.spec.ts` 命名でソース隣接配置。`bun:test` を直接使用し、jest/vitest の設定ファイルは無い。
- `bun test` は NODE_ENV=test では `.env.local` を読み込まない。環境変数が必要なテストを書く場合は `--env-file=.env.local` を指定する。
- お問い合わせフォームのローカル検証は `docker compose up` で mailpit を起動（SMTP 1025 / Web UI 8025、TLS 必須）。自己署名証明書の生成手順は README 末尾。

## アーキテクチャ

### データフロー（microCMS + ISR）

- `src/dataSource/cmsClient.ts` — microCMS への fetch ラッパー（`cmsClient<T>()` + `APIError`）。`MICROCMS_ENDPOINT` と `X-MICROCMS-API-KEY` を使用。
- `src/api/*.ts` — エンドポイント別 API ラッパー。`XxxAPI` オブジェクトに `fetchList` / `fetch` / `fetchIdPaths` をまとめる規約（例: `newsList.ts`, `newsDetail.ts`, `post.ts`）。Server Component から直接 await する。
- `src/app/api/revalidate/route.ts` — microCMS Webhook を受ける ISR 再検証エンドポイント（Edge runtime）。`MICROCMS_SECRET` による HMAC-SHA256 署名検証（Web Crypto）後、投稿 ID に応じて `revalidatePath()` を呼ぶ。
- `src/types/cmsType.ts` — CMS 型定義（`microcms-typescript` で生成）。microCMS の API スキーマ JSON はルートの `schema/` にある。

### ルーティング規約（App Router）

各ルートディレクトリ（`src/app/contacts/` など）内にアンダースコア接頭辞の private フォルダを置く:
- `_components/` — そのルート専用コンポーネント
- `_actions/` — Server Actions
- `_schema/` — valibot フォームスキーマ

全体共通コンポーネントは `src/components/`。`ForEach.tsx` / `MayBe.tsx` という宣言的レンダリング補助コンポーネントを使う独自スタイルがある。

### お問い合わせフォーム

`src/app/contacts/` に集約。react-hook-form + valibot（`_schema/formSchema.ts`）→ Server Action `_actions/sendEmail.ts` で reCAPTCHA 検証 → 営業メール判定 → nodemailer で送信（`MAIL_HOST/PORT/USERNAME/PASSWORD`、`secure: true`）。

### 営業メール判定（ルールベースのスコアリング）

`src/app/contacts/_actions/_detector/` に隔離。`sendEmail.ts` からのみ `index.ts` 経由で使う。

- **判定基準は `rules.ts` の1ファイルに集約**。`{id, category, weight, test}` のデータ配列で、加点・減点をここだけで管理する。
- **クライアントバンドルには一切載せない**。判定基準が読めると営業側が回避文面を作れるため、`index.ts` の `import 'server-only'` でビルド時に保証し、内部モジュールは `@package` で `_detector/` 外から import 不可にしている。
- 振り分けは3段階（閾値は `thresholds.ts`）。`score >= BLOCK_SCORE` → `MAIL_TO_QUARANTINE` へ転送し件名に `[営業]`、`>= SUSPECT_SCORE` → 通常宛先で件名に `[営業?]`、それ未満 → 変更なし。**ブロックは削除ではなく隔離**なので、誤判定でも問い合わせは失われない。
- **カテゴリ上限（`CATEGORY_CAPS`）が設計の中核**。単体重みが `SUSPECT_SCORE` 未満、加点カテゴリの上限が `BLOCK_SCORE` 未満なので、単一ルール・単一カテゴリでは隔離に到達できない。この不変条件は `invariants.spec.ts` が機械的に検証しており、単純NGワード方式への退行を構造的に防いでいる。
- 判定は同期・純関数で、`sendEmail.ts` 側で `try/catch` してフェイルオープンにしている（判定の不具合で問い合わせを失わせない）。
- ログは `[contact] level=... score=... rules=...` の1行だけ。**問い合わせ内容・氏名・メールアドレス・タイトルは出さない**。
- 閾値をチューニングするときは `DETECTOR_REPORT=1 bun test src/app/contacts/_actions/_detector/classify.spec.ts` で全フィクスチャのスコア表と閾値ごとの成績が出る。
- 元データの `sample_emails/`（実メール50通）は第三者の個人情報を含むため **gitignore 済み**。`fixtures/` にあるのは氏名・社名・メール・電話・住所・URL を差し替えた匿名化版で、定型句・装飾記号・改行・URLの本数と種別は原文のまま保持している（匿名化前後でスコアとヒットルールが一致することを確認済み）。

### 環境変数

- `.env`（コミット対象、非機密）: `MICROCMS_ENDPOINT`, `MAIL_FROM`, `MAIL_TO`, `MAIL_TO_QUARANTINE`, 各投稿 ID など
- `.env.local`（gitignore 対象、機密）: `MICROCMS_API_KEY`, `MICROCMS_SECRET`, `MAIL_*` 認証情報, `RECAPTCHA_SECRET_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` など

`.env.example` は無い。

## コードスタイル

- Prettier: **セミコロンなし・シングルクォート・`bracketSpacing: false`**（`{foo}` 形式）・printWidth 80。`prettier-plugin-tailwindcss` でクラス自動ソート。
- パスエイリアス: `@/*` → `src/*`（baseUrl は `./src`）。
- `eslint-plugin-import-access` を有効化しており、JSDoc の `@package` アノテーションでモジュール境界（import 可視性）を強制する。
- Tailwind CSS v4 の CSS-first 設定。`tailwind.config.js` は無く、テーマ・プラグイン・カスタムアニメーションはすべて `src/styles/globals.css` の `@theme` / `@plugin` で定義（カスタム色 `--color-dforest-green` など）。クラス結合は `src/utils/clsx.ts`（tailwind-merge ラッパー）を使う。

## 注意点

- README には Pages Router 前提の古い記述（`pages/index.tsx` 等）が残っているが、実際は App Router。README で信頼できるのは microCMS API キー設定と mailpit 証明書生成手順。
