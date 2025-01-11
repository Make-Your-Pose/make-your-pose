import { defineConfig } from '@pandacss/dev';
import { createPreset } from '@park-ui/panda-preset';
import neutral from '@park-ui/panda-preset/colors/neutral';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  presets: [
    createPreset({ accentColor: neutral, grayColor: neutral, radius: 'sm' }),
  ],

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  jsxFramework: 'react',

  // The output directory for your css system
  outdir: 'styled-system',
});
