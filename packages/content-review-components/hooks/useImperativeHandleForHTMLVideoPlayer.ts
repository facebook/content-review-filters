/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useImperativeHandle, useRef} from 'react';
import type {IGenericVideoPlayerHandles} from '../components/ContentFilteredVideoWrapper';

/**
 * Helper hook to create an imperative handle for an HTML video player.
 *
 * This hook adds imperative handles for methods depended on by ContentFilteredVideoPlayer to a ref to an HTML video element.
 * If you are using a custom video player, you'll need to write your own version of this hook that takes a ref to your custom video player and
 * implements all of these same methods using your own video player's API.
 *
 * The wrapper component depends on these handles rather than the underlying HTML video element properties so that it is compatible with any video player.
 *
 * @param {React.RefObject<HTMLVideoElement | null>} videoElementRef - A ref object pointing to the HTML video element.
 * @returns {React.RefObject<IGenericVideoPlayerHandles | null>} - A ref object containing the imperative handle methods.
 */

export default function useImperativeHandleForHTMLVideoPlayer(
  videoElementRef: React.RefObject<HTMLVideoElement | null>,
): React.RefObject<IGenericVideoPlayerHandles | null> {
  const imperativeHandleRef = useRef<IGenericVideoPlayerHandles | null>(null);
  useImperativeHandle(imperativeHandleRef, () => {
    return {
      // seekAbsolute(time: number) {
      //     if (videoElementRef.current == null){return;}
      //     videoElementRef.current.currentTime = time;
      // },
      setPlaybackRate(rate: number) {
        if (videoElementRef.current == null) {
          return;
        }
        videoElementRef.current.playbackRate = rate;
      },
      getVideoElement(): HTMLVideoElement | null {
        return videoElementRef.current;
      },
    };
  }, [videoElementRef]);
  return imperativeHandleRef;
}
