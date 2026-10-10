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
import {ContentReviewFilterGlobalPreferencesProvider} from './ContentReviewFilterGlobalPreferenceContext';
import type {ContentReviewFilterSingleMediaSettings} from './ContentReviewFilterSingleMediaContext';
import {ContentReviewFilterSingleMediaContextProvider} from './ContentReviewFilterSingleMediaContext';
import {useMaxBlurPx} from './MaxBlurPxContext';
import ContentFilteredImageWrapper from './components/ContentFilteredImageWrapper';

// The reduced detail singleton creates a WebGL context when it is imported,
// which Node cannot do (see #36). These tests only render the CSS filters.
vi.mock('./ReducedDetailFilterSingleton', () => ({reducedDetailFilter: {}}));

function MaxBlurPx() {
  return <>{useMaxBlurPx()}</>;
}

const render = (element: ReactNode): number => Number(renderToString(element));

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
  blur: 0.5,
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

describe('maxBlurPx propagated through the providers', () => {
  test('defaults to 10px when no provider sets it', () => {
    expect(render(<MaxBlurPx />)).toBe(10);
    expect(
      render(
        <ContentReviewFilterGlobalPreferencesProvider
          initialPreferences={{DEFAULT: globalSettings}}>
          <MaxBlurPx />
        </ContentReviewFilterGlobalPreferencesProvider>,
      ),
    ).toBe(10);
  });

  test('uses a custom value from the global preferences provider', () => {
    expect(
      render(
        <ContentReviewFilterGlobalPreferencesProvider
          initialPreferences={{DEFAULT: globalSettings}}
          maxBlurPx={40}>
          <MaxBlurPx />
        </ContentReviewFilterGlobalPreferencesProvider>,
      ),
    ).toBe(40);
  });

  test('uses a custom value from the single media provider', () => {
    expect(
      render(
        <ContentReviewFilterSingleMediaContextProvider
          initialSettings={mediaSettings}
          maxBlurPx={25}>
          <MaxBlurPx />
        </ContentReviewFilterSingleMediaContextProvider>,
      ),
    ).toBe(25);
  });

  test('a single media provider without the prop inherits the global value', () => {
    // ContentFilteredImage and ContentFilteredVideo create this provider
    // internally, without maxBlurPx.
    expect(
      render(
        <ContentReviewFilterGlobalPreferencesProvider
          initialPreferences={{DEFAULT: globalSettings}}
          maxBlurPx={40}>
          <ContentReviewFilterSingleMediaContextProvider
            initialSettings={mediaSettings}>
            <MaxBlurPx />
          </ContentReviewFilterSingleMediaContextProvider>
        </ContentReviewFilterGlobalPreferencesProvider>,
      ),
    ).toBe(40);
  });

  test('the innermost provider that sets it wins', () => {
    expect(
      render(
        <ContentReviewFilterGlobalPreferencesProvider
          initialPreferences={{DEFAULT: globalSettings}}
          maxBlurPx={40}>
          <ContentReviewFilterSingleMediaContextProvider
            initialSettings={mediaSettings}
            maxBlurPx={20}>
            <MaxBlurPx />
          </ContentReviewFilterSingleMediaContextProvider>
        </ContentReviewFilterGlobalPreferencesProvider>,
      ),
    ).toBe(20);
  });

  test('an invalid value falls back to the inherited one', () => {
    [0, -40, Number.NaN, Number.POSITIVE_INFINITY].forEach(invalid => {
      expect(
        render(
          <ContentReviewFilterGlobalPreferencesProvider
            initialPreferences={{DEFAULT: globalSettings}}
            maxBlurPx={invalid}>
            <MaxBlurPx />
          </ContentReviewFilterGlobalPreferencesProvider>,
        ),
      ).toBe(10);

      expect(
        render(
          <ContentReviewFilterGlobalPreferencesProvider
            initialPreferences={{DEFAULT: globalSettings}}
            maxBlurPx={40}>
            <ContentReviewFilterSingleMediaContextProvider
              initialSettings={mediaSettings}
              maxBlurPx={invalid}>
              <MaxBlurPx />
            </ContentReviewFilterSingleMediaContextProvider>
          </ContentReviewFilterGlobalPreferencesProvider>,
        ),
      ).toBe(40);
    });
  });
});

describe('maxBlurPx reaching the rendered filter', () => {
  const renderImage = (maxBlurPx?: number): string =>
    renderToString(
      <ContentReviewFilterSingleMediaContextProvider
        initialSettings={{...mediaSettings, blur: 1}}
        maxBlurPx={maxBlurPx}>
        <ContentFilteredImageWrapper src="image.jpg" />
      </ContentReviewFilterSingleMediaContextProvider>,
    );

  test('applies the default maximum', () => {
    expect(renderImage()).toContain('blur(10px)');
  });

  test('applies a custom maximum', () => {
    expect(renderImage(40)).toContain('blur(40px)');
  });

  test('ignores an invalid maximum', () => {
    expect(renderImage(0)).toContain('blur(10px)');
  });
});
