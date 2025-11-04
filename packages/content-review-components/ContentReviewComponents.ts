/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';
import ContentFilteredImage from './components/ContentFilteredImage.tsx';
import ContentFilteredImageWrapper from './components/ContentFilteredImageWrapper.tsx';
import ContentFilteredVideo from './components/ContentFilteredVideo.tsx';
import ContentFilteredVideoWrapper from './components/ContentFilteredVideoWrapper.tsx';
import FilterControlBar from './components/controls/FilterControlBar.tsx';
import {ContentReviewFilterGlobalPreferencesProvider} from './ContentReviewFilterGlobalPreferenceContext.tsx';
import {ContentReviewFilterSingleMediaContextProvider} from './ContentReviewFilterSingleMediaContext.tsx';
import {useContentReviewFilterMediaInitialSettings} from './hooks/useContentReviewFilterMediaInitialSettings.ts';

// @ts-ignore
import './stylex.css';

export type {
  ContentReviewFilterGlobalPreferences,
  ContentReviewFilterSettings,
} from './ContentReviewFilterGlobalPreferenceContext.tsx';
export {
  ContentFilteredImage,
  ContentFilteredImageWrapper,
  ContentFilteredVideo,
  ContentFilteredVideoWrapper,
  ContentReviewFilterGlobalPreferencesProvider,
  ContentReviewFilterSingleMediaContextProvider,
  FilterControlBar,
  useContentReviewFilterMediaInitialSettings,
};
export {
  useContentReviewFilterPreferencesFromLocalStorage,
  savePreferencesToStorage,
  clearPersistedPreferences,
} from './hooks/useContentReviewFilterPreferencesFromLocalStorage';

// Global Settings UI Components
export {
  PreferencesDropdown,
  MenuItem,
  Toggle,
  Slider,
  HeartIcon,
} from './global-settings-ui';
export type {
  PreferencesDropdownProps,
  MenuItemProps,
  ToggleProps,
  SliderProps,
} from './global-settings-ui';
