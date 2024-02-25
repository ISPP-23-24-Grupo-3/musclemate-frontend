
import tailwindcssRadix from 'tailwindcss-radix';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        radixgreen: '#30A46C',
      },
    },
  },
  plugins: [
    tailwindcssRadix({
      variantPrefix: "data",
    }),
  ],
};
