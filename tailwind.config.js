
import tailwindcssRadix from 'tailwindcss-radix';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#35D900",
      },
    },
  },
  plugins: [
    tailwindcssRadix({
      variantPrefix: "data",
    }),
  ],
};
