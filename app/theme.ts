import { createTheme } from '@aws-amplify/ui-react';

export const theme = createTheme({
  name: 'solar-way-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: { value: '#E6F1FF' },
          20: { value: '#CCE4FF' },
          30: { value: '#99C9FF' },
          40: { value: '#66ADFF' },
          50: { value: '#3392FF' },
          60: { value: '#0077FF' },
          70: { value: '#005FCC' },
          80: { value: '#004799' },
          90: { value: '#003066' },
          100: { value: '#001833' },
        },
      },
    },
  },
}); 