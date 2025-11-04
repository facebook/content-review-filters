/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useCallback, useEffect, useState} from 'react';

import {useContentReviewFilterSingleMediaContext} from '../ContentReviewFilterSingleMediaContext';
import {getFilterStyles} from '../FilterPreferenceUtils';
import WarningScreen from '../internal-components/WarningScreen';
import VideoCanvasOverlay from './VideoCanvasOverlay';

export interface IGenericVideoPlayerHandles {
  // If using our controls, when our control button is clicked we will skip forward
  // seekAbsolute(time: number): void;
  setPlaybackRate(rate: number): void;
  getVideoElement(): HTMLVideoElement | null;
  [key: string]: unknown;
}

export interface ISkipControlsHandles {
  // For custom video players, they need to the state of the forward and backward skip lengths, so they can trigger skip forward and backward using their own control buttons.
  // In this case, we just need to pass them the initial state once - so we need methods to do that.
  setSkipForwardLength(time: number): void;
  setSkipBackwardLength(time: number): void;
}

interface ContentFilteredVideoWrapperProps {
  children: React.ReactNode;
  videoPlayerImperativeRef: React.RefObject<IGenericVideoPlayerHandles | null>;
  skipControlsRef?: React.RefObject<ISkipControlsHandles | null>;
  isHovered?: boolean;
}

/**
 * This component wraps your own video player that already has controls and passes in the preference state to it.
 * @param param0
 * @returns
 */
export default function ContentFilteredVideoWrapper({
  children,
  videoPlayerImperativeRef,
  skipControlsRef,
  isHovered,
}: ContentFilteredVideoWrapperProps) {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null,
  );
  const [videoDimensions, setVideoDimensions] = useState({width: 0, height: 0});
  const {settings} = useContentReviewFilterSingleMediaContext();

  // Get video element from imperative ref and set up dimension tracking
  const findVideoElement = useCallback(() => {
    if (videoPlayerImperativeRef.current) {
      const videoEl = videoPlayerImperativeRef.current.getVideoElement();
      if (videoEl && videoEl !== videoElement) {
        setVideoElement(videoEl);

        const updateDimensions = () => {
          setVideoDimensions({
            width: videoEl.offsetWidth,
            height: videoEl.offsetHeight,
          });
        };

        // Update dimensions when video loads or resizes
        videoEl.addEventListener('loadedmetadata', updateDimensions);
        videoEl.addEventListener('resize', updateDimensions);
        videoEl.crossOrigin = 'anonymous';
        window.addEventListener('resize', updateDimensions);

        // Initial dimension update
        updateDimensions();

        return () => {
          videoEl.removeEventListener('loadedmetadata', updateDimensions);
          videoEl.removeEventListener('resize', updateDimensions);
          window.removeEventListener('resize', updateDimensions);
        };
      }
    }
  }, [videoElement, videoPlayerImperativeRef]);

  useEffect(() => {
    findVideoElement();
  }, [findVideoElement]);

  useEffect(() => {
    if (skipControlsRef?.current != null) {
      skipControlsRef.current.setSkipForwardLength(
        settings.videoJumpForwardLength,
      );
    }
  }, [settings.videoJumpForwardLength, skipControlsRef]);

  useEffect(() => {
    if (skipControlsRef?.current != null) {
      skipControlsRef.current.setSkipBackwardLength(
        settings.videoJumpBackwardLength,
      );
    }
  }, [settings.videoJumpBackwardLength, skipControlsRef]);

  useEffect(() => {
    if (videoPlayerImperativeRef?.current != null) {
      videoPlayerImperativeRef.current.setPlaybackRate(
        settings.videoPlaybackSpeed,
      );
    }
  }, [settings.videoPlaybackSpeed, videoPlayerImperativeRef]);

  useCallback(() => {
    setVideoElement(prevEl => {
      if (prevEl) {
        prevEl.muted = settings.autoMute;
      }
      return prevEl;
    });
  }, [settings.autoMute]);

  const {
    blur,
    transparency,
    isGrayscaleEnabled,
    isSepiaEnabled,
    reducedDetail,
  } = settings;

  const filterStyles = getFilterStyles(
    blur > 0,
    blur,
    isGrayscaleEnabled,
    transparency > 0,
    transparency,
    isSepiaEnabled,
  );
  // Show warning screen if active and not hovered
  const warningScreenOverlay =
    settings.isWarningScreenActive && !isHovered ? (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}>
        <WarningScreen
          warningScreenType={settings.harmType}
          caption={settings.caption}
        />
      </div>
    ) : null;

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        width: videoDimensions.width || 'auto',
        height: videoDimensions.height || 'auto',
      }}>
      {videoElement && (
        <VideoCanvasOverlay
          videoReducedDetailIntensity={reducedDetail}
          scaledHeight={videoDimensions.height}
          scaledWidth={videoDimensions.width}
          video={videoElement}
          filterStyles={filterStyles}
        />
      )}
      {warningScreenOverlay}
      {children}
    </span>
  );
}
