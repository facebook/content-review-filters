/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Blur applied at the maximum blur preference when nothing is configured. */
export const DEFAULT_MAX_BLUR_PX = 10;

/**
 * Resolves a configured maximum blur, falling back when the value cannot
 * produce a usable blur (not a finite number, zero or negative).
 */
export const resolveMaxBlurPx = (
  maxBlurPx: number | undefined,
  fallback: number = DEFAULT_MAX_BLUR_PX,
): number => {
  if (
    typeof maxBlurPx !== 'number' ||
    !Number.isFinite(maxBlurPx) ||
    maxBlurPx <= 0
  ) {
    return fallback;
  }
  return maxBlurPx;
};

export const getFilterStyles = (
  blurred: boolean,
  blurThreshold: number,
  grayscaled: boolean,
  transparency: boolean,
  transparencyLevel: number,
  sepiaFilter: boolean,
  maxBlurPx: number = DEFAULT_MAX_BLUR_PX,
): {filter: string; opacity: string} => {
  // The blur preference is normalized: it is a fraction of the configured
  // maximum, so an app with a larger scale raises the maximum instead of
  // pushing the preference out of range.
  const thresholdMultiplier = resolveMaxBlurPx(maxBlurPx);
  const grayscaleCSS = grayscaled ? 'grayscale(100%)' : '';
  const blurThresholdCSS = blurred
    ? blurThreshold !== 0
      ? 'blur(' + (blurThreshold * thresholdMultiplier).toString() + 'px)'
      : 'blur(' + (0.5 * thresholdMultiplier).toString() + 'px)'
    : '';
  const opacityLevelCSS =
    transparency === true ? (1 - transparencyLevel).toString() : '';
  const sepiaCSS = (sepiaFilter ?? false) ? 'sepia(100%)' : '';
  return {
    filter: blurThresholdCSS + ' ' + grayscaleCSS + ' ' + sepiaCSS + ' ',
    opacity: opacityLevelCSS,
  };
};
