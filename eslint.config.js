/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import stylex from '@stylexjs/eslint-plugin';
import tseslint from 'typescript-eslint';
import {defineConfig} from 'eslint/config';
import copyrightHeader from './eslint-rules/copyright-header.js';

const rules = [
  // Own TS config fules
  {
    files: ['src/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylexjs': stylex,
      // "typescript-eslint": tseslint,
      custom: {
        rules: {
          'copyright-header': copyrightHeader,
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@stylexjs/valid-styles': 'off',
      '@stylexjs/no-unused': 'error',
      '@stylexjs/valid-shorthands': 'off',
      '@stylexjs/sort-keys': 'warn',
      // "typescript-eslint/ban-ts-comment": "warn",
      'react-refresh/only-export-components': [
        'warn',
        {allowConstantExport: true},
      ],
      'custom/copyright-header': 'error',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      custom: {
        rules: {
          'copyright-header': copyrightHeader,
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        {allowConstantExport: true},
      ],
      'custom/copyright-header': 'error',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    name: 'typescript-eslint/crf',
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  // eslintPluginPrettierRecommended

  {
    ignores: ['dist/**/*', '*.js'],
  },
];

// console.log(rules);

export default defineConfig(rules);
