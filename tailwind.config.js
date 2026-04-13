/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins_400Regular'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        'poppins-bold': ['Poppins_700Bold'],
      },
      color: {
        primary: '#D4AF37',
        background: '#FFFFFF',
        text: '#000000',
        error: '#FF0000',
        success: '#00FF00',
        warning: '#FFA500',
        info: '#17A2B8',
        dark: '#2C3E50',
        light: '#ECF0F1',
      },
    },
  },
  plugins: [],
};
