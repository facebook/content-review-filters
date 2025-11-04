/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const getFilterStyles = (
  blurred: boolean,
  blurThreshold: number,
  grayscaled: boolean,
  transparency: boolean,
  transparencyLevel: number,
  sepiaFilter: boolean,
): {filter: string; opacity: string} => {
  const thresholdMultiplier = 10;
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
