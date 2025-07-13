// tailwind.config.js
module.exports = {
  content: [/* your content paths */],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        earthy: {
          clay: "#B85C38",
          sand: "#EBD9B4",
          olive: "#556B2F",
          bark: "#4E342E",
          leaf: "#7D8F69",
          cream: "#F9F5E3",
        },
      },
      backgroundImage: {
        'earthy-gradient': "linear-gradient(to bottom, #F9F5E3, #EBD9B4, #B85C38)",
      },
    },
  },
  plugins: [],
};
