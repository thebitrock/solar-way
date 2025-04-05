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
  },
}); 