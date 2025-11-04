/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {reducedDetailFilter} from '../../ReducedDetailFilterSingleton';
import ShaderProperties from '../../reduced_detail/surgical/ShaderProperties';
import {getShaderParamsFromIntensity} from '../../reduced_detail/ReducedDetailFilterUtils';
import type {VideoRenderer} from '../../hooks/useVideoCanvasRenderer';

/**
 * Renders video content with reduced detail filtering applied.
 * Manages shader properties and uses the WebGL filter pipeline.
 */
export class ReducedDetailVideoRenderer implements VideoRenderer {
  private intensity: number;

  constructor(intensity: number) {
    this.intensity = intensity;
    this.updateShaderProperties();
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
    reducedDetailFilter.drawFrame(video, canvas2dCtx);
  }
}
