/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {reducedDetailFilter} from '../../ReducedDetailFilterSingleton';
import type {VideoRenderer} from '../../hooks/useVideoCanvasRenderer';

/**
 * Renders normal video content to canvas without any filtering.
 * Uses WebGL filter's no-op rendering path for consistency.
 */
export class NormalVideoRenderer implements VideoRenderer {
  render(video: HTMLVideoElement, canvas2dCtx: CanvasRenderingContext2D): void {
    reducedDetailFilter.drawFrameNoOp(video, canvas2dCtx);
  }
}
