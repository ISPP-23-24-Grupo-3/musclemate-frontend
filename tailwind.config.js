import tailwindcssRadix from "tailwindcss-radix";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        radixgreen: "#30A46C",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        fadein: "fadeIn 0.15s linear",
      },
    },
  },
  plugins: [
    tailwindcssRadix({
      variantPrefix: "data",
    }),
  ],
};
