/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Context, ReactNode} from 'react';
import React, {createContext, useContext, useState} from 'react';
import {
  useContentReviewFilterPreferencesFromLocalStorage,
  savePreferencesToStorage,
} from './hooks/useContentReviewFilterPreferencesFromLocalStorage';

export type ContentReviewFilterSettings = {
  imageBlur: number;
  imageTransparency: number;
  imageGrayscale: boolean;
  imageSepia: boolean;
  imageReducedDetail: number;
  imageWarningScreen: boolean;
  videoBlur: number;
  videoTransparency: number;
  videoGrayscale: boolean;
  videoReducedDetail: number;
  videoSepia: boolean;
  videoWarningScreen: boolean;
  videoJumpForwardLength: number;
  videoJumpBackwardLength: number;
  videoPlaybackSpeed: number;
  autoMute: boolean;
};

export type ContentReviewFilterGlobalPreferences<
  THarmType extends string | number,
> = {
  [K in THarmType]: ContentReviewFilterSettings;
};

export const DEFAULT_PREFENCES_KEY = 'DEFAULT' as const;

// Type guard to check if the object is ContentReviewFilterSettings
// eslint-disable-next-line react-refresh/only-export-components
export function isContentReviewFilterSettings(
  obj: unknown,
): obj is ContentReviewFilterSettings {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const record = obj as Record<string, unknown>;
  return (
    typeof record.imageBlur === 'number' &&
    typeof record.imageGrayscale === 'boolean' &&
    typeof record.imageSepia === 'boolean' &&
    typeof record.imageReducedDetail === 'number' &&
    typeof record.imageWarningScreen === 'boolean' &&
    typeof record.videoBlur === 'number' &&
    typeof record.videoGrayscale === 'boolean' &&
    typeof record.videoReducedDetail === 'number' &&
    typeof record.videoSepia === 'boolean' &&
    typeof record.videoWarningScreen === 'boolean' &&
    typeof record.videoJumpForwardLength === 'number' &&
    typeof record.videoJumpBackwardLength === 'number' &&
    typeof record.videoPlaybackSpeed === 'number' &&
    typeof record.autoMute === 'boolean'
  );
}

// Type guard to check if the object is ContentReviewFilterGlobalPreferences
// eslint-disable-next-line react-refresh/only-export-components
export function isContentReviewFilterGlobalPreferences<
  THarmType extends string | number,
>(obj: unknown): obj is ContentReviewFilterGlobalPreferences<THarmType> {
  if (!obj || typeof obj !== 'object') return false;

  // Check if all values in the object are ContentReviewFilterSettings
  return Object.values(obj).every(value =>
    isContentReviewFilterSettings(value),
  );
}

// Helper function to convert ContentReviewFilterSettings to ContentReviewFilterGlobalPreferences
// eslint-disable-next-line react-refresh/only-export-components
export function toContentReviewFilterGlobalPreferences<
  THarmType extends string | number,
>(
  settings: ContentReviewFilterSettings,
  harmType: THarmType = DEFAULT_PREFENCES_KEY as THarmType,
): ContentReviewFilterGlobalPreferences<THarmType> {
  return {
    [harmType]: settings,
  } as ContentReviewFilterGlobalPreferences<THarmType>;
}

export type ContentReviewFilterGlobalPreferencesContextType<
  THarmType extends string | number,
> = {
  preferences: ContentReviewFilterGlobalPreferences<THarmType>;
  updatePreference: <
    K extends keyof ContentReviewFilterGlobalPreferences<THarmType>,
    PK extends keyof ContentReviewFilterSettings,
  >(
    setting: PK,
    value: ContentReviewFilterGlobalPreferences<THarmType>[K][PK],
    harmType?: K,
  ) => void;
};
const ContentReviewFilterGlobalPreferencesContext: Context<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ContentReviewFilterGlobalPreferencesContextType<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = createContext<ContentReviewFilterGlobalPreferencesContextType<any>>({
  preferences: {
    [DEFAULT_PREFENCES_KEY]: {
      imageBlur: 0,
      imageTransparency: 0,
      imageGrayscale: false,
      imageSepia: false,
      imageReducedDetail: 0,
      imageWarningScreen: false,
      videoBlur: 0.5,
      videoTransparency: 0.5,
      videoGrayscale: true,
      videoReducedDetail: 1,
      videoSepia: false,
      videoWarningScreen: false,
      videoJumpForwardLength: 5,
      videoJumpBackwardLength: 5,
      videoPlaybackSpeed: 1.5,
      autoMute: false,
    },
  },
  updatePreference: () => {},
});

