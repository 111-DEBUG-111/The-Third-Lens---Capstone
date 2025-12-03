module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        "political-red": '#D92D20',
        "political-blue": '#0B5FFF'
      },
      backgroundImage: {
        'political-gradient': 'linear-gradient(135deg, #D92D20 0%, #FFFFFF 50%, #0B5FFF 100%)'
      }
    }
  },
  plugins: [],
}
