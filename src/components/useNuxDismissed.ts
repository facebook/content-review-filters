/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';

const STORAGE_KEY = 'content_review_nux_dismissed';

/**
 * Hook to manage NUX tooltip visibility state with localStorage persistence.
 */
export function useNuxDismissed(): [boolean, () => void] {
  const [dismissed, setDismissed] = React.useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const dismiss = React.useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // localStorage unavailable — state still updated in memory
    }
  }, []);

  return [dismissed, dismiss];
}
