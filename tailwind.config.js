/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E40AF', // Azul Zafiro corporativo
          light: '#3B82F6',
          dark: '#1E3A8A',
        },
        secondary: {
          DEFAULT: '#64748B',
          light: '#F1F5F9',
        },
        status: {
          pending: '#F59E0B',
          progress: '#3B82F6',
          completed: '#10B981',
          cancelled: '#EF4444'
        }
      }
    },
  },
  plugins: [],
}
