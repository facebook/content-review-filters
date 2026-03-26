/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import {
  PreferencesDropdown,
  HeartIcon,
} from '../../packages/content-review-components/ContentReviewComponents';
import {NuxTooltip} from './NuxTooltip';
import {useNuxDismissed} from './useNuxDismissed';

const styles = stylex.create({
  navbar: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#e1e5e9',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    display: 'flex',
    justifyContent: 'space-between',
    paddingBlock: '12px',
    paddingInline: '24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    color: '#333',
    fontSize: '18px',
    fontWeight: 600,
  },
  actions: {
    alignItems: 'center',
    display: 'flex',
    gap: '16px',
  },
  heartButtonWrapper: {
    position: 'relative',
  },
  heartButton: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': '#f0f2f5',
    },
    borderRadius: '50%',
    borderWidth: 0,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    padding: '8px',
    position: 'relative',
    transition: 'background-color 0.2s ease',
  },
});

export function NavigationBar() {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [nuxDismissed, dismissNux] = useNuxDismissed();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    // Clicking the heart means the user discovered the feature
    if (!nuxDismissed) {
      dismissNux();
    }
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav {...stylex.props(styles.navbar)}>
      <div {...stylex.props(styles.brand)}>Content Review Filters Demo</div>

      <div {...stylex.props(styles.actions)}>
        <div {...stylex.props(styles.heartButtonWrapper)}>
          <button
            {...stylex.props(styles.heartButton)}
            onClick={toggleDropdown}
            title="Content filter preferences"
            data-testid="heart-button">
            <HeartIcon isActive={isDropdownOpen} />
          </button>
          <NuxTooltip visible={!nuxDismissed} onDismiss={dismissNux} />
        </div>

        <PreferencesDropdown isOpen={isDropdownOpen} onClose={closeDropdown} />
      </div>
    </nav>
  );
}
