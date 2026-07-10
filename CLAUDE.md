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
bun test src/utils/checkSalesMail.spec.ts   # 単一テストファイル
```

- テストは `*.spec.ts` 命名でソース隣接配置。`bun:test` を直接使用し、jest/vitest の設定ファイルは無い。
- `checkSalesMail.spec.ts` は Anthropic API を実際に叩く統合テスト（`ANTHROPIC_API_KEY` が必要）。
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

`src/app/contacts/` に集約。react-hook-form + valibot（`_schema/formSchema.ts`）→ Server Action `_actions/sendEmail.ts` で reCAPTCHA 検証 → nodemailer で送信（`MAIL_HOST/PORT/USERNAME/PASSWORD`、`secure: true`）。`src/utils/checkSalesMail.ts` に Anthropic API による営業メール判定があるが、現在 `sendEmail.ts` では呼び出しがコメントアウトされている。

### 環境変数

- `.env`（コミット対象、非機密）: `MICROCMS_ENDPOINT`, `MAIL_FROM`, `MAIL_TO`, 各投稿 ID など
- `.env.local`（gitignore 対象、機密）: `MICROCMS_API_KEY`, `MICROCMS_SECRET`, `MAIL_*` 認証情報, `RECAPTCHA_SECRET_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `ANTHROPIC_API_KEY` など

`.env.example` は無い。

## コードスタイル

- Prettier: **セミコロンなし・シングルクォート・`bracketSpacing: false`**（`{foo}` 形式）・printWidth 80。`prettier-plugin-tailwindcss` でクラス自動ソート。
- パスエイリアス: `@/*` → `src/*`（baseUrl は `./src`）。
- `eslint-plugin-import-access` を有効化しており、JSDoc の `@package` アノテーションでモジュール境界（import 可視性）を強制する。
- Tailwind CSS v4 の CSS-first 設定。`tailwind.config.js` は無く、テーマ・プラグイン・カスタムアニメーションはすべて `src/styles/globals.css` の `@theme` / `@plugin` で定義（カスタム色 `--color-dforest-green` など）。クラス結合は `src/utils/clsx.ts`（tailwind-merge ラッパー）を使う。

## 注意点

- README には Pages Router 前提の古い記述（`pages/index.tsx` 等）が残っているが、実際は App Router。README で信頼できるのは microCMS API キー設定と mailpit 証明書生成手順。
