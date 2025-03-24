import React from 'react';
import { createGlobalStyle } from 'styled-components';
import './responsive.css';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: ${props => props.theme.transitions.default};
    
    &:hover {
      color: ${props => props.theme.colors.secondary};
    }
  }

  button, input, select, textarea {
    font-family: inherit;
  }

  /* Container classes for consistent spacing */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Grid layout classes */
  .grid-layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  /* Form layout classes */
  .form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  /* Responsive table class */
  .responsive-table {
    width: 100%;
    overflow-x: auto;
  }

  /* Chart container class */
  .chart-container {
    width: 100%;
    height: 400px;
  }

  /* Utility classes */
  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .mt-1 {
    margin-top: 0.5rem;
  }

  .mt-2 {
    margin-top: 1rem;
  }

  .mt-3 {
    margin-top: 1.5rem;
  }

  .mt-4 {
    margin-top: 2rem;
  }

  .mb-1 {
    margin-bottom: 0.5rem;
  }

  .mb-2 {
    margin-bottom: 1rem;
  }

  .mb-3 {
    margin-bottom: 1.5rem;
  }

  .mb-4 {
    margin-bottom: 2rem;
  }

  .p-1 {
    padding: 0.5rem;
  }

  .p-2 {
    padding: 1rem;
  }

  .p-3 {
    padding: 1.5rem;
  }

  .p-4 {
    padding: 2rem;
  }

  /* Accessibility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .no-print {
    @media print {
      display: none;
    }
  }
`;

export default GlobalStyles;
