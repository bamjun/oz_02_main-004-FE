import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './src/**/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    fontWeight: {
      extralight: '100',
      thin: '200',
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    fontSize: {
      '2xs': ' 0.5rem',
      xs: '0.625rem',
      sm: '0.75rem',
      mm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.375rem',
      '3xl': '1.5rem',
      '4xl': '1.625rem',
    },
    extend: {
      fontFamily: {
        noto: ['var(--font-noto)'],
      },
      colors: {
        primary: {
          '50': '#f5f3ff',
          '100': '#eee8ff',
          '200': '#ded5ff',
          '300': '#c6b3ff',
          '400': '#aa88fd',
          '500': '#8f58fa',
          '600': '#8235f2',
          '700': '#7323de',
          '800': '#601dba',
          '900': '#501a98',
          '950': '#300e67',
        },
        black: {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#888888',
          '500': '#6d6d6d',
          '600': '#5d5d5d',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#3a3a3a',
          '950': '#262626',
        },
        saturdayBlue: '#96BAFF',
        errorRed: '#FF8181',
      },
      width: {
        mobile: '24.375rem',
      },
      height: {
        mobile: '52.75rem',
        navigation: '5.875rem',
      },
      animation: {
        fadeIn: '0.6s ease 0s fadeIn',
        fadeInDown: '0.5s ease 0s fadeInDown',
        vibration: 'vibration 1s linear infinite',
        boxopen: 'boxopen 2s linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInDown: {
          '0%': { height: '0', opacity: '0' },
          '100%': { height: 'fit', transform: 'translateY(0)', opacity: '1' },
        },
        vibration: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(0deg)' },
          '75%': { transform: 'rotate(10deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        boxopen: {
          '0%': {opacity: '0', scale: '0%'},
          '100%': {opacity: '100', scale: '100%'}
        },
      },
    },
  },
  plugins: [],
};
export default config;
