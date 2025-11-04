/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  DEFAULT_PREFENCES_KEY,
  useContentReviewFilterGlobalPreferences,
} from '../ContentReviewFilterGlobalPreferenceContext';
import type {ContentReviewFilterSingleMediaSettings} from '../ContentReviewFilterSingleMediaContext';

/**
 * Custom hook that converts global preferences to single media initial settings based on harm type.
 * This extracts the repeated logic from ContentFilteredImage and ContentFilteredVideo components.
 */
export function useContentReviewFilterMediaInitialSettings(
  harmType?: string | number,
  mediaType: 'image' | 'video' = 'image',
  caption?: string | null,
): ContentReviewFilterSingleMediaSettings {
  const globalPreferences = useContentReviewFilterGlobalPreferences();

  // Determine which harmType to use
  const resolvedHarmType =
    harmType && harmType in globalPreferences.preferences
      ? harmType
      : DEFAULT_PREFENCES_KEY;

  const globalSettings = globalPreferences.preferences[resolvedHarmType];

  // Convert global settings to single media settings based on media type
  const singleMediaSettings: ContentReviewFilterSingleMediaSettings = {
    blur:
      mediaType === 'image'
        ? globalSettings.imageBlur
        : globalSettings.videoBlur,
    transparency:
      mediaType === 'image'
        ? globalSettings.imageTransparency
        : globalSettings.videoTransparency,
    isGrayscaleEnabled:
      mediaType === 'image'
        ? globalSettings.imageGrayscale
        : globalSettings.videoGrayscale,
    isSepiaEnabled:
      mediaType === 'image'
        ? globalSettings.imageSepia
        : globalSettings.videoSepia,
    reducedDetail:
      mediaType === 'image'
        ? globalSettings.imageReducedDetail
        : globalSettings.videoReducedDetail,
    isWarningScreenActive:
      mediaType === 'image'
        ? globalSettings.imageWarningScreen
        : globalSettings.videoWarningScreen,
    harmType: String(resolvedHarmType),
    caption: caption ?? null,
    videoJumpForwardLength: globalSettings.videoJumpForwardLength,
    videoJumpBackwardLength: globalSettings.videoJumpBackwardLength,
    videoPlaybackSpeed: globalSettings.videoPlaybackSpeed,
    autoMute: globalSettings.autoMute,
  };

  return singleMediaSettings;
}
