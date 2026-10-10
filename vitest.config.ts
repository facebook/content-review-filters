/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {defineConfig, mergeConfig} from 'vitest/config';
import viteConfig from './vite.config';

// Reuses the project's react/babel/stylex pipeline so tests compile the
// components exactly like the library build does. jsdom is deliberate: it has
// no OffscreenCanvas and no WebGL, which is the environment that used to break
// on import.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['packages/**/*.test.{ts,tsx}'],
    },
  }),
);
