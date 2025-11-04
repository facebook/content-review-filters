/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {IconProps} from './GrayscaleIcon';

export default function SepiaIcon({
  className,
  style,
  'aria-hidden': ariaHidden = true,
}: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      aria-hidden={ariaHidden}>
      <path
        d="M19.3397 35C24.6987 31.906 31.3012 31.906 36.6602 35C42.0192 38.094 45.3205 43.812 45.3205 50C45.3205 56.188 42.0192 61.906 36.6602 65C31.3012 68.094 24.6987 68.094 19.3397 65C13.9807 61.906 10.6794 56.188 10.6794 50C10.6794 43.812 13.9807 38.094 19.3397 35Z"
        stroke="#C2CCDE"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M31.3397 15C36.6987 11.9059 43.3012 11.9059 48.6602 15C54.0192 18.094 57.3205 23.8119 57.3205 30C57.3205 36.188 54.0192 41.9059 48.6602 45C43.3012 48.094 36.6987 48.094 31.3397 45C25.9807 41.9059 22.6794 36.188 22.6794 30C22.6794 23.8119 25.9807 18.094 31.3397 15Z"
        stroke="#C2CCDE"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M43.3397 35C48.6987 31.906 55.3012 31.906 60.6602 35C66.0192 38.094 69.3205 43.812 69.3205 50C69.3205 56.188 66.0192 61.906 60.6602 65C55.3012 68.094 48.6987 68.094 43.3397 65C37.9807 61.906 34.6794 56.188 34.6794 50C34.6794 43.812 37.9807 38.094 43.3397 35Z"
        stroke="#C2CCDE"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}
