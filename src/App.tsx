/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as stylex from '@stylexjs/stylex';
import {
  ContentFilteredImage,
  ContentFilteredVideo,
  ContentReviewFilterGlobalPreferencesProvider,
} from '../packages/content-review-components/ContentReviewComponents';
import {useContentReviewFilterPreferencesFromLocalStorage} from '../packages/content-review-components/hooks/useContentReviewFilterPreferencesFromLocalStorage';
import NativeVideoPlayerExample from './components/NativeVideoPlayerExample';
import {NavigationBar} from './components/NavigationBar';

const styles = stylex.create({
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  card: {
    padding: '2em',
  },
});

function AppContent() {
  return (
    <>
      <div {...stylex.props(styles.wrapper)}>
        <h1>Content Review Filters</h1>
        <p>This is a demo of how to use the content review filters.</p>
        <div {...stylex.props(styles.card)}>
          <h2>Example Filtered Image (Default Harm Type)</h2>
          <p>
            This image uses the DEFAULT harm type with blur, transparency,
            grayscale, and reduced detail filters.
          </p>
          <ContentFilteredImage src="/example_image.jpg" width="400" />
        </div>

        <div {...stylex.props([styles.card, styles.wrapper])}>
          <h2>Example Warning Screen Applied To Image</h2>
          <p>
            This image uses the GRAPHIC harm type which shows a warning screen
            instead of filters.
          </p>
          <div style={{width: '400px', border: '1px solid #ccc'}}>
            <ContentFilteredImage
              src="/example_image.jpg"
              width="400"
              harmType="GRAPHIC"
              caption="This image may contain graphic content that could be disturbing to some viewers."
            />
          </div>
        </div>

        <div {...stylex.props(styles.card)}>
          <h2>Example Image with Interactive Filter Controls</h2>
          <p>
            <strong>Hover over the image below</strong> to see the filter
            control bar appear. The controls allow you to set content filters
            for a particular piece of media. When hovering, the warning screen
            (if any) will be hidden so you can interact with the image and
            controls.
          </p>
          <ContentFilteredImage
            src="/example_image.jpg"
            width="400"
            filterControls={true}
          />
        </div>

        <div {...stylex.props(styles.card)}>
          <h2>Example Filtered Video With Custom Video Component</h2>
          <p>
            Using a custom video component allows you to control play/pause and
            ensure the wrapper which applies styles only affects the innermost
            video, excluding the controls.
          </p>
          <ContentFilteredVideo filterControls={true} controls width="400">
            <source src="/example_video.mp4" type="video/mp4" />
          </ContentFilteredVideo>
          <h2>Another Example Filtered Video With Custom Video Component</h2>
          <p>
            Using a custom video component allows you to control play/pause and
            ensure the wrapper which applies styles only affects the innermost
            video, excluding the controls.
          </p>
          <ContentFilteredVideo controls width="400">
            <source src="/example_video_2.mp4" type="video/mp4" />
          </ContentFilteredVideo>
          <h2>
            Example Filtered Video Using Just Wrapper Component and HTML Video
          </h2>
          <p>
            Note that filters hide the controls here - hence our recommendation
            to use the wrapper inside a custom video component.
          </p>
          <NativeVideoPlayerExample />

          <h2>Example Video With Warning Screen (GRAPHIC Harm Type)</h2>
          <p>
            This video uses the GRAPHIC harm type which shows a video-specific
            warning screen instead of filters.
          </p>
          <div {...stylex.props([styles.card, styles.wrapper])}>
            <ContentFilteredVideo
              controls
              width="800"
              harmType="GRAPHIC"
              caption="This video may contain graphic content that could be disturbing to some viewers.">
              <source src="/example_video.mp4" type="video/mp4" />
            </ContentFilteredVideo>
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  // Initialize preferences with localStorage persistence
  const initialPreferences = useContentReviewFilterPreferencesFromLocalStorage({
    DEFAULT: {
      imageBlur: 0.2,
      imageTransparency: 0.2,
      imageGrayscale: true,
      imageSepia: false,
      imageReducedDetail: 0.5,
      imageWarningScreen: false,
      videoBlur: 0.5,
      videoTransparency: 0,
      videoGrayscale: true,
      videoReducedDetail: 1,
      videoSepia: false,
      videoWarningScreen: false,
      videoJumpForwardLength: 5,
      videoJumpBackwardLength: 5,
      videoPlaybackSpeed: 1.5,
      autoMute: false,
    },
    GRAPHIC: {
      imageBlur: 0,
      imageTransparency: 0,
      imageGrayscale: false,
      imageSepia: false,
      imageReducedDetail: 0,
      videoBlur: 0,
      videoTransparency: 0,
      videoGrayscale: false,
      videoReducedDetail: 0,
      videoSepia: false,
      videoWarningScreen: true,
      videoJumpForwardLength: 5,
      videoJumpBackwardLength: 5,
      videoPlaybackSpeed: 2.5,
      imageWarningScreen: true,
      autoMute: false,
    },
  });

  return (
    <>
      <ContentReviewFilterGlobalPreferencesProvider
        initialPreferences={initialPreferences}>
        <NavigationBar />
        <AppContent />
      </ContentReviewFilterGlobalPreferencesProvider>
    </>
  );
}

export default App;
