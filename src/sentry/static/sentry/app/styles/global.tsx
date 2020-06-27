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
 transition-property: none !important;
 -o-transition-property: none !important;
 -moz-transition-property: none !important;
 -ms-transition-property: none !important;
 -webkit-transition-property: none !important;

 transform: none !important;
 -o-transform: none !important;
 -moz-transform: none !important;
 -ms-transform: none !important;
 -webkit-transform: none !important;

 animation: none !important;
 -o-animation: none !important;
 -moz-animation: none !important;
 -ms-animation: none !important;
 -webkit-animation: none !important;
}`}
`;

/**
 * Renders an emotion global styles injection component
 */
const GlobalStyles = ({theme}: {theme: Theme}) => <Global styles={styles(theme)} />;

export default GlobalStyles;
