/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  container: {
    alignItems: 'center',
    display: 'flex',
    gap: '8px',
    width: '100%',
  },
  slider: {
    appearance: 'none',
    backgroundColor: '#ddd',
    borderRadius: '2px',
    cursor: 'pointer',
    height: '4px',
    outline: 'none',
    width: '100%',
    '::-webkit-slider-thumb': {
      appearance: 'none',
      backgroundColor: '#2196F3',
      borderRadius: '50%',
      cursor: 'pointer',
      height: '16px',
      width: '16px',
    },
    '::-moz-range-thumb': {
      backgroundColor: '#2196F3',
      borderRadius: '50%',
      borderWidth: 0,
      cursor: 'pointer',
      height: '16px',
      width: '16px',
    },
  },
  valueLabel: {
    color: '#666',
    fontSize: '12px',
    minWidth: '32px',
    textAlign: 'center',
  },
});

export type SliderProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  disabled?: boolean;
};

export function Slider({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  showValue = true,
  disabled = false,
}: SliderProps) {
  const displayValue = Math.round(value * 100) / 100;

  return (
    <div {...stylex.props(styles.container)}>
      <input
        {...stylex.props(styles.slider)}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        disabled={disabled}
      />
      {showValue && (
        <span {...stylex.props(styles.valueLabel)}>{displayValue}</span>
      )}
    </div>
  );
}
