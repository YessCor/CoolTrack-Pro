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
        brand: {
          DEFAULT: '#0F4C75',   // Azul petróleo profundo
          light: '#1B6CA8',
          dark: '#0A3352',
          accent: '#00B4D8',    // Cian vibrante
          muted: '#E8F4FD',
        },
        ink: {
          DEFAULT: '#0D1B2A',   // Casi negro azulado
          mid: '#1B2D3E',
          soft: '#2C3E50',
        },
        surface: {
          DEFAULT: '#F5F7FA',
          card: '#FFFFFF',
          border: '#E2E8F0',
          hover: '#EEF2F7',
        },
        status: {
          pending:   '#F59E0B',
          assigned:  '#06B6D4',
          progress:  '#6366F1',
          onway:     '#8B5CF6',
          onsite:    '#F97316',
          completed: '#10B981',
          invoiced:  '#64748B',
          cancelled: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
}
