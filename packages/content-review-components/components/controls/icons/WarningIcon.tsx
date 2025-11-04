/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {IconProps} from './GrayscaleIcon';

export default function WarningIcon({
  className,
  style,
  'aria-hidden': ariaHidden = true,
}: IconProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      aria-hidden={ariaHidden}>
      {/* White circle background */}
      <circle cx="12" cy="12" r="12" fill="white" />

      {/* Yellow triangle with rounded corners */}
      <path
        d="M12 4L19.5 18H4.5L12 4Z"
        fill="#fbbf24"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Exclamation mark */}
      <circle cx="12" cy="16" r="1" fill="white" />
      <rect x="11" y="9" width="2" height="5" rx="1" fill="white" />
    </svg>
  );
}
