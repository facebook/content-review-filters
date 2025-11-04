/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useRef, useState} from 'react';
import {useContentReviewFilterSingleMediaContext} from '../ContentReviewFilterSingleMediaContext';
import {getFilterStyles} from '../FilterPreferenceUtils';
import WarningScreen from '../internal-components/WarningScreen';
import ReducedDetailImageOverlay from './ReducedDetailImageOverlay';

interface ContentFilteredImageWrapperProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  flipped?: boolean;
  rotation?: number;
  caption?: string | null;
  isHovered?: boolean;
}

/**
 * This component applies content filters to an image based on single media context.
 * It wraps the image element and applies the appropriate filters and overlays.
 */
export default function ContentFilteredImageWrapper({
  flipped = false,
  rotation = 0,
  caption,
  isHovered = false,
  ...imgProps
}: ContentFilteredImageWrapperProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageDimensions, setImageDimensions] = useState({width: 0, height: 0});
  const {settings} = useContentReviewFilterSingleMediaContext();

  // Update dimensions when image loads or resizes
  useEffect(() => {
    const imgEl = imageRef.current;
    if (!imgEl) return;

    const updateDimensions = () => {
      const newWidth = imgEl.offsetWidth;
      const newHeight = imgEl.offsetHeight;

      // Only update if we have valid dimensions
      if (newWidth > 0 && newHeight > 0) {
        setImageDimensions({
          width: newWidth,
          height: newHeight,
        });
      }
    };

    // Update dimensions when image loads
    imgEl.addEventListener('load', updateDimensions);

    // Initial dimension update if image is already loaded
    if (imgEl.complete) {
      updateDimensions();
    }

    // Use ResizeObserver for resize tracking, fallback to window resize for older browsers
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(imgEl);
    } else {
      // Fallback for browsers without ResizeObserver support
      window.addEventListener('resize', updateDimensions);
    }

    return () => {
      imgEl.removeEventListener('load', updateDimensions);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', updateDimensions);
      }
    };
  }, []);

  const {
    blur,
    transparency,
    isGrayscaleEnabled,
    isSepiaEnabled,
    reducedDetail,
    isWarningScreenActive,
  } = settings;

  // Show warning screen if active and not hovered
  const warningScreenOverlay =
    isWarningScreenActive && !isHovered ? (
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
          caption={caption || settings.caption}
        />
      </div>
    ) : null;

  const filterStyles = getFilterStyles(
    blur > 0,
    blur,
    isGrayscaleEnabled,
    transparency > 0,
    transparency,
    isSepiaEnabled,
  );

  const isReducedDetailEnabled = reducedDetail > 0;

  return (
    <div style={{...filterStyles, position: 'relative'}}>
      {warningScreenOverlay}
      <img {...imgProps} ref={imageRef} />
      {isReducedDetailEnabled && (
        <ReducedDetailImageOverlay
          filterEnabled={isReducedDetailEnabled}
          flipped={flipped}
          imageRef={imageRef}
          intensity={reducedDetail}
          rotation={rotation}
          scaledHeight={imageDimensions.height}
          scaledWidth={imageDimensions.width}
        />
      )}
    </div>
  );
}
