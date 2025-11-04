/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useMemo} from 'react';
import type {
  ContentReviewFilterGlobalPreferences,
  ContentReviewFilterSettings,
} from '../ContentReviewFilterGlobalPreferenceContext';

const STORAGE_KEY = 'contentReviewFilterGlobalPreferences';

/**
 * Default settings for different harm types
 */
const DEFAULT_SETTINGS: ContentReviewFilterGlobalPreferences<string> = {
  DEFAULT: {
    imageBlur: 0.2,
    imageTransparency: 0.2,
    imageGrayscale: true,
    imageSepia: false,
    imageReducedDetail: 0.5,
    imageWarningScreen: false,
    videoBlur: 0.5,
    videoTransparency: 0,
    videoGrayscale: true,
    videoReducedDetail: 1,
    videoSepia: false,
    videoWarningScreen: false,
    videoJumpForwardLength: 5,
    videoJumpBackwardLength: 5,
    videoPlaybackSpeed: 1.5,
    autoMute: false,
  },
  GRAPHIC: {
    imageBlur: 0,
    imageTransparency: 0,
    imageGrayscale: false,
    imageSepia: false,
    imageReducedDetail: 0,
    videoBlur: 0,
    videoTransparency: 0,
    videoGrayscale: false,
    videoReducedDetail: 0,
    videoSepia: false,
    videoWarningScreen: true,
    videoJumpForwardLength: 5,
    videoJumpBackwardLength: 5,
    videoPlaybackSpeed: 2.5,
    imageWarningScreen: true,
    autoMute: false,
  },
};

/**
 * Loads preferences from localStorage and merges them with default settings
 */
function loadPersistedPreferences<THarmType extends string>(
  defaultPreferences: ContentReviewFilterGlobalPreferences<THarmType>,
): ContentReviewFilterGlobalPreferences<THarmType> {
  try {
    if (typeof window === 'undefined') {
      // SSR: return defaults
      return defaultPreferences;
    }

    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      return defaultPreferences;
    }

    const parsedData = JSON.parse(storedData);
    if (!parsedData || typeof parsedData !== 'object') {
      return defaultPreferences;
    }

    // Create a new object starting with defaults
    const mergedPreferences: ContentReviewFilterGlobalPreferences<THarmType> = {
      ...defaultPreferences,
    };

    // Merge stored preferences with defaults for each harm type
    Object.keys(defaultPreferences).forEach(harmType => {
      const defaultHarmSettings = defaultPreferences[harmType as THarmType];
      const storedHarmSettings = parsedData[harmType];

      if (storedHarmSettings && typeof storedHarmSettings === 'object') {
        // Create merged settings for this harm type
        const mergedHarmSettings: ContentReviewFilterSettings = {
          ...defaultHarmSettings,
        };

        // Only copy over valid properties that exist in the default settings
        Object.keys(defaultHarmSettings).forEach(key => {
          const settingKey = key as keyof ContentReviewFilterSettings;
          if (storedHarmSettings.hasOwnProperty(key)) {
            const storedValue = storedHarmSettings[key];
            const defaultValue = defaultHarmSettings[settingKey];

            // Type check: ensure stored value matches expected type
            if (typeof storedValue === typeof defaultValue) {
              (mergedHarmSettings as Record<string, number | boolean>)[
                settingKey
              ] = storedValue as number | boolean;
            }
          }
        });

        mergedPreferences[harmType as THarmType] = mergedHarmSettings;
      }
    });

    return mergedPreferences;
  } catch (error) {
    console.warn(
      'Failed to load persisted preferences from localStorage:',
      error,
    );
    return defaultPreferences;
  }
}

/**
 * Saves preferences to localStorage
 */
export function savePreferencesToStorage<THarmType extends string>(
  preferences: ContentReviewFilterGlobalPreferences<THarmType>,
): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    }
  } catch (error) {
    console.warn('Failed to save preferences to localStorage:', error);
  }
}

/**
 * Hook to initialize content review filter preferences from localStorage
 */
export function useContentReviewFilterPreferencesFromLocalStorage<
  THarmType extends string,
>(
  customDefaults?: ContentReviewFilterGlobalPreferences<THarmType>,
): ContentReviewFilterGlobalPreferences<THarmType> {
  return useMemo(() => {
    const defaults =
      customDefaults ||
      (DEFAULT_SETTINGS as ContentReviewFilterGlobalPreferences<THarmType>);
    return loadPersistedPreferences(defaults);
  }, [customDefaults]);
}

/**
 * Clears all stored preferences (useful for reset functionality)
 */
export function clearPersistedPreferences(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.warn(
      'Failed to clear persisted preferences from localStorage:',
      error,
    );
  }
}
