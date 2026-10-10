/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {WebGLFilter} from './reduced_detail/surgical/SurgicalWebGl';

/**
 * The reduced detail filter needs a WebGL2 context, which not every browser or
 * test environment provides. Creating it at module level meant that importing
 * the package - even from an app that only uses the CSS filters - allocated a
 * canvas and could throw before any component rendered.
 *
 * It is created on first use instead. Success and failure are both remembered,
 * so a context is attempted at most once per document and a browser without
 * WebGL2 does not retry on every frame.
 */

type ReducedDetailFilterState =
  | {status: 'uninitialized'}
  | {status: 'ready'; filter: WebGLFilter}
  | {status: 'unavailable'};

let state: ReducedDetailFilterState = {status: 'uninitialized'};

function createFilterCanvas(): HTMLCanvasElement | null {
  // Every draw path resizes this canvas to the media it is about to render,
  // so the initial size only has to be valid.
  if (typeof OffscreenCanvas !== 'undefined') {
    return new OffscreenCanvas(1, 1) as unknown as HTMLCanvasElement;
  }
  if (typeof document !== 'undefined') {
    return document.createElement('canvas');
  }
  return null;
}

function createFilter(): WebGLFilter | null {
  const canvas = createFilterCanvas();
  if (canvas === null) {
    return null;
  }

  try {
    return new WebGLFilter(canvas);
  } catch {
    // WebGLFilter throws when it cannot get a webgl2 context, and has already
    // logged the reason. Callers fall back to keeping the media covered.
    return null;
  }
}

/**
 * Returns the shared reduced detail filter, creating it on first use.
 *
 * Returns null when this environment cannot provide one. Callers MUST NOT show
 * the unfiltered media in that case - the reduction was asked for to keep the
 * content from being seen in full detail.
 */
export function getReducedDetailFilter(): WebGLFilter | null {
  if (state.status === 'uninitialized') {
    const filter = createFilter();
    if (filter !== null) {
      state = {status: 'ready', filter};
    } else {
      state = {status: 'unavailable'};
      // Reported here, once per document: WebGLFilter throws rather than
      // logging when the context is missing, and render paths call this per
      // frame. Apps that want to react to it pass onReducedDetailUnavailable.
      console.error(
        'Unable to initialize WebGL. The reduced detail filter is unavailable, so media that requests it stays covered.',
      );
    }
  }

  return state.status === 'ready' ? state.filter : null;
}

/**
 * Forgets the memoized filter so the next call tries again. Exists for tests
 * and for a future context loss handler.
 */
export function resetReducedDetailFilter(): void {
  state = {status: 'uninitialized'};
}
