import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        soot: '#070707',
        paper: '#f0eee9',
        ash: '#a5a29c',
        solPurple: '#8a5cff',
        solGreen: '#14f195'
      }
    }
  },
  plugins: []
}

export default config
