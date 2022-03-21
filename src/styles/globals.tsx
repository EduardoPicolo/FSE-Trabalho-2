import { createGlobalStyle, css } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
    /* Set core body defaults */
    body {
      ${({ theme }) => css`
        min-height: 100vh;
        text-rendering: optimizeSpeed;
        font-family: Roboto, Poppins, sans-serif, -apple-system,
          BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans',
          'Helvetica Neue';
        background: linear-gradient(155deg, #ffffff 33%, #efefef);
        background-attachment: fixed;
      `}
    }

    /* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
    @media (prefers-reduced-motion: reduce) {
      html:focus-within {
        scroll-behavior: auto;
      }

      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }

`
