import coreWebVitals from 'eslint-config-next/core-web-vitals'
import prettierConfig from 'eslint-config-prettier/flat'
import importAccess from 'eslint-plugin-import-access/flat-config'
import * as espree from 'espree'
import pkg from './package.json' with {type: 'json'}

// eslint-plugin-react の convertConfVerToSemver は各セグメントを Number() に
// 通すため "^19.2.8" を渡すと NaN になる。先頭の記号だけ落として渡す。
const reactVersion = pkg.dependencies.react.replace(/^[^0-9]*/, '')

const config = [
  {
    name: 'dforest/ignores',
    ignores: [
      // eslint-config-next 由来のものをあえて再掲。config-next を差し替え・
      // 削除しても無視設定が消えないようにするため。
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      // このリポジトリ固有。現時点では JS/TS を含まないので実質 no-op だが、
      // 将来ここにスクリプトが置かれたとき勝手に lint 対象へ入るのを防ぐ。
      'coverage/**',
      'public/**',
      'schema/**',
      'certs/**',
      'sample_emails/**',
    ],
  },
  ...coreWebVitals,
  {
    // WORKAROUND(2026-07 / eslint-config-next 16.2.12 + eslint-plugin-react 7.37.x):
    // eslint-config-next は settings.react.version = 'detect' を設定するが、
    // detect 経路（version.js の resolveBasedir）は ESLint 10 で削除された
    // context.getFilename() を呼ぶため、v10 では
    //   TypeError: contextOrFilename.getFilename is not a function
    // になる。version を明示すると detectReactVersion 自体が呼ばれず回避できる。
    //   - eslint-plugin-react の未解決 issue: jsx-eslint/eslint-plugin-react#3977
    //   - Next.js 側の追跡 issue: vercel/next.js#89764
    // 解除条件: eslint-plugin-react が peerDependencies に eslint ^10 を宣言し、
    //   eslint-config-next がそれを取り込んだら、この WORKAROUND コメントだけ
    //   削除する（settings 自体は決定性・速度の面で残す価値があるので残す）。
    name: 'dforest/react-version',
    settings: {react: {version: reactVersion}},
  },
  {
    // WORKAROUND(2026-07 / eslint-config-next 16.2.12):
    // eslint-config-next は js/mjs/cjs に next/dist/compiled/babel/eslint-parser
    // を割り当てるが、この parser が返す ScopeManager は古い eslint-scope 由来で
    // addGlobals() を持たない。ESLint 10 の SourceCode#finalize がこれを無条件に
    // 呼ぶため TypeError: scopeManager.addGlobals is not a function になる。
    // 対象は eslint.config.mjs / next.config.js / postcss.config.js の3つだけで
    // next/babel プリセットを必要とするコードは無いため、ESLint 既定の espree に
    // 戻す。ts/tsx は config-next の next/typescript ブロックが
    // @typescript-eslint/parser を当てるのでここでは触らない。
    // 解除条件: eslint-config-next が eslint-scope 9 以降を同梱した parser に
    //   更新されたら、このブロックごと削除する。
    name: 'dforest/js-parser',
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {parser: espree},
  },
  prettierConfig,
  {
    name: 'dforest/import-access',
    files: ['**/*.{ts,tsx}'],
    plugins: {'import-access': importAccess},
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'import-access/jsdoc': ['error'],
    },
  },
]

export default config
