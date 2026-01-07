// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  [
    globalIgnores(['dist']),
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        js.configs.recommended,
        tseslint.configs.recommended,
        prettierConfig,
        reactHooks.configs['recommended-latest'],
        reactRefresh.configs.vite,
      ],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
      },
      plugins: {
        // 'react-refresh': reactRefresh,
        // 'react-hooks': reactHooks,
        prettier: prettierPlugin,
        // import: importPlugin,
        // 'unused-imports': unusedImports,
        // 'jsx-a11y': jsxA11y,
        // sonarjs: sonarjs,
        // promise: promise,
        // node: node,
        // unicorn: unicorn,
        // perfectionist: perfectionist,
      },
      rules: {
        // 'perfectionist/sort-imports': ['error', { tsconfigRootDir: '.' }],
        ...reactHooks.configs['recommended-latest'].rules,
        'prettier/prettier': 'error',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        // 'unicorn/filename-case': [
        //   'error',
        //   {
        //     cases: {
        //       kebabCase: true,
        //       pascalCase: true,
        //       camelCase: true,
        //     },
        //     ignore: ['README.md', 'vite-env.d.ts'],
        //   },
        // ],
      },
    },
  ],
  storybook.configs['flat/recommended']
)
