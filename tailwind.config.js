/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/index.html",
    "./src/**/**/*.jsx",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    "./src/assets/*.{svg,png,jpg,jpeg,gif}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        whiteColor: "#ffffff",
        blackColor: "#000000",
        lightGreenColor: "#b5ea8c",
        lightGreenColor2: "#94bf73",
        mediumGreenColor1: "#739559",
        mediumGreenColor2: "#526a40",
        darkGreenColor: "#314026",
        darkGreenColor2: "#11150d",
      },
      backgroundImage: {
        logo: "url('./src/assets/react.svg')",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        "loading-bar": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(300%)" },
        },
      },
      animation: {
        blink: "blink 1s step-start infinite",
        "loading-bar": "loading-bar 1.5s linear infinite",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
