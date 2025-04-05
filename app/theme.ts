import { createTheme } from '@aws-amplify/ui-react';

export const theme = createTheme({
  name: 'solar-way-theme',
  tokens: {
    colors: {
      background: {
        primary: { value: '#ffffff' },
      },
      font: {
        primary: { value: '#0a0a0a' },
      },
    },
    fontSizes: {
      xs: { value: '0.75rem' },
      sm: { value: '0.875rem' },
      base: { value: '1rem' },
      lg: { value: '1.125rem' },
      xl: { value: '1.25rem' },
      xxl: { value: '1.5rem' },
      xxxl: { value: '1.875rem' },
    },
    fontWeights: {
      normal: { value: '400' },
      medium: { value: '500' },
      semibold: { value: '600' },
      bold: { value: '700' },
    },
    lineHeights: {
      tight: { value: '1.25' },
      normal: { value: '1.5' },
      relaxed: { value: '1.75' },
    },
    components: {
      text: {
        defaultProps: {
          fontSize: 'base',
          lineHeight: 'normal',
        },
      },
      heading: {
        defaultProps: {
          fontSize: 'xxl',
          lineHeight: 'tight',
          fontWeight: 'bold',
        },
      },
      button: {
        defaultProps: {
          fontSize: 'base',
          fontWeight: 'medium',
        },
      },
      fieldcontrol: {
        defaultProps: {
          fontSize: 'base',
          lineHeight: 'normal',
        },
      },
      label: {
        defaultProps: {
          fontSize: 'sm',
          lineHeight: 'normal',
          fontWeight: 'medium',
        },
      },
    },
  },
}); 