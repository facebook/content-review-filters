/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Context, ReactNode} from 'react';
import React, {createContext, useContext, useState, useEffect} from 'react';

export type ContentReviewFilterSingleMediaSettings = {
  blur: number;
  transparency: number;
  isGrayscaleEnabled: boolean;
  isSepiaEnabled: boolean;
  reducedDetail: number;
  isWarningScreenActive: boolean;
  harmType: string | null;
  caption: string | null;
  videoJumpForwardLength: number;
  videoJumpBackwardLength: number;
  videoPlaybackSpeed: number;
  autoMute: boolean;
};

export type ContentReviewFilterSingleMediaContextType = {
  settings: ContentReviewFilterSingleMediaSettings;
  updateSettings: <PK extends keyof ContentReviewFilterSingleMediaSettings>(
    setting: PK,
    value: ContentReviewFilterSingleMediaSettings[PK],
  ) => void;
};

const ContentReviewFilterSingleMediaContext: Context<ContentReviewFilterSingleMediaContextType> =
  createContext<ContentReviewFilterSingleMediaContextType>({
    settings: {
      blur: 0,
      transparency: 0,
      isGrayscaleEnabled: false,
      isSepiaEnabled: false,
      reducedDetail: 0,
      isWarningScreenActive: false,
      harmType: null,
      caption: null,
      videoJumpForwardLength: 0,
      videoJumpBackwardLength: 0,
      videoPlaybackSpeed: 1.5,
      autoMute: false,
    },
    updateSettings: () => {},
  });

export type ContentReviewFilterSingleMediaContextProviderProps = {
  children: ReactNode;
  initialSettings: ContentReviewFilterSingleMediaSettings;
  onSettingChange?: <PK extends keyof ContentReviewFilterSingleMediaSettings>(
    setting: PK,
    value: ContentReviewFilterSingleMediaSettings[PK],
  ) => void;
};

export function ContentReviewFilterSingleMediaContextProvider({
  children,
  initialSettings,
  onSettingChange,
}: ContentReviewFilterSingleMediaContextProviderProps) {
  const [settings, setSettings] =
    useState<ContentReviewFilterSingleMediaSettings>(initialSettings);

  // Update internal settings when initialSettings changes (e.g., when global preferences change)
  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const updateSettings = React.useCallback(
    <PK extends keyof ContentReviewFilterSingleMediaSettings>(
      setting: PK,
      value: ContentReviewFilterSingleMediaSettings[PK],
    ) => {
      // Validate numeric values are between 0-1
      const validatedValue =
        typeof value === 'number' ? Math.max(0, Math.min(1, value)) : value;

      setSettings(prev => ({
        ...prev,
        [setting]: validatedValue,
      }));
      onSettingChange?.(setting, value);
    },
    [onSettingChange],
  );

  const contextValue = React.useMemo(
    () => ({
      settings,
      updateSettings,
    }),
    [settings, updateSettings],
  );

  return (
    <ContentReviewFilterSingleMediaContext.Provider value={contextValue}>
      {children}
    </ContentReviewFilterSingleMediaContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useContentReviewFilterSingleMediaContext(): ContentReviewFilterSingleMediaContextType {
  const context = useContext(ContentReviewFilterSingleMediaContext);
  if (context === undefined) {
    throw new Error(
      'useContentReviewFilterSingleMediaContext must be used within a ContentReviewFilterSingleMediaContextProvider',
    );
  }
  return context;
}
