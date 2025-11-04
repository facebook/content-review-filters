/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import {useContentReviewFilterGlobalPreferences} from '../ContentReviewFilterGlobalPreferenceContext';
import {MenuItem} from './MenuItem';
import {Toggle} from './Toggle';
import {Slider} from './Slider';

const styles = stylex.create({
  dropdown: {
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderRadius: '8px',
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    minWidth: '300px',
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: '100%',
    zIndex: 1000,
  },
  header: {
    backgroundColor: '#f8f9fa',
    borderBottomColor: '#f0f0f0',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    padding: '16px',
  },
  title: {
    color: '#333',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
  },
  tabs: {
    borderBottomColor: '#f0f0f0',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    display: 'flex',
  },
  tab: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderBottomStyle: 'solid',
    borderBottomWidth: '2px',
    borderStyle: 'none',
    borderWidth: 0,
    color: '#666',
    cursor: 'pointer',
    flex: 1,
    fontSize: '14px',
    outline: 'none',
    paddingBlock: '12px',
    paddingInline: '16px',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#f8f9fa',
    },
  },
  tabActive: {
    borderBottomColor: '#2196F3',
    color: '#2196F3',
  },
  content: {
    maxHeight: '400px',
    overflowY: 'auto',
  },
  section: {
    paddingBlock: '8px',
    paddingInline: '0',
  },
  harmTypeSelector: {
    backgroundColor: '#f8f9fa',
    borderBottomColor: '#f0f0f0',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    paddingBlock: '12px',
    paddingInline: '16px',
  },
  harmTypeLabel: {
    color: '#666',
    display: 'block',
    fontSize: '12px',
    marginBottom: '4px',
  },
  harmTypeSelect: {
    borderColor: '#ddd',
    borderRadius: '4px',
    borderStyle: 'solid',
    borderWidth: '1px',
    fontSize: '14px',
    paddingBlock: '4px',
    paddingInline: '8px',
    width: '100%',
  },
});

type TabType = 'images' | 'videos';

