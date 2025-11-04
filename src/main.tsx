/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as stylex from '@stylexjs/stylex';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';

// Global styles converted from index.css
const globalStyles = stylex.create({
  root: {
    MozOsxFontSmoothing: 'grayscale',
    WebkitFontSmoothing: 'antialiased',
    backgroundColor: '#242424',
    color: 'rgba(255, 255, 255, 0.87)',
    colorScheme: 'light dark',
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontSynthesis: 'none',
    fontWeight: 400,
    lineHeight: 1.5,
    marginBlock: '0',
    marginInline: 'auto',
    maxWidth: 1280,
    padding: '2rem',
    textAlign: 'center',
    textRendering: 'optimizeLegibility',
    '@media (prefers-color-scheme: light)': {
      backgroundColor: '#ffffff',
      color: '#213547',
    },
  },
  body: {
    display: 'flex',
    justifyContent: 'center',
    margin: 0,
    minHeight: '100vh',
    minWidth: 320,
    placeItems: 'center',
  },
  link: {
    color: '#646cff',
    fontWeight: 500,
    textDecoration: 'inherit',
    ':hover': {
      color: '#535bf2',
    },
    '@media (prefers-color-scheme: light)': {
      ':hover': {
        color: '#747bff',
      },
    },
  },
  heading: {
    fontSize: '3.2em',
    lineHeight: 1.1,
  },
  button: {
    backgroundColor: '#1a1a1a',
    borderColor: 'transparent',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: '1px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '1em',
    fontWeight: 500,
    paddingBlock: '0.6em',
    paddingInline: '1.2em',
    transition: 'border-color 0.25s',
    ':hover': {
      borderColor: '#646cff',
    },
    ':focus': {
      outline: '4px auto -webkit-focus-ring-color',
    },
    ':focus-visible': {
      outline: '4px auto -webkit-focus-ring-color',
    },
    '@media (prefers-color-scheme: light)': {
      backgroundColor: '#f9f9f9',
    },
  },
});

// Apply global styles to document elements
const applyGlobalStyles = () => {
  const rootElement = document.documentElement;
  const bodyElement = document.body;

  // Apply root styles
  const rootClasses = stylex.props(globalStyles.root);
  if (rootClasses.className) {
    rootElement.className = rootClasses.className;
  }

  // Apply body styles
  const bodyClasses = stylex.props(globalStyles.body);
  if (bodyClasses.className) {
    bodyElement.className = bodyClasses.className;
  }

  // Apply styles to existing elements
  const links = document.querySelectorAll('a');
  const headings = document.querySelectorAll('h1');
  const buttons = document.querySelectorAll('button');

  links.forEach(link => {
    const linkClasses = stylex.props(globalStyles.link);
    if (linkClasses.className) {
      link.className = (link.className + ' ' + linkClasses.className).trim();
    }
  });

  headings.forEach(heading => {
    const headingClasses = stylex.props(globalStyles.heading);
    if (headingClasses.className) {
      heading.className = (
        heading.className +
        ' ' +
        headingClasses.className
      ).trim();
    }
  });

  buttons.forEach(button => {
    const buttonClasses = stylex.props(globalStyles.button);
    if (buttonClasses.className) {
      button.className = (
        button.className +
        ' ' +
        buttonClasses.className
      ).trim();
    }
  });
};

// Apply global styles after DOM is ready
document.addEventListener('DOMContentLoaded', applyGlobalStyles);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
