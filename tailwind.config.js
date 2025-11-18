// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx}", // adjust for your setup
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand
        "gw-primary": "#24D1A8",
        "gw-primary-light": "#C9F7D3",
        "gw-primary-dark": "#193B3B",
        "gw-primary-soft": "rgba(201, 247, 211, 0.1)",

        // Secondary / accent
        "gw-secondary": "#B69D72",

        // Greys from your theme
        "gw-grey-50": "#F2F7F7",
        "gw-grey-100": "#EBF2F2",
        "gw-grey-200": "#D3E3E3",
        "gw-grey-300": "#CCDBDB",
      },
      borderRadius: {
        // optional: mimic Mantine defaultRadius="lg"
        lg: "0.5rem",
      },
    },
  },
  plugins: [],
}
