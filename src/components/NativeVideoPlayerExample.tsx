/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useRef} from 'react';
import {
  ContentFilteredVideoWrapper,
  useContentReviewFilterMediaInitialSettings,
} from '../../packages/content-review-components/ContentReviewComponents';
import {ContentReviewFilterSingleMediaContextProvider} from '../../packages/content-review-components/ContentReviewFilterSingleMediaContext';
import useImperativeHandleForHTMLVideoPlayer from '../../packages/content-review-components/hooks/useImperativeHandleForHTMLVideoPlayer';
import * as React from 'react';

export default function NativeVideoPlayerExample() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imperativeHandleRef = useImperativeHandleForHTMLVideoPlayer(videoRef);

  // Use the hook to get initial settings from global context
  // This will use the DEFAULT harm type since no harmType is specified
  const singleMediaSettings = useContentReviewFilterMediaInitialSettings(
    undefined,
    'video',
  );

  return (
    <ContentReviewFilterSingleMediaContextProvider
      initialSettings={singleMediaSettings}>
      <ContentFilteredVideoWrapper
        videoPlayerImperativeRef={imperativeHandleRef}>
        <video
          width="400"
          controls
          ref={videoRef}
          style={{filter: 'blur(10px)'}}>
          <source src="example_video.mp4" type="video/mp4" />
        </video>
      </ContentFilteredVideoWrapper>
    </ContentReviewFilterSingleMediaContextProvider>
  );
}
