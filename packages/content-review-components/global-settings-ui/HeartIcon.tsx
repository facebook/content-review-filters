/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  heartIcon: {
    fill: '#666',
    height: '24px',
    transition: 'fill 0.2s ease',
    width: '24px',
    ':hover': {
      fill: '#e91e63',
    },
  },
  heartIconActive: {
    fill: '#e91e63',
  },
});

interface HeartIconProps {
  isActive?: boolean;
}

export function HeartIcon({isActive = false}: HeartIconProps) {
  return (
    <svg
      {...stylex.props(styles.heartIcon, isActive && styles.heartIconActive)}
      viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}
