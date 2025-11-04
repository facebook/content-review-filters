/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import {useCallback, useImperativeHandle, useRef, useState} from 'react';
import type {ISkipControlsHandles} from '../components/ContentFilteredVideoWrapper';
import {FilterControlBar} from '../ContentReviewComponents';
import {
  ContentReviewFilterSingleMediaContextProvider,
  useContentReviewFilterSingleMediaContext,
} from '../ContentReviewFilterSingleMediaContext';
import {useContentReviewFilterMediaInitialSettings} from '../hooks/useContentReviewFilterMediaInitialSettings';
import useImperativeHandleForHTMLVideoPlayer from '../hooks/useImperativeHandleForHTMLVideoPlayer';
import ContentFilteredVideoWrapper from './ContentFilteredVideoWrapper';

const styles = stylex.create({
  video: {
    overflow: 'visible',
    translate: '-200000px 0',
    '::-webkit-media-controls': {
      translate: '200000px 0',
    },
  },
});

enum SkipDirection {
  Backward,
  Forward,
}

interface ContentFilteredVideoProps
  extends React.VideoHTMLAttributes<HTMLVideoElement> {
  harmType?: string | number;
  caption?: string | null;
  filterControls?: boolean;
}
interface ContentFilteredVideoInnerProps
  extends React.VideoHTMLAttributes<HTMLVideoElement> {
  filterControls?: boolean;
}

/**
 * Internal component that creates a video player with controls based on single media context.
 */
function ContentFilteredVideoInner({...props}: ContentFilteredVideoInnerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imperativeHandleRef = useImperativeHandleForHTMLVideoPlayer(videoRef);
  const {settings, updateSettings: _updateSettings} =
    useContentReviewFilterSingleMediaContext();
  const [isHovered, setIsHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [rotation, setRotation] = useState(0);

  const videoProps = {
    ...props,
    muted: settings.autoMute,
  };

  // This component now has access to _updateSettings for controls
  // For example, a button could call: _updateSettings('blur', 0.5)
  // or _updateSettings('isWarningScreenActive', false)

  // Since this component is a light wrapper around HTML video element that needs to add a skip forward and back button,
  // we can set those here.
  const [skipForwardLength, setSkipForwardLength] = useState(0);
  const [skipBackwardLength, setSkipBackwardLength] = useState(0);
  const skipControlsRef = useRef<ISkipControlsHandles | null>(null);
  useImperativeHandle(skipControlsRef, (): ISkipControlsHandles => {
    return {
      setSkipForwardLength,
      setSkipBackwardLength,
    };
  }, [setSkipForwardLength, setSkipBackwardLength]);

  const onSkip = useCallback(
    (direction: SkipDirection) => {
      if (videoRef.current == null) {
        return;
      }
      const currentPosition = videoRef.current.currentTime;

      const skipLength =
        direction === SkipDirection.Forward
          ? skipForwardLength
          : skipBackwardLength * -1;
      if (skipLength === 0) {
        return;
      }
      const newTime = currentPosition + skipLength;
      videoRef.current.currentTime = newTime;
    },
    [videoRef, skipForwardLength, skipBackwardLength],
  );

  // Apply transform style for rotation and flipping
  const transformStyle = {
    transform: `rotate(${rotation}deg) ${flipped ? 'scaleX(-1)' : ''}`,
  };

  return (
    <div
      style={{position: 'relative', display: 'inline-block'}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div style={transformStyle}>
        <ContentFilteredVideoWrapper
          videoPlayerImperativeRef={imperativeHandleRef}
          skipControlsRef={skipControlsRef}
          isHovered={isHovered}>
          <video
            {...videoProps}
            {...stylex.props(styles.video)}
            ref={videoRef}
          />
        </ContentFilteredVideoWrapper>
      </div>
      {isHovered && props.filterControls && (
        <FilterControlBar
          flipped={flipped}
          rotation={rotation}
          onFlippedChange={setFlipped}
          onRotationChange={setRotation}
        />
      )}
      <div>
        <button onClick={() => onSkip(SkipDirection.Backward)}>
          Skip Backward ({skipBackwardLength}s)
        </button>
        <button onClick={() => onSkip(SkipDirection.Forward)}>
          Skip Forward ({skipForwardLength}s)
        </button>
      </div>
    </div>
  );
}

/**
 * This component is a demonstration of how you can create a custom video player using native browser controls that
 * uses the ContentFilteredVideoWrapper to apply the content filters and other video preferences.
 *
 * Uses a hack to hide the video element by moving it offscreen and then move the controls on top of a canvas
 * element that we control filters on.
 *
 * @param props
 * @returns
 */
export default function ContentFilteredVideo({
  harmType,
  caption,
  ...props
}: ContentFilteredVideoProps) {
  const singleMediaSettings = useContentReviewFilterMediaInitialSettings(
    harmType,
    'video',
    caption,
  );

  return (
    <ContentReviewFilterSingleMediaContextProvider
      initialSettings={singleMediaSettings}>
      <ContentFilteredVideoInner {...props} />
    </ContentReviewFilterSingleMediaContextProvider>
  );
}
