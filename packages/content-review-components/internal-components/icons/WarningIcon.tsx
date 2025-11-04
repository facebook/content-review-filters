/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

interface WarningIconProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function WarningIcon({className, style}: WarningIconProps) {
  return (
    <svg
      width="96"
      height="97"
      viewBox="0 0 96 97"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}>
      {/* White circular background */}
      <rect y="0.5" width="96" height="96" rx="48" fill="white" />

      {/* Warning triangle icon */}
      <g transform="translate(36, 36.5)">
        {/* Triangle background */}
        <path d="M12 2L22 18H2L12 2Z" fill="#D16F14" stroke="none" />
        {/* Exclamation mark */}
        <g fill="white">
          {/* Exclamation line */}
          <rect x="11" y="6" width="2" height="8" rx="1" />
          {/* Exclamation dot */}
          <circle cx="12" cy="16" r="1" />
        </g>
      </g>
    </svg>
  );
}
