/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import {getReducedDetailFilter} from '../ReducedDetailFilterSingleton';
import {useFilterRenderConfig} from '../FilterRenderConfigContext';
import ShaderProperties from '../reduced_detail/surgical/ShaderProperties';
import {getShaderParamsFromIntensity} from '../reduced_detail/ReducedDetailFilterUtils';

import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  canvas: {
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    transformOrigin: 'top right',
    width: '100%',
  },
  flipped: {
    transform: 'scaleX(-1)',
    transformOrigin: 'center',
  },
  blur: {
    backdropFilter: 'blur(20px)',
  },
});

interface ReducedDetailImageOverlayProps {
  filterEnabled: boolean;
  flipped?: boolean;
  imageRef: React.RefObject<HTMLElement | null>;
  intensity: number;
  rotation: number;
  scaledHeight?: number;
  scaledWidth?: number;
}

export default function ReducedDetailImageOverlay({
  filterEnabled,
  flipped = false,
  imageRef,
  intensity,
  rotation,
  scaledHeight,
  scaledWidth,
}: ReducedDetailImageOverlayProps): React.ReactElement {
  const localImageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvas2dCtx = useRef<CanvasRenderingContext2D | null>(null);
  const [isEffectLoading, setIsEffectLoading] = useState(true);
  const [isFilterUnavailable, setIsFilterUnavailable] = useState(false);
  const {onReducedDetailUnavailable} = useFilterRenderConfig();

  // Kept in a ref so an inline callback from the app does not rebuild the
  // render callbacks on every render.
  const onUnavailableRef = useRef(onReducedDetailUnavailable);
  useEffect(() => {
    onUnavailableRef.current = onReducedDetailUnavailable;
  }, [onReducedDetailUnavailable]);

  // At most one signal per mounted media, never one per frame.
  const hasSignaledUnavailable = useRef(false);
  const signalUnavailable = useCallback(() => {
    setIsFilterUnavailable(true);
    if (hasSignaledUnavailable.current) {
      return;
    }
    hasSignaledUnavailable.current = true;
    onUnavailableRef.current?.();
  }, []);

  const clearCanvas = useCallback(() => {
    if (canvas2dCtx.current != null) {
      const ctx2d = canvas2dCtx.current;
      ctx2d.clearRect(0, 0, ctx2d.canvas.width, ctx2d.canvas.height);
    }
  }, [canvas2dCtx]);

  const runFilter = useCallback(() => {
    if (
      filterEnabled &&
      localImageRef.current != null &&
      canvas2dCtx.current != null
    ) {
      const filter = getReducedDetailFilter();
      if (filter === null) {
        // No backend to reduce the detail with: leave the canvas empty so the
        // overlay keeps covering the image instead of revealing it.
        clearCanvas();
        signalUnavailable();
        return;
      }
      filter.filter(localImageRef.current, canvas2dCtx.current);
    } else if (!filterEnabled && canvas2dCtx.current != null) {
      clearCanvas();
    }
  }, [filterEnabled, clearCanvas, signalUnavailable]);

  useEffect(() => {
    if (
      imageRef.current !== null &&
      imageRef.current instanceof HTMLImageElement
    ) {
      // Clone imageRef from props into a local ref to modify onload and cross origin
      const img = imageRef.current;
      localImageRef.current = img.cloneNode(true) as HTMLImageElement;
      localImageRef.current.onload = runFilter;
      localImageRef.current.onerror = () => {
        clearCanvas();
        setIsEffectLoading(false);
      };
      localImageRef.current.crossOrigin = 'anonymous';
    }
  }, [imageRef, runFilter, clearCanvas]);

  // Initialize 2d context to draw images from the WebGL filter
  // to the canvas returned in this overlay component
  useEffect(() => {
    if (canvasRef.current !== null) {
      canvas2dCtx.current = canvasRef.current.getContext('2d');
    }
  }, [canvasRef]);

  useEffect(() => {
    const {levelOfAbstraction, edgeEnhancement} =
      getShaderParamsFromIntensity(intensity);
    ShaderProperties.setLoA(levelOfAbstraction);
    ShaderProperties.setEE(edgeEnhancement);
    if (
      localImageRef.current != null &&
      localImageRef.current.complete &&
      canvasRef.current !== null
    ) {
      // Run filter and update loading state asynchronously
      Promise.resolve().then(() => {
        runFilter();
        setIsEffectLoading(false);
      });
    }
  }, [intensity, runFilter, imageRef]);

  const height = rotation % 2 === 1 ? scaledWidth : scaledHeight;
  const width = rotation % 2 === 1 ? scaledHeight : scaledWidth;

  return (
    <canvas
      className={
        stylex.props(
          styles.canvas,
          flipped && styles.flipped,
          // While the effect or the image is loading, make sure to blur it so the reviewer doesn't see a flash of graphic content.
          // The same cover stays on for good when the filter is unavailable.
          filterEnabled &&
            (isEffectLoading || isFilterUnavailable) &&
            styles.blur,
        ).className
      }
      height={height}
      width={width}
      style={{height, width}}
      ref={canvasRef}
    />
  );
}
