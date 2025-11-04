/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {IconProps} from './GrayscaleIcon';

export default function FlipIcon({
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
      <path d="M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 2h2V3h-2v2zm4 0h2V3h-2v2zm0 14h2v-2h-2v2zm0-8h2v-2h-2v2zm0 4h2v-2h-2v2zm-4 4h2v-2h-2v2zm0-8h2v-2h-2v2z" />
      <path
        d="M12 6v12l4-4-4-4 4-4z"
        transform="scale(-1,1) translate(-24,0)"
      />
    </svg>
  );
}