export type PreferencesDropdownProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function PreferencesDropdown({
  isOpen,
  onClose,
}: PreferencesDropdownProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('images');
  const [selectedHarmType, setSelectedHarmType] = React.useState('DEFAULT');
  const {preferences, updatePreference} =
    useContentReviewFilterGlobalPreferences();

  const harmTypes = Object.keys(preferences);
  const currentSettings = preferences[selectedHarmType];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('[data-preferences-dropdown]')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSliderChange = (
    setting: keyof typeof currentSettings,
    value: number,
  ) => {
    updatePreference(setting, value, selectedHarmType);
  };

  const handleToggleChange = (
    setting: keyof typeof currentSettings,
    value: boolean,
  ) => {
    updatePreference(setting, value, selectedHarmType);
  };

  return (
    <div {...stylex.props(styles.dropdown)} data-preferences-dropdown>
      <div {...stylex.props(styles.header)}>
        <h3 {...stylex.props(styles.title)}>Content filter preferences</h3>
      </div>

      <div {...stylex.props(styles.harmTypeSelector)}>
        <label {...stylex.props(styles.harmTypeLabel)}>Content Type</label>
        <select
          {...stylex.props(styles.harmTypeSelect)}
          value={selectedHarmType}
          onChange={e => setSelectedHarmType(e.target.value)}>
          {harmTypes.map(harmType => (
            <option key={harmType} value={harmType}>
              {harmType === 'DEFAULT' ? 'General Content' : harmType}
            </option>
          ))}
        </select>
      </div>

      <div {...stylex.props(styles.tabs)}>
        <button
          {...stylex.props(
            styles.tab,
            activeTab === 'images' && styles.tabActive,
          )}
          onClick={() => setActiveTab('images')}>
          Images
        </button>
        <button
          {...stylex.props(
            styles.tab,
            activeTab === 'videos' && styles.tabActive,
          )}
          onClick={() => setActiveTab('videos')}>
          Videos
        </button>
      </div>

      <div {...stylex.props(styles.content)}>
        {activeTab === 'images' && (
          <div {...stylex.props(styles.section)}>
            <MenuItem label="Blur">
              <Slider
                value={currentSettings.imageBlur}
                onChange={value => handleSliderChange('imageBlur', value)}
              />
            </MenuItem>
            <MenuItem label="Transparency">
              <Slider
                value={currentSettings.imageTransparency}
                onChange={value =>
                  handleSliderChange('imageTransparency', value)
                }
              />
            </MenuItem>
            <MenuItem label="Reduced Detail">
              <Slider
                value={currentSettings.imageReducedDetail}
                onChange={value =>
                  handleSliderChange('imageReducedDetail', value)
                }
              />
            </MenuItem>
            <MenuItem label="Grayscale">
              <Toggle
                checked={currentSettings.imageGrayscale}
                onChange={value => handleToggleChange('imageGrayscale', value)}
              />
            </MenuItem>
            <MenuItem label="Sepia">
              <Toggle
                checked={currentSettings.imageSepia}
                onChange={value => handleToggleChange('imageSepia', value)}
              />
            </MenuItem>
            <MenuItem label="Warning Screen">
              <Toggle
                checked={currentSettings.imageWarningScreen}
                onChange={value =>
                  handleToggleChange('imageWarningScreen', value)
                }
              />
            </MenuItem>
          </div>
        )}

        {activeTab === 'videos' && (
          <div {...stylex.props(styles.section)}>
            <MenuItem label="Blur">
              <Slider
                value={currentSettings.videoBlur}
                onChange={value => handleSliderChange('videoBlur', value)}
              />
            </MenuItem>
            <MenuItem label="Transparency">
              <Slider
                value={currentSettings.videoTransparency}
                onChange={value =>
                  handleSliderChange('videoTransparency', value)
                }
              />
            </MenuItem>
            <MenuItem label="Reduced Detail">
              <Slider
                value={currentSettings.videoReducedDetail}
                onChange={value =>
                  handleSliderChange('videoReducedDetail', value)
                }
              />
            </MenuItem>
            <MenuItem label="Grayscale">
              <Toggle
                checked={currentSettings.videoGrayscale}
                onChange={value => handleToggleChange('videoGrayscale', value)}
              />
            </MenuItem>
            <MenuItem label="Sepia">
              <Toggle
                checked={currentSettings.videoSepia}
                onChange={value => handleToggleChange('videoSepia', value)}
              />
            </MenuItem>
            <MenuItem label="Warning Screen">
              <Toggle
                checked={currentSettings.videoWarningScreen}
                onChange={value =>
                  handleToggleChange('videoWarningScreen', value)
                }
              />
            </MenuItem>
            <MenuItem label="Playback Speed">
              <Slider
                value={currentSettings.videoPlaybackSpeed}
                onChange={value =>
                  handleSliderChange('videoPlaybackSpeed', value)
                }
                min={0.25}
                max={10}
                step={0.25}
              />
            </MenuItem>
            <MenuItem label="Jump Forward (s)">
              <Slider
                value={currentSettings.videoJumpForwardLength}
                onChange={value =>
                  handleSliderChange('videoJumpForwardLength', value)
                }
                min={1}
                max={30}
                step={1}
              />
            </MenuItem>
            <MenuItem label="Jump Backward (s)">
              <Slider
                value={currentSettings.videoJumpBackwardLength}
                onChange={value =>
                  handleSliderChange('videoJumpBackwardLength', value)
                }
                min={1}
                max={30}
                step={1}
              />
            </MenuItem>
            <MenuItem label="Auto Mute">
              <Toggle
                checked={currentSettings.autoMute}
                onChange={value => handleToggleChange('autoMute', value)}
              />
            </MenuItem>
          </div>
        )}
      </div>
    </div>
  );
}
