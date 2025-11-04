/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

const styles = stylex.create({
  container: {
    alignItems: 'center',
    borderBottomColor: '#f0f0f0',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    display: 'flex',
    justifyContent: 'space-between',
    paddingBlock: '8px',
    paddingInline: '12px',
    ':last-child': {
      borderBottomWidth: 0,
    },
  },
  label: {
    color: '#333',
    fontSize: '14px',
    fontWeight: 'normal',
  },
  control: {
    flex: 'none',
  },
});

export type MenuItemProps = {
  label: string;
  children: React.ReactNode;
};

export function MenuItem({label, children}: MenuItemProps) {
  return (
    <div {...stylex.props(styles.container)}>
      <span {...stylex.props(styles.label)}>{label}</span>
      <div {...stylex.props(styles.control)}>{children}</div>
    </div>
  );
}
