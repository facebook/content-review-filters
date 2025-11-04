/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  toggle: {
    display: 'inline-block',
    height: '24px',
    position: 'relative',
    width: '50px',
  },
  input: {
    height: 0,
    opacity: 0,
    width: 0,
  },
  slider: {
    backgroundColor: '#ccc',
    borderRadius: '24px',
    bottom: 0,
    cursor: 'pointer',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    transition: '.4s',
  },
  sliderChecked: {
    backgroundColor: '#2196F3',
  },
  sliderBefore: {
    backgroundColor: 'white',
    borderRadius: '50%',
    bottom: '3px',
    content: '',
    height: '18px',
    left: '3px',
    position: 'absolute',
    transition: '.4s',
    width: '18px',
  },
  sliderBeforeChecked: {
    transform: 'translateX(26px)',
  },
});

export type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function Toggle({checked, onChange, disabled = false}: ToggleProps) {
  return (
    <label {...stylex.props(styles.toggle)}>
      <input
        {...stylex.props(styles.input)}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span {...stylex.props(styles.slider, checked && styles.sliderChecked)}>
        <span
          {...stylex.props(
            styles.sliderBefore,
            checked && styles.sliderBeforeChecked,
          )}
        />
      </span>
    </label>
  );
}
