/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import {resolve} from 'path';
import {defineConfig} from 'vite';
import babel from 'vite-plugin-babel';
import dts from 'vite-plugin-dts';
// @ts-expect-error since we have not onboard stylex ts types yet
import stylex from '@stylexjs/postcss-plugin';

const babelConfig = {
  presets: ['@babel/preset-typescript'],
  plugins: [
    [
      '@stylexjs/babel-plugin',
      {
        dev: process.env.NODE_ENV === 'development',
        test: process.env.NODE_ENV === 'test',
        runtimeInjection: false,
        genConditionalClasses: true,
        treeshakeCompensation: true,
        unstable_moduleResolution: {
          type: 'commonJS',
        },
      },
    ],
  ],
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['packages/content-review-components'],
      tsconfigPath: './tsconfig.app.json',
      rollupTypes: true,
    }),
    babel({
      babelConfig,
      filter: /\.[jt]sx?$/u,
      loader: 'jsx',
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(
        __dirname,
        'packages/content-review-components/ContentReviewComponents.ts',
      ),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: {
        entryFileNames: 'main.js',
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        stylex({
          babelConfig,
          include: [
            'packages/content-review-components/**/*.{ts,tsx}',
            'src/**/*.{ts,tsx}',
          ],
          useCSSLayers: true,
        }),
        autoprefixer(),
      ],
    },
  },
});
