/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Page} from '@playwright/test';
import {test, expect} from '@playwright/test';

const STORAGE_KEY = 'contentReviewFilterGlobalPreferences';

/**
 * Records every getContext call so a test can prove that no WebGL context was
 * created, which is the part of lazy initialization that is invisible on screen.
 */
async function recordContextCalls(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const calls: string[] = [];
    (window as unknown as {__contextCalls: string[]}).__contextCalls = calls;

    const patch = (proto: {getContext?: unknown} | undefined) => {
      if (proto == null || typeof proto.getContext !== 'function') {
        return;
      }
      const original = proto.getContext as (
        this: unknown,
        ...args: unknown[]
      ) => unknown;
      proto.getContext = function (this: unknown, ...args: unknown[]) {
        calls.push(String(args[0]));
        return original.apply(this, args);
      };
    };

    patch(HTMLCanvasElement.prototype);
    patch(
      (
        window as unknown as {
          OffscreenCanvas?: {prototype: {getContext?: unknown}};
        }
      ).OffscreenCanvas?.prototype,
    );
  });
}

/** Makes the browser behave like one without WebGL2 support. */
async function blockWebGL(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const patch = (proto: {getContext?: unknown} | undefined) => {
      if (proto == null || typeof proto.getContext !== 'function') {
        return;
      }
      const original = proto.getContext as (
        this: unknown,
        ...args: unknown[]
      ) => unknown;
      proto.getContext = function (this: unknown, ...args: unknown[]) {
        if (String(args[0]).startsWith('webgl')) {
          return null;
        }
        return original.apply(this, args);
      };
    };

    patch(HTMLCanvasElement.prototype);
    patch(
      (
        window as unknown as {
          OffscreenCanvas?: {prototype: {getContext?: unknown}};
        }
      ).OffscreenCanvas?.prototype,
    );
  });
}

async function seedPreferences(
  page: Page,
  preferences: Record<string, Record<string, number | boolean>>,
): Promise<void> {
  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key as string, value as string);
    },
    [STORAGE_KEY, JSON.stringify(preferences)],
  );
}

const noFiltersButReducedDetail = {
  imageBlur: 0,
  imageTransparency: 0,
  imageGrayscale: false,
  imageSepia: false,
  imageReducedDetail: 1,
  imageWarningScreen: false,
  videoBlur: 0,
  videoTransparency: 0,
  videoGrayscale: false,
  videoSepia: false,
  videoReducedDetail: 1,
  videoWarningScreen: false,
};

const noFiltersAtAll = {
  ...noFiltersButReducedDetail,
  imageReducedDetail: 0,
  videoReducedDetail: 0,
};

/** Plays the first video muted and waits for frames to be drawn. */
async function playFirstVideo(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const video = document.querySelector('video');
    return video != null && video.readyState >= 2;
  });
  await page.evaluate(async () => {
    const video = document.querySelector('video');
    if (video == null) {
      return;
    }
    video.muted = true;
    await video.play().catch(() => {});
  });
  // The canvas is painted from requestVideoFrameCallback, so wait for pixels
  // rather than for a fixed delay.
  await page.waitForFunction(() => {
    const video = document.querySelector('video');
    const canvas = video?.parentElement?.querySelector(
      'canvas',
    ) as HTMLCanvasElement | null;
    if (canvas == null || canvas.width === 0 || canvas.height === 0) {
      return false;
    }
    const context = canvas.getContext('2d');
    if (context == null) {
      return false;
    }
    const {data} = context.getImageData(
      Math.floor(canvas.width / 2),
      Math.floor(canvas.height / 2),
      1,
      1,
    );
    return data[3] === 255;
  });
}

const webglCalls = (calls: string[]): string[] =>
  calls.filter(type => type.startsWith('webgl'));

