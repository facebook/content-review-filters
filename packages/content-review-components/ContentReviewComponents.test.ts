/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, test, vi} from 'vitest';

/**
 * jsdom has no OffscreenCanvas and no WebGL context, which is exactly the
 * environment where importing this package used to throw: the reduced detail
 * filter was created at module level. Importing the public entry must stay
 * free of that.
 */
describe('package entry point', () => {
  test('imports without creating a graphics context', async () => {
    expect(typeof OffscreenCanvas).toBe('undefined');

    const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext');

    const entry = await import('./ContentReviewComponents');

    expect(getContext).not.toHaveBeenCalled();
    expect(entry.ContentFilteredImageWrapper).toBeTypeOf('function');
    expect(entry.ContentReviewFilterGlobalPreferencesProvider).toBeTypeOf(
      'function',
    );

    getContext.mockRestore();
  });

  test('importing the reduced detail module does not create the filter', async () => {
    const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext');

    const {getReducedDetailFilter} =
      await import('./ReducedDetailFilterSingleton');

    expect(getContext).not.toHaveBeenCalled();

    // Asking for it is what tries to create it - and in jsdom it cannot be
    // created, so callers get null instead of an exception.
    expect(getReducedDetailFilter()).toBeNull();

    getContext.mockRestore();
  });
});
