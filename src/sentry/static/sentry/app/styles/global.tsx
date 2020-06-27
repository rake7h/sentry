/* global process */
import React from 'react';
import {Global, css} from '@emotion/core';

import {Theme} from 'app/utils/theme';

const styles = (theme: Theme) => css`
  body {
    .sentry-error-embed-wrapper {
      z-index: ${theme.zIndex.sentryErrorEmbed};
    }
  }

  abbr {
    border-bottom: 1px dotted ${theme.gray500};
  }
  ${process.env.IS_CI &&
    `
    * {
 transition-property: 0s !important;
 -o-transition-property: 0s !important;
 -moz-transition-property: 0s !important;
 -ms-transition-property: 0s !important;
 -webkit-transition-property: 0s !important;

 transform: 0s !important;
 -o-transform: 0s !important;
 -moz-transform: 0s !important;
 -ms-transform: 0s !important;
 -webkit-transform: 0s !important;

 animation: 0s !important;
 -o-animation: 0s !important;
 -moz-animation: 0s !important;
 -ms-animation: 0s !important;
 -webkit-animation: 0s !important;
}`}
`;

/**
 * Renders an emotion global styles injection component
 */
const GlobalStyles = ({theme}: {theme: Theme}) => <Global styles={styles(theme)} />;

export default GlobalStyles;
