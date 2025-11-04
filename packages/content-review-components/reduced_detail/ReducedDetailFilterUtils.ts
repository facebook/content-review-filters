/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const intensityToEdgeEnhancementMap: {[key: number]: number} = {
  0: 0,
  5: 3,
  10: 2,
  15: 1,
  20: 2,
  25: 1,
  30: 2,
  35: 1,
  40: 4,
  45: 3,
  50: 5,
  55: 4,
  60: 6,
  65: 5,
  70: 6,
  75: 5,
  80: 6,
  85: 5,
  90: 6,
  95: 5,
  100: 4,
};

/**
 * Map a discrete between 1 and 10 to an edge enhancement value.
 * LoA will just be the intensity directly.
 */
const getEdgeEnhancementFromIntensity = (intensity: number): number => {
  return intensityToEdgeEnhancementMap[intensity];
};

const roundTo1DecimalPlace = (n: number): number => {
  return Math.round(n * 10) / 10;
};

/**
 * intensity is a number between 0.05 and 1 at 0.05 increments.
 */
export const getShaderParamsFromIntensity = (
  intensity: number,
): {levelOfAbstraction: number; edgeEnhancement: number} => {
  const intensityAsPercent = Math.round(intensity * 100);
  return {
    levelOfAbstraction: Math.min(roundTo1DecimalPlace(intensity), 0.9) * 10,
    edgeEnhancement: getEdgeEnhancementFromIntensity(intensityAsPercent),
  };
};
