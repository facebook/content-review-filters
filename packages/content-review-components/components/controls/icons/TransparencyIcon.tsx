/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {IconProps} from './GrayscaleIcon';

export default function TransparencyIcon({
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
        d="M26.1435 16C34.7179 11.0496 45.282 11.0496 53.8563 16C62.4307 20.9505 67.7127 30.0992 67.7127 40C67.7127 49.9009 62.4307 59.0496 53.8563 64C45.282 68.9505 34.7179 68.9505 26.1435 64C17.5691 59.0496 12.2871 49.9009 12.2871 40C12.2871 30.0992 17.5691 20.9505 26.1435 16Z"
        stroke="#C2CCDE"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M40 12.2872V67.7129"
        stroke="#C2CCDE"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40 13.2598L15.2383 27.556"
        stroke="#C2CCDE"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40.0001 21.2676L12.4302 37.1851"
        stroke="#C2CCDE"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40.0001 29.2676L12.7422 45.0049"
        stroke="#C2CCDE"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40.0001 37.2676L14.9043 51.7566"
        stroke="#C2CCDE"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40.0001 45.2676L18.6079 57.6184"
        stroke="#C2CCDE"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M39.9999 53.2629L23.9009 62.5577"
        stroke="#C2CCDE"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M39.9999 61.2676L31.2754 66.3047"
        stroke="#C2CCDE"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