export type ContentReviewFilterGlobalPreferencesProviderProps<
  THarmType extends string | number,
> = {
  children: ReactNode;
  initialPreferences:
    | ContentReviewFilterGlobalPreferences<THarmType>
    | ContentReviewFilterSettings;
  onPreferenceChange?: <
    K extends keyof ContentReviewFilterGlobalPreferences<THarmType>,
    PK extends keyof ContentReviewFilterSettings,
  >(
    setting: PK,
    value: ContentReviewFilterGlobalPreferences<THarmType>[K][PK],
    harmType?: K,
  ) => void;
};

export function ContentReviewFilterGlobalPreferencesProvider<
  THarmType extends string | number,
>({
  children,
  initialPreferences,
  onPreferenceChange,
}: ContentReviewFilterGlobalPreferencesProviderProps<THarmType>) {
  // Convert ContentReviewFilterSettings to ContentReviewFilterGlobalPreferences if needed
  const normalizedPreferences: ContentReviewFilterGlobalPreferences<THarmType> =
    isContentReviewFilterSettings(initialPreferences)
      ? toContentReviewFilterGlobalPreferences(
          initialPreferences,
          DEFAULT_PREFENCES_KEY as THarmType,
        )
      : (initialPreferences as ContentReviewFilterGlobalPreferences<THarmType>);
  // Load persisted preferences merged with initial preferences
  const persistedPreferences =
    useContentReviewFilterPreferencesFromLocalStorage(
      normalizedPreferences as ContentReviewFilterGlobalPreferences<string>,
    ) as ContentReviewFilterGlobalPreferences<THarmType>;

  const [preferences, setPreferences] =
    useState<ContentReviewFilterGlobalPreferences<THarmType>>(
      persistedPreferences,
    );

  const updatePreference = React.useCallback(
    <
      K extends keyof ContentReviewFilterGlobalPreferences<THarmType>,
      PK extends keyof ContentReviewFilterSettings,
    >(
      setting: PK,
      value: ContentReviewFilterGlobalPreferences<THarmType>[K][PK],
      harmType: K = DEFAULT_PREFENCES_KEY as K,
    ) => {
      // Validate numeric values based on the setting type
      let validatedValue: ContentReviewFilterGlobalPreferences<THarmType>[K][PK] =
        value;
      if (typeof value === 'number') {
        let numericValue: number;
        if (setting === 'videoPlaybackSpeed') {
          // Playback speed: between 0.1 and 10
          numericValue = Math.max(0.1, Math.min(10, value));
        } else if (
          setting === 'videoJumpForwardLength' ||
          setting === 'videoJumpBackwardLength'
        ) {
          // Jump forward/backward: between 1 and 180 seconds
          numericValue = Math.max(1, Math.min(180, value));
        } else {
          // Other numeric values (blur, transparency, etc.): between 0 and 1
          numericValue = Math.max(0, Math.min(1, value));
        }
        validatedValue =
          numericValue as ContentReviewFilterGlobalPreferences<THarmType>[K][PK];
      }

      setPreferences(prev => {
        const newPreferences = {
          ...prev,
          [harmType]: {
            ...prev[harmType],
            [setting]: validatedValue,
          },
        };
        // Save to localStorage whenever preferences are updated
        savePreferencesToStorage(newPreferences);
        return newPreferences;
      });
      onPreferenceChange?.(setting, value, harmType);
    },
    [onPreferenceChange],
  );

  const contextValue = React.useMemo(
    () => ({
      preferences,
      updatePreference,
    }),
    [preferences, updatePreference],
  );

  return (
    <ContentReviewFilterGlobalPreferencesContext.Provider value={contextValue}>
      {children}
    </ContentReviewFilterGlobalPreferencesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useContentReviewFilterGlobalPreferences<
  THarmType extends string | number,
>(): ContentReviewFilterGlobalPreferencesContextType<THarmType> {
  const context = useContext(ContentReviewFilterGlobalPreferencesContext);
  if (context === undefined) {
    throw new Error(
      'useContentReviewFilterGlobalPreferences must be used within a ContentReviewFilterGlobalPreferencesProvider',
    );
  }
  return context;
}
