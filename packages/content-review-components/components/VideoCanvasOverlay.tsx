/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import * as React from 'react';
import {useMemo, useEffect} from 'react';
import * as stylex from '@stylexjs/stylex';
import {useVideoCanvasRenderer} from '../hooks/useVideoCanvasRenderer';
import {NormalVideoRenderer} from './video_renderers/NormalVideoRenderer';
import {ReducedDetailVideoRenderer} from './video_renderers/ReducedDetailVideoRenderer';

const styles = stylex.create({
  canvas: {
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
});

interface VideoCanvasOverlayProps {
  videoReducedDetailIntensity: number;
  scaledHeight: number;
  scaledWidth: number;
  video: HTMLVideoElement | null;
  filterStyles?: {filter: string; opacity: string};
}

/**
 * VideoCanvasOverlay renders video content to a canvas overlay, with support for both
 * normal video playback and reduced detail filtering based on the videoReducedDetailIntensity setting.
 *
 * When videoReducedDetailIntensity > 0: Uses ReducedDetailVideoRenderStrategy
 * When videoReducedDetailIntensity = 0: Uses NormalVideoRenderStrategy
 */
export default function VideoCanvasOverlay({
  videoReducedDetailIntensity,
  scaledHeight = 0,
  scaledWidth = 0,
  video,
  filterStyles,
}: VideoCanvasOverlayProps): React.ReactElement {
  // Create renderers as regular state/memoized values instead of refs
  const normalRenderer = useMemo(() => new NormalVideoRenderer(), []);
  const reducedDetailRenderer = useMemo(
    () => new ReducedDetailVideoRenderer(videoReducedDetailIntensity),
    [videoReducedDetailIntensity],
  );

  // Update intensity whenever it changes
  useEffect(() => {
    if (videoReducedDetailIntensity > 0) {
      reducedDetailRenderer.updateIntensity(videoReducedDetailIntensity);
    }
  }, [videoReducedDetailIntensity, reducedDetailRenderer]);

  // Select the appropriate renderer based on intensity
  const renderer = useMemo(() => {
    if (videoReducedDetailIntensity > 0) {
      return reducedDetailRenderer;
    } else {
      return normalRenderer;
    }
  }, [videoReducedDetailIntensity, normalRenderer, reducedDetailRenderer]);

  const {canvasRef} = useVideoCanvasRenderer({
    video,
    renderer,
    scaledHeight,
    scaledWidth,
  });

  return (
    <canvas
      className={stylex.props(styles.canvas).className}
      height={scaledHeight}
      width={scaledWidth}
      style={{
        ...filterStyles,
        height: scaledHeight,
        width: scaledWidth,
      }}
      ref={canvasRef}
    />
  );
}
