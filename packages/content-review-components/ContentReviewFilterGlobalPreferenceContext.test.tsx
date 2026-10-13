/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ReactNode} from 'react';
import {renderToString} from 'react-dom/server';
import {describe, expect, test, vi} from 'vitest';

import type {ContentReviewFilterSettings} from './ContentReviewFilterGlobalPreferenceContext';
import {
  ContentReviewFilterGlobalPreferencesProvider,
  useContentReviewFilterGlobalPreferences,
} from './ContentReviewFilterGlobalPreferenceContext';
import type {ContentReviewFilterSingleMediaSettings} from './ContentReviewFilterSingleMediaContext';
import {ContentReviewFilterSingleMediaContextProvider} from './ContentReviewFilterSingleMediaContext';
import ContentFilteredImageWrapper from './components/ContentFilteredImageWrapper';

// The reduced detail singleton creates a WebGL context when it is imported,
// which Node cannot do (see #36). These tests only render the CSS filters.
vi.mock('./ReducedDetailFilterSingleton', () => ({reducedDetailFilter: {}}));

function MaxBlurPx() {
  return <>{useContentReviewFilterGlobalPreferences().maxBlurPx}</>;
}

const globalSettings: ContentReviewFilterSettings = {
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
};

const mediaSettings: ContentReviewFilterSingleMediaSettings = {
  blur: 1,
  transparency: 0,
  isGrayscaleEnabled: false,
  isSepiaEnabled: false,
  reducedDetail: 0,
  isWarningScreenActive: false,
  harmType: null,
  caption: null,
  videoJumpForwardLength: 5,
  videoJumpBackwardLength: 5,
  videoPlaybackSpeed: 1.5,
  autoMute: false,
};

const withPreferences = (
  children: ReactNode,
  maxBlurPx?: number,
): ReactNode => (
  <ContentReviewFilterGlobalPreferencesProvider
    initialPreferences={{DEFAULT: globalSettings}}
    maxBlurPx={maxBlurPx}>
    {children}
  </ContentReviewFilterGlobalPreferencesProvider>
);

const invalidMaximums = [0, -40, Number.NaN, Number.POSITIVE_INFINITY];

describe('maxBlurPx on the preferences context', () => {
  test('defaults to 10px without a provider', () => {
    expect(renderToString(<MaxBlurPx />)).toBe('10');
  });

  test('defaults to 10px when the provider does not set it', () => {
    expect(renderToString(withPreferences(<MaxBlurPx />))).toBe('10');
  });

  test('uses the value set on the provider', () => {
    expect(renderToString(withPreferences(<MaxBlurPx />, 40))).toBe('40');
  });

  test('ignores a value that cannot produce a blur', () => {
    invalidMaximums.forEach(maxBlurPx => {
      expect(renderToString(withPreferences(<MaxBlurPx />, maxBlurPx))).toBe(
        '10',
      );
    });
  });
});

describe('maxBlurPx reaching the rendered blur', () => {
  const renderImage = (maxBlurPx?: number): string =>
    renderToString(
      withPreferences(
        <ContentReviewFilterSingleMediaContextProvider
          initialSettings={mediaSettings}>
          <ContentFilteredImageWrapper src="image.jpg" />
        </ContentReviewFilterSingleMediaContextProvider>,
        maxBlurPx,
      ),
    );

  test('applies the default maximum', () => {
    expect(renderImage()).toContain('blur(10px)');
  });

  test('applies a custom maximum', () => {
    expect(renderImage(40)).toContain('blur(40px)');
  });

  test('applies the default when the maximum is invalid', () => {
    invalidMaximums.forEach(maxBlurPx => {
      expect(renderImage(maxBlurPx)).toContain('blur(10px)');
    });
  });
});
