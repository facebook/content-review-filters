/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getReducedDetailFilter} from '../../ReducedDetailFilterSingleton';
import ShaderProperties from '../../reduced_detail/surgical/ShaderProperties';
import {getShaderParamsFromIntensity} from '../../reduced_detail/ReducedDetailFilterUtils';
import type {VideoRenderer} from '../../hooks/useVideoCanvasRenderer';

/**
 * Renders video content with reduced detail filtering applied.
 * Manages shader properties and uses the WebGL filter pipeline.
 */
export class ReducedDetailVideoRenderer implements VideoRenderer {
  private intensity: number;
  private onUnavailable?: () => void;

  constructor(intensity: number) {
    this.intensity = intensity;
    this.updateShaderProperties();
  }

  /**
   * Called when a frame could not be reduced because the backend is missing.
   * Set from an effect, so the owner can keep the "only once" guard.
   */
  setOnUnavailable(onUnavailable: (() => void) | undefined): void {
    this.onUnavailable = onUnavailable;
  }

  updateIntensity(intensity: number): void {
    if (this.intensity !== intensity) {
      this.intensity = intensity;
      this.updateShaderProperties();
    }
  }

  private updateShaderProperties(): void {
    const {levelOfAbstraction, edgeEnhancement} = getShaderParamsFromIntensity(
      this.intensity,
    );
    ShaderProperties.setVideoLoA(levelOfAbstraction);
    ShaderProperties.setVideoEE(edgeEnhancement);
  }

  render(video: HTMLVideoElement, canvas2dCtx: CanvasRenderingContext2D): void {
    const filter = getReducedDetailFilter();
    if (filter === null) {
      // The reduction could not be applied, so the frame must not be shown.
      canvas2dCtx.fillStyle = 'black';
      canvas2dCtx.fillRect(
        0,
        0,
        canvas2dCtx.canvas.width,
        canvas2dCtx.canvas.height,
      );
      this.onUnavailable?.();
      return;
    }

    filter.drawFrame(video, canvas2dCtx);
  }
}
