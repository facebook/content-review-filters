/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as stylex from '@stylexjs/stylex';
import WarningIcon from './icons/WarningIcon';

const styles = stylex.create({
  root: {
    backgroundColor: '#f5f5f5',
    containerType: 'inline-size',
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },

  container: {
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },

  icon: {
    display: 'block',
    height: '72px',
    width: '72px',
  },

  iconMedium: {
    display: 'block',
    height: '56px',
    width: '56px',
  },

  iconSmall: {
    display: 'block',
    height: '40px',
    width: '40px',
  },

  textContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    justifyContent: 'center',
    textAlign: 'center',
  },

  heading: {
    color: '#212529',
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
  },

  message: {
    color: '#6c757d',
    fontSize: '14px',
    lineHeight: '1.4',
    margin: 0,
  },

  caption: {
    color: '#6c757d',
    fontSize: '12px',
    lineHeight: '1.3',
    margin: 0,
    maxWidth: '300px',
    wordBreak: 'break-word',
  },

  // Responsive styles using container queries
  hideOnXSContainer: {
    display: {
      default: 'flex',
      '@container (width < 64px)': 'none',
      '@container (height < 64px)': 'none',
    },
  },

  hideOnSmContainer: {
    display: {
      default: 'flex',
      '@container (width < 128px)': 'none',
      '@container (height < 128px)': 'none',
    },
  },

  hideOnMdContainer: {
    display: {
      default: 'block',
      '@container (width < 192px)': 'none',
      '@container (height < 192px)': 'none',
    },
  },

  hideOnMdButNotSmContainer: {
    display: {
      default: 'block',
      '@container (width >= 128px) and (width < 192px)': 'none',
      '@container (height >= 128px) and (height < 192px)': 'none',
    },
  },

  showOnMdOnly: {
    display: {
      default: 'none',
      '@container (width < 192px)': 'block',
    },
  },

  showOnLgOnly: {
    display: {
      default: 'none',
      '@container (width >= 192px)': 'block',
    },
  },
});

interface ResponsiveWarningIconProps {
  forceSmall?: boolean;
}

function ResponsiveWarningIcon({
  forceSmall = false,
}: ResponsiveWarningIconProps) {
  const iconStyle = forceSmall ? styles.iconMedium : styles.icon;
  const mediumIconStyle = forceSmall ? styles.iconSmall : styles.iconMedium;

  return (
    <>
      {/* Medium container (show for width < 192px) */}
      <div {...stylex.props(styles.showOnMdOnly)}>
        <WarningIcon {...stylex.props(mediumIconStyle)} />
      </div>

      {/* Large container (show for width >= 192px) */}
      <div {...stylex.props(styles.showOnLgOnly)}>
        <WarningIcon {...stylex.props(iconStyle)} />
      </div>
    </>
  );
}

interface WarningScreenProps {
  /**
   * Optional caption text to display below the warning message
   */
  caption?: string | null;

  /**
   * Specific harm type of warning to display
   */
  warningScreenType?: string | null;

  /**
   * Width of the underlying media (for size inheritance)
   */
  mediaWidth?: number;

  /**
   * Height of the underlying media (for size inheritance)
   */
  mediaHeight?: number;
}

/**
 * WarningScreen component displays a warning overlay for sensitive content.
 * It provides responsive design that adapts to different container sizes
 * and supports optional captions with AI generation indicators.
 */
export default function WarningScreen({
  caption = null,
  warningScreenType,
  mediaWidth,
  mediaHeight,
}: WarningScreenProps) {
  const hasCaption = caption != null && caption !== '';
  const warningMessage =
    warningScreenType != null
      ? `Possible ${warningScreenType}.`
      : 'This media may contain sensitive content.';

  // Create style object for size inheritance
  const sizeInheritanceStyle =
    mediaWidth != null &&
    mediaHeight != null &&
    mediaWidth > 0 &&
    mediaHeight > 0
      ? {width: mediaWidth, height: mediaHeight}
      : undefined;

  return (
    <div {...stylex.props(styles.root)} style={sizeInheritanceStyle}>
      <div {...stylex.props(styles.container)}>
        <ResponsiveWarningIcon forceSmall={hasCaption} />

        <div
          {...stylex.props([styles.textContainer, styles.hideOnXSContainer])}>
          <div {...stylex.props(styles.hideOnMdContainer)}>
            <h2 {...stylex.props(styles.heading)}>Warning</h2>
          </div>

          <div
            {...stylex.props(
              hasCaption
                ? styles.hideOnMdButNotSmContainer
                : styles.hideOnXSContainer,
            )}>
            <p {...stylex.props(styles.message)}>{warningMessage}</p>
          </div>

          {hasCaption && (
            <div {...stylex.props(styles.hideOnSmContainer)}>
              <p {...stylex.props(styles.caption)}>{caption}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
