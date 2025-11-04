/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useCallback, useEffect, useRef} from 'react';

export interface VideoRenderer {
  render(video: HTMLVideoElement, canvas2dCtx: CanvasRenderingContext2D): void;
}

interface UseVideoCanvasRendererProps {
  video: HTMLVideoElement | null;
  renderer: VideoRenderer;
  scaledHeight: number;
  scaledWidth: number;
}

/**
 * Custom hook that handles the video canvas rendering loop.
 * Abstracts away all the complexity of canvas management, video frame callbacks,
 * and cleanup while allowing different renderers to be plugged in.
 */
export function useVideoCanvasRenderer({
  video,
  renderer,
  scaledHeight,
  scaledWidth,
}: UseVideoCanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvas2dCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const requestCallbackIDRef = useRef<number | null>(null);
  const renderVideoFrameRef = useRef<(() => void) | null>(null);

  // Initialize 2D context
  useEffect(() => {
    if (canvasRef.current != null) {
      const canvas = canvasRef.current;
      canvas2dCtxRef.current = canvas.getContext('2d');
    }
  }, [canvasRef]);

  const clearCanvas = useCallback(() => {
    // Cancel any pending video frame callback
    if (
      video &&
      'cancelVideoFrameCallback' in video &&
      typeof video.cancelVideoFrameCallback === 'function' &&
      requestCallbackIDRef.current !== null
    ) {
      video.cancelVideoFrameCallback(requestCallbackIDRef.current);
    }
    // Clear the canvas
    if (canvas2dCtxRef.current != null) {
      const canvas2dCtx = canvas2dCtxRef.current;
      canvas2dCtx.clearRect(
        0,
        0,
        canvas2dCtx.canvas.width,
        canvas2dCtx.canvas.height,
      );
    }
  }, [video]);

  const renderVideoFrame = useCallback(() => {
    if (!video || !canvas2dCtxRef.current) {
      return;
    }

    if (video.paused || video.ended) {
      video.cancelVideoFrameCallback(requestCallbackIDRef.current ?? 0);
      return;
    }

    // Delegate to the provided renderer
    renderer.render(video, canvas2dCtxRef.current);

    // Schedule next frame using the ref to avoid closure issues
    if (renderVideoFrameRef.current) {
      requestCallbackIDRef.current = video.requestVideoFrameCallback(
        renderVideoFrameRef.current,
      );
    }
  }, [video, renderer]);

  // Update the ref whenever renderVideoFrame changes
  useEffect(() => {
    renderVideoFrameRef.current = renderVideoFrame;
  }, [renderVideoFrame]);

  const drawInitialFrame = useCallback(() => {
    if (!video || !canvas2dCtxRef.current) {
      return;
    }

    // Try to draw the first frame of the video if data is loaded
    if (video.readyState >= video.HAVE_CURRENT_DATA) {
      renderer.render(video, canvas2dCtxRef.current);
    } else {
      // Draw a black frame as fallback
      const canvas2dCtx = canvas2dCtxRef.current;
      canvas2dCtx.fillStyle = 'black';
      canvas2dCtx.fillRect(
        0,
        0,
        canvas2dCtx.canvas.width,
        canvas2dCtx.canvas.height,
      );
    }
  }, [video, renderer]);

  useEffect(() => {
    // Start the video rendering when video is available
    if (video != null) {
      video.addEventListener('play', renderVideoFrame);
      video.addEventListener('loadeddata', drawInitialFrame);
      video.addEventListener('loadedmetadata', drawInitialFrame);

      // Start rendering immediately if video is already playing
      if (!video.paused && !video.ended) {
        renderVideoFrame();
      } else {
        // Draw initial frame if video is paused but has data
        drawInitialFrame();
      }
    }

    // Cleanup on unmount or video change
    return () => {
      clearCanvas();
      if (video != null) {
        video.removeEventListener('play', renderVideoFrame);
        video.removeEventListener('loadeddata', drawInitialFrame);
        video.removeEventListener('loadedmetadata', drawInitialFrame);
      }
    };
  }, [video, renderVideoFrame, clearCanvas, drawInitialFrame]);

  return {
    canvasRef,
    scaledHeight,
    scaledWidth,
  };
}
