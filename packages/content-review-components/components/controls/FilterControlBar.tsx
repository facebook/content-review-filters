/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as stylex from '@stylexjs/stylex';
import React, {useState} from 'react';
import {useContentReviewFilterSingleMediaContext} from '../../ContentReviewFilterSingleMediaContext';
import BlurIcon from './icons/BlurIcon';
import FlipIcon from './icons/FlipIcon';
import GrayscaleIcon from './icons/GrayscaleIcon';
import ReducedDetailIcon from './icons/ReducedDetailIcon';
import RotateIcon from './icons/RotateIcon';
import SepiaIcon from './icons/SepiaIcon';
import TransparencyIcon from './icons/TransparencyIcon';

const styles = stylex.create({
  toolbar: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '4px',
    display: 'flex',
    gap: '8px',
    left: '8px',
    padding: '8px',
    position: 'absolute',
    top: '8px',
    zIndex: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    height: '32px',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    width: '32px',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
  buttonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  icon: {
    fill: 'white',
    height: '18px',
    width: '18px',
  },
  iconActive: {
    fill: '#3b82f6', // Blue color for active state
    height: '18px',
    width: '18px',
  },
  tooltip: {
    position: 'relative',
  },
  tooltipText: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: '4px',
    bottom: '40px',
    color: 'white',
    fontSize: '12px',
    left: '50%',
    opacity: 0,
    paddingBlock: '4px',
    paddingInline: '8px',
    pointerEvents: 'none',
    position: 'absolute',
    transform: 'translateX(-50%)',
    transition: 'opacity 0.2s ease, visibility 0.2s ease',
    visibility: 'hidden',
    whiteSpace: 'nowrap',
    zIndex: 1000,
  },
  tooltipVisible: {
    opacity: 1,
    visibility: 'visible',
  },
});

interface FilterControlBarProps {
  flipped?: boolean;
  rotation?: number;
  onFlippedChange?: (flipped: boolean) => void;
  onRotationChange?: (rotation: number) => void;
}

const FilterButton = ({
  tooltip,
  children,
  active,
  onClick,
  onMouseEnter,
  onMouseLeave,
  hoveredTooltip,
}: {
  tooltip: string;
  children: React.ReactNode;
  active: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onMouseEnter: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onMouseLeave: React.MouseEventHandler<HTMLButtonElement> | undefined;
  hoveredTooltip: string | null;
}) => (
  <div {...stylex.props(styles.tooltip)}>
    <button
      {...stylex.props(styles.button, active && styles.buttonActive)}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={tooltip}>
      {children}
    </button>
    <div
      {...stylex.props(
        styles.tooltipText,
        hoveredTooltip === tooltip && styles.tooltipVisible,
      )}>
      {tooltip}
    </div>
  </div>
);

export default function FilterControlBar({
  flipped = false,
  rotation = 0,
  onFlippedChange,
  onRotationChange,
}: FilterControlBarProps) {
  const {settings, updateSettings} = useContentReviewFilterSingleMediaContext();
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  const isBlurred = settings.blur > 0;
  const hasTransparency = settings.transparency > 0;
  const isReducedDetail = settings.reducedDetail > 0;

  const toggleFilter = (filter: string) => {
    switch (filter) {
      case 'grayscale':
        updateSettings('isGrayscaleEnabled', !settings.isGrayscaleEnabled);
        break;
      case 'blur':
        updateSettings('blur', isBlurred ? 0 : 0.5);
        break;
      case 'transparency':
        updateSettings('transparency', hasTransparency ? 0 : 0.5);
        break;
      case 'sepia':
        updateSettings('isSepiaEnabled', !settings.isSepiaEnabled);
        break;
      case 'rotated':
        onRotationChange?.(rotation + 90);
        break;
      case 'reducedDetail':
        updateSettings('reducedDetail', isReducedDetail ? 0 : 0.5);
        break;
      case 'flipped':
        onFlippedChange?.(!flipped);
        break;
    }
  };

  return (
    <div {...stylex.props(styles.toolbar)}>
      <FilterButton
        tooltip="Toggle Grayscale"
        active={settings.isGrayscaleEnabled}
        onClick={() => toggleFilter('grayscale')}
        onMouseEnter={() => setHoveredTooltip('Toggle Grayscale')}
        onMouseLeave={() => setHoveredTooltip(null)}
        hoveredTooltip={hoveredTooltip}>
        <GrayscaleIcon
          {...stylex.props(
            settings.isGrayscaleEnabled ? styles.iconActive : styles.icon,
          )}
        />
      </FilterButton>

      <FilterButton
        tooltip="Toggle Blur"
        active={isBlurred}
        onClick={() => toggleFilter('blur')}
        onMouseEnter={() => setHoveredTooltip('Toggle Blur')}
        onMouseLeave={() => setHoveredTooltip(null)}
        hoveredTooltip={hoveredTooltip}>
        <BlurIcon
          {...stylex.props(isBlurred ? styles.iconActive : styles.icon)}
        />
      </FilterButton>

      <FilterButton
        tooltip="Toggle Transparency"
        active={hasTransparency}
        onClick={() => toggleFilter('transparency')}
        onMouseEnter={() => setHoveredTooltip('Toggle Transparency')}
        onMouseLeave={() => setHoveredTooltip(null)}
        hoveredTooltip={hoveredTooltip}>
        <TransparencyIcon
          {...stylex.props(hasTransparency ? styles.iconActive : styles.icon)}
        />
      </FilterButton>

      <FilterButton
        tooltip="Toggle Sepia"
        active={settings.isSepiaEnabled}
        onClick={() => toggleFilter('sepia')}
        onMouseEnter={() => setHoveredTooltip('Toggle Sepia')}
        onMouseLeave={() => setHoveredTooltip(null)}
        hoveredTooltip={hoveredTooltip}>
        <SepiaIcon
          {...stylex.props(
            settings.isSepiaEnabled ? styles.iconActive : styles.icon,
          )}
        />
      </FilterButton>

      <FilterButton
        tooltip="Reduced Detail"
        active={isReducedDetail}
        onClick={() => toggleFilter('reducedDetail')}
        onMouseEnter={() => setHoveredTooltip('Reduced Detail')}
        onMouseLeave={() => setHoveredTooltip(null)}
        hoveredTooltip={hoveredTooltip}>
        <ReducedDetailIcon
          {...stylex.props(isReducedDetail ? styles.iconActive : styles.icon)}
        />
      </FilterButton>

      <FilterButton
        tooltip="Flip Horizontal"
        active={flipped}
        onClick={() => toggleFilter('flipped')}
        onMouseEnter={() => setHoveredTooltip('Flip Horizontal')}
        onMouseLeave={() => setHoveredTooltip(null)}
        hoveredTooltip={hoveredTooltip}>
        <FlipIcon
          {...stylex.props(flipped ? styles.iconActive : styles.icon)}
        />
      </FilterButton>

      <FilterButton
        tooltip="Rotate"
        active={false}
        onClick={() => toggleFilter('rotated')}
        onMouseEnter={() => setHoveredTooltip('Rotate')}
        onMouseLeave={() => setHoveredTooltip(null)}
        hoveredTooltip={hoveredTooltip}>
        <RotateIcon {...stylex.props(styles.icon)} />
      </FilterButton>
    </div>
  );
}
