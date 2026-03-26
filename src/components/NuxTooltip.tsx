/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

const pulse = stylex.keyframes({
  '0%': {transform: 'translateX(-50%) scale(1)'},
  '50%': {transform: 'translateX(-50%) scale(1.03)'},
  '100%': {transform: 'translateX(-50%) scale(1)'},
});

const fadeIn = stylex.keyframes({
  from: {opacity: 0, transform: 'translateX(-50%) translateY(8px)'},
  to: {opacity: 1, transform: 'translateX(-50%) translateY(0)'},
});

const styles = stylex.create({
  tooltip: {
    animationDuration: '0.3s',
    animationFillMode: 'forwards',
    animationName: fadeIn,
    animationTimingFunction: 'ease-out',
    backgroundColor: '#1a1a2e',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    color: '#fff',
    fontSize: '13px',
    left: '50%',
    lineHeight: 1.4,
    paddingBlock: '10px',
    paddingInline: '14px',
    pointerEvents: 'auto',
    position: 'absolute',
    top: 'calc(100% + 12px)',
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
    zIndex: 200,
  },
  tooltipPulse: {
    animationDuration: '2s',
    animationIterationCount: '3',
    animationName: pulse,
    animationTimingFunction: 'ease-in-out',
  },
  arrow: {
    borderBottomColor: '#1a1a2e',
    borderBottomStyle: 'solid',
    borderBottomWidth: '6px',
    borderInlineColor: 'transparent',
    borderInlineStyle: 'solid',
    borderInlineWidth: '6px',
    borderTopWidth: 0,
    height: 0,
    left: '50%',
    position: 'absolute',
    top: '-6px',
    transform: 'translateX(-50%)',
    width: 0,
  },
  content: {
    alignItems: 'center',
    display: 'flex',
    gap: '8px',
  },
  text: {
    userSelect: 'none',
  },
  dismissBtn: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: 'rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
    fontSize: '14px',
    lineHeight: 1,
    paddingBlock: 0,
    paddingInline: '2px',
    transition: 'color 0.15s ease',
    ':hover': {
      color: '#fff',
    },
  },
});

interface NuxTooltipProps {
  onDismiss: () => void;
  visible: boolean;
}

export function NuxTooltip({onDismiss, visible}: NuxTooltipProps) {
  const [showPulse, setShowPulse] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      // Start pulse animation after the initial fade-in completes
      const timer = setTimeout(() => setShowPulse(true), 400);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div
      {...stylex.props(styles.tooltip, showPulse && styles.tooltipPulse)}
      data-testid="nux-tooltip">
      <div {...stylex.props(styles.arrow)} />
      <div {...stylex.props(styles.content)}>
        <span {...stylex.props(styles.text)}>
          Click ♥ to configure content filters
        </span>
        <button
          {...stylex.props(styles.dismissBtn)}
          onClick={e => {
            e.stopPropagation();
            onDismiss();
          }}
          aria-label="Dismiss tooltip"
          data-testid="nux-tooltip-dismiss">
          ✕
        </button>
      </div>
    </div>
  );
}