test.describe('reduced detail WebGL initialization', () => {
  test('creates no WebGL context when reduced detail is off', async ({
    page,
  }) => {
    await recordContextCalls(page);
    await seedPreferences(page, {
      DEFAULT: noFiltersAtAll,
      GRAPHIC: noFiltersAtAll,
    });

    await page.goto('/');
    await expect(page.getByRole('heading', {level: 1})).toBeVisible();
    await playFirstVideo(page);

    const calls = await page.evaluate(
      () => (window as unknown as {__contextCalls: string[]}).__contextCalls,
    );

    // The media still renders through 2d canvases, so this asserts that the
    // WebGL backend specifically was never asked for.
    expect(calls).toContain('2d');
    expect(webglCalls(calls)).toEqual([]);
  });

  test('degrades safely when WebGL2 is unavailable', async ({page}) => {
    const pageErrors: string[] = [];
    page.on('pageerror', error => pageErrors.push(String(error)));
    const webglErrors: string[] = [];
    page.on('console', message => {
      if (
        message.type() === 'error' &&
        message.text().includes('Unable to initialize WebGL')
      ) {
        webglErrors.push(message.text());
      }
    });

    await blockWebGL(page);
    await seedPreferences(page, {
      DEFAULT: noFiltersButReducedDetail,
      GRAPHIC: noFiltersButReducedDetail,
    });

    await page.goto('/');

    // The page renders at all - importing the package used to throw here.
    await expect(page.getByRole('heading', {level: 1})).toBeVisible();

    const imageOverlay = page
      .locator(
        'xpath=//img[contains(@src,"example_image")]/following-sibling::canvas',
      )
      .first();
    await expect(imageOverlay).toBeVisible();
    // The image stays covered instead of being shown without the reduction.
    await expect(imageOverlay).toHaveCSS('backdrop-filter', /blur/);
    const imageOverlayIsEmpty = await imageOverlay.evaluate(canvas => {
      const element = canvas as HTMLCanvasElement;
      const context = element.getContext('2d');
      if (context == null || element.width === 0 || element.height === 0) {
        return true;
      }
      const {data} = context.getImageData(0, 0, element.width, element.height);
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] !== 0) {
          return false;
        }
      }
      return true;
    });
    expect(imageOverlayIsEmpty).toBe(true);

    await playFirstVideo(page);

    // A frame that could not be reduced is covered, never shown as it is.
    const videoOverlayPixel = await page.evaluate(() => {
      const video = document.querySelector('video');
      const canvas = video?.parentElement?.querySelector('canvas');
      if (canvas == null) {
        return null;
      }
      const context = (canvas as HTMLCanvasElement).getContext('2d');
      const {data} = context!.getImageData(
        Math.floor(canvas.width / 2),
        Math.floor(canvas.height / 2),
        1,
        1,
      );
      return [data[0], data[1], data[2], data[3]];
    });
    expect(videoOverlayPixel).toEqual([0, 0, 0, 255]);

    expect(pageErrors).toEqual([]);
    // Memoized: the failure is reported once, not once per rendered frame,
    // even though several medias asked for the reduction.
    expect(webglErrors.length).toBe(1);
  });

  test('keeps the CSS filters working when WebGL2 is unavailable', async ({
    page,
  }) => {
    await blockWebGL(page);
    await seedPreferences(page, {
      DEFAULT: {
        ...noFiltersButReducedDetail,
        imageBlur: 1,
        imageGrayscale: true,
        imageTransparency: 0.25,
      },
      GRAPHIC: noFiltersButReducedDetail,
    });

    await page.goto('/');

    const image = page.locator('img[src*="example_image"]').first();
    await expect(image).toBeVisible();

    const wrapper = page
      .locator('xpath=//img[contains(@src,"example_image")]/..')
      .first();
    // The filters that do not need the backend are unaffected by its absence.
    await expect(wrapper).toHaveCSS('filter', /blur\(10px\)/);
    await expect(wrapper).toHaveCSS('filter', /grayscale/);
    await expect(wrapper).toHaveCSS('opacity', '0.75');
  });

  test('renders video without reduced detail with no WebGL context', async ({
    page,
  }) => {
    await recordContextCalls(page);
    await seedPreferences(page, {
      DEFAULT: noFiltersAtAll,
      GRAPHIC: noFiltersAtAll,
    });

    await page.goto('/');
    await playFirstVideo(page);

    const comparison = await page.evaluate(() => {
      const video = document.querySelector('video');
      const canvas = video?.parentElement?.querySelector('canvas') as
        | HTMLCanvasElement
        | undefined;
      if (video == null || canvas == null) {
        return null;
      }

      const sample = (
        context: CanvasRenderingContext2D,
        w: number,
        h: number,
      ) => {
        const {data} = context.getImageData(
          Math.floor(w / 2),
          Math.floor(h / 2),
          1,
          1,
        );
        return [data[0], data[1], data[2], data[3]];
      };

      const overlayContext = canvas.getContext('2d');
      const overlayPixel = sample(overlayContext!, canvas.width, canvas.height);

      const scratch = document.createElement('canvas');
      scratch.width = canvas.width;
      scratch.height = canvas.height;
      const scratchContext = scratch.getContext('2d');
      scratchContext!.drawImage(video, 0, 0, scratch.width, scratch.height);
      const framePixel = sample(scratchContext!, scratch.width, scratch.height);

      return {overlayPixel, framePixel};
    });

    expect(comparison).not.toBeNull();
    const {overlayPixel, framePixel} = comparison!;
    // Opaque: something was actually drawn, and it is not the black fallback
    // unless the frame itself is black.
    expect(overlayPixel[3]).toBe(255);
    [0, 1, 2].forEach(channel => {
      expect(
        Math.abs(overlayPixel[channel] - framePixel[channel]),
      ).toBeLessThan(40);
    });

    const calls = await page.evaluate(
      () => (window as unknown as {__contextCalls: string[]}).__contextCalls,
    );
    expect(webglCalls(calls)).toEqual([]);
  });
});
