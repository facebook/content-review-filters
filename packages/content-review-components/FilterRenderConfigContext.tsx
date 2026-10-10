/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Context, ReactNode} from 'react';
import {createContext, useContext, useMemo} from 'react';

/**
 * Rendering configuration that is not a per media preference.
 *
 * Both exported providers accept these as optional props and feed this
 * context, so the value is reachable whether the app uses the ready made media
 * components or composes the wrappers itself. The innermost provider wins;
 * anything it leaves out is inherited from the one above it.
 */

export type FilterRenderConfig = {
  onReducedDetailUnavailable?: () => void;
};

export type FilterRenderConfigProps = {
  /** Called when reduced detail was requested but the backend is unavailable. */
  onReducedDetailUnavailable?: () => void;
};

const FilterRenderConfigContext: Context<FilterRenderConfig> =
  createContext<FilterRenderConfig>({});

// eslint-disable-next-line react-refresh/only-export-components
export function useFilterRenderConfig(): FilterRenderConfig {
  return useContext(FilterRenderConfigContext);
}

export function FilterRenderConfigProvider({
  children,
  onReducedDetailUnavailable,
}: FilterRenderConfigProps & {children: ReactNode}) {
  const inherited = useFilterRenderConfig();
  const inheritedOnUnavailable = inherited.onReducedDetailUnavailable;

  const value = useMemo(
    () => ({
      onReducedDetailUnavailable:
        onReducedDetailUnavailable ?? inheritedOnUnavailable,
    }),
    [onReducedDetailUnavailable, inheritedOnUnavailable],
  );

  return (
    <FilterRenderConfigContext.Provider value={value}>
      {children}
    </FilterRenderConfigContext.Provider>
  );
}
