/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useState} from 'react';
import {
  ContentReviewFilterSingleMediaContextProvider,
  useContentReviewFilterSingleMediaContext,
} from '../ContentReviewFilterSingleMediaContext';
import {useContentReviewFilterMediaInitialSettings} from '../hooks/useContentReviewFilterMediaInitialSettings';
import ContentFilteredImageWrapper from './ContentFilteredImageWrapper';
import FilterControlBar from './controls/FilterControlBar';

interface ContentFilteredImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  harmType?: string | number;
  filterControls?: boolean;
  flipped?: boolean;
  rotation?: number;
  caption?: string | null;
}

interface ContentFilteredImageInnerProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  flipped?: boolean;
  rotation?: number;
  filterControls?: boolean;
  caption?: string | null;
}

/**
 * Inner component for ContentFilteredImage that has access to the single media context
 * and can use the context mutator for controls if needed.
 */
function ContentFilteredImageInner(props: ContentFilteredImageInnerProps) {
  const {settings: _settings, updateSettings: _updateSettings} =
    useContentReviewFilterSingleMediaContext();
  const [flipped, setFlipped] = useState(props.flipped || false);
  const [rotation, setRotation] = useState(props.rotation || 0);
  const [isHovered, setIsHovered] = useState(false);

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
        <ContentFilteredImageWrapper {...props} isHovered={isHovered} />
      </div>
      {isHovered && props.filterControls && (
        <FilterControlBar
          flipped={flipped}
          rotation={rotation}
          onFlippedChange={setFlipped}
          onRotationChange={setRotation}
        />
      )}
    </div>
  );
}

/**
 * This component applies content filters to an image based on user preferences.
 * It handles blur, transparency, grayscale, sepia, and reduced detail filtering.
 *
 * @param props
 * @returns
 */
export default function ContentFilteredImage({
  harmType,
  caption,
  ...props
}: ContentFilteredImageProps) {
  const singleMediaSettings = useContentReviewFilterMediaInitialSettings(
    harmType,
    'image',
    caption,
  );

  return (
    <ContentReviewFilterSingleMediaContextProvider
      initialSettings={singleMediaSettings}>
      <ContentFilteredImageInner {...props} />
    </ContentReviewFilterSingleMediaContextProvider>
  );
}
