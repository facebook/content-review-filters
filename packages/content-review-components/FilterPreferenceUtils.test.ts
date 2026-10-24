/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, test} from 'vitest';

import {
  DEFAULT_MAX_BLUR_PX,
  getFilterStyles,
  resolveMaxBlurPx,
} from './FilterPreferenceUtils';

const getBlur = (styles: {filter: string}): string =>
  styles.filter.trim().split(' ')[0];

describe('blur preference mapped to pixels', () => {
  test('uses a 10px maximum when nothing is configured', () => {
    expect(DEFAULT_MAX_BLUR_PX).toBe(10);
    expect(getBlur(getFilterStyles(true, 1, false, false, 0, false))).toBe(
      'blur(10px)',
    );
  });

  test('uses the configured maximum', () => {
    expect(getBlur(getFilterStyles(true, 1, false, false, 0, false, 40))).toBe(
      'blur(40px)',
    );
  });

  test('is a fraction of the maximum inside the range', () => {
    expect(
      getBlur(getFilterStyles(true, 0.25, false, false, 0, false, 40)),
    ).toBe('blur(10px)');
    expect(getBlur(getFilterStyles(true, 0.5, false, false, 0, false))).toBe(
      'blur(5px)',
    );
  });

  test('applies no blur when the preference is off', () => {
    const styles = getFilterStyles(false, 0, false, false, 0, false, 40);
    expect(styles.filter).not.toContain('blur(');
  });

  test('falls back to the default when the maximum cannot be used', () => {
    [0, -40, Number.NaN, Number.POSITIVE_INFINITY].forEach(maxBlurPx => {
      expect(
        getBlur(getFilterStyles(true, 1, false, false, 0, false, maxBlurPx)),
      ).toBe('blur(10px)');
    });
  });

  test('resolveMaxBlurPx keeps usable values and rejects the rest', () => {
    expect(resolveMaxBlurPx(40)).toBe(40);
    expect(resolveMaxBlurPx(0.5)).toBe(0.5);
    expect(resolveMaxBlurPx(undefined)).toBe(DEFAULT_MAX_BLUR_PX);
    expect(resolveMaxBlurPx(0)).toBe(DEFAULT_MAX_BLUR_PX);
    expect(resolveMaxBlurPx(-1)).toBe(DEFAULT_MAX_BLUR_PX);
    expect(resolveMaxBlurPx(Number.NaN)).toBe(DEFAULT_MAX_BLUR_PX);
    expect(resolveMaxBlurPx(undefined, 40)).toBe(40);
  });

  test('keeps the other filters unchanged', () => {
    const styles = getFilterStyles(true, 1, true, true, 0.25, true, 20);
    expect(styles.filter).toContain('blur(20px)');
    expect(styles.filter).toContain('grayscale(100%)');
    expect(styles.filter).toContain('sepia(100%)');
    expect(styles.opacity).toBe('0.75');
  });
});
