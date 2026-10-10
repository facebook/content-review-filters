/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ReactNode} from 'react';
import {createContext, useContext} from 'react';
import {DEFAULT_MAX_BLUR_PX, resolveMaxBlurPx} from './FilterPreferenceUtils';

/**
 * Blur, in pixels, applied at the maximum blur preference.
 *
 * Both exported providers accept it as an optional `maxBlurPx` prop. The
 * innermost provider that sets a usable value wins; one that leaves it out
 * (like the provider ContentFilteredImage creates internally) inherits the
 * value from above instead of resetting it to the default.
 */
const MaxBlurPxContext = createContext<number>(DEFAULT_MAX_BLUR_PX);

// eslint-disable-next-line react-refresh/only-export-components
export function useMaxBlurPx(): number {
  return useContext(MaxBlurPxContext);
}

export function MaxBlurPxProvider({
  children,
  maxBlurPx,
}: {
  children: ReactNode;
  maxBlurPx?: number;
}) {
  const inheritedMaxBlurPx = useMaxBlurPx();

  return (
    <MaxBlurPxContext.Provider
      value={resolveMaxBlurPx(maxBlurPx, inheritedMaxBlurPx)}>
      {children}
    </MaxBlurPxContext.Provider>
  );
}
