/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {VideoRenderer} from '../../hooks/useVideoCanvasRenderer';

/**
 * Renders normal video content to canvas without any filtering.
 *
 * This path applies no reduction, so it draws straight to the 2d context
 * instead of routing the frame through WebGL. That keeps unfiltered playback
 * working where WebGL2 is missing, and avoids paying for a graphics backend
 * just to hand the frame back unchanged.
 */
export class NormalVideoRenderer implements VideoRenderer {
  render(video: HTMLVideoElement, canvas2dCtx: CanvasRenderingContext2D): void {
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      // the passed video is not valid, so return
      console.error('invalid video');
      return;
    }

    canvas2dCtx.drawImage(
      video,
      0,
      0,
      canvas2dCtx.canvas.width,
      canvas2dCtx.canvas.height,
    );
  }
}
