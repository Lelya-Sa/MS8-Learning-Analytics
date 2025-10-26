/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Use CSS Custom Properties from theme.css
        primary: {
          blue: 'var(--primary-blue)',
          purple: 'var(--primary-purple)', 
          cyan: 'var(--primary-cyan)',
        },
        accent: {
          gold: 'var(--accent-gold)',
          green: 'var(--accent-green)',
          orange: 'var(--accent-orange)',
        },
        background: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          card: 'var(--bg-card)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          accent: 'var(--text-accent)',
        },
        // Gamification Colors
        gamification: {
          xp: 'var(--xp-color)',
          level: 'var(--level-color)',
          badge: 'var(--badge-color)',
          streak: 'var(--streak-color)',
        },
        // Chart Colors
        chart: {
          1: '#10b981', // emerald-500
          2: '#34d399', // emerald-400
          3: '#6ee7b7', // emerald-300
          4: '#059669', // emerald-600
          5: '#047857', // emerald-700
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.25' }], // 12px
        sm: ['0.875rem', { lineHeight: '1.5' }], // 14px
        base: ['1rem', { lineHeight: '1.5' }], // 16px
        lg: ['1.125rem', { lineHeight: '1.75' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.75' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '1.25' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '1.25' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '1.25' }], // 36px
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
      },
      borderRadius: {
        sm: '0.25rem', // 4px
        md: '0.375rem', // 6px
        lg: '0.5rem', // 8px
        xl: '0.75rem', // 12px
        '2xl': '1rem', // 16px
        full: '9999px',
      },
      boxShadow: {
        glow: 'var(--shadow-glow)',
        card: 'var(--shadow-card)',
        hover: 'var(--shadow-hover)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-emerald': 'pulseEmerald 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseEmerald: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // Custom breakpoints for MS8 Learning Analytics
        'mobile': { 'max': '767px' },
        'tablet': { 'min': '768px', 'max': '991px' },
        'desktop': { 'min': '1200px', 'max': '1399px' },
        'desktop-lg': { 'min': '1400px' },
        'desktop-xl': { 'min': '1920px' },
      },
    },
  },
  plugins: [
    // Add custom utilities for MS8 Learning Analytics
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Focus ring utilities
        '.focus-ring': {
          '&:focus': {
            outline: '3px solid var(--primary-cyan)',
            'outline-offset': '2px',
            'box-shadow': '0 0 0 3px rgba(8, 145, 178, 0.3)',
          },
        },
        // Text utilities
        '.text-gradient': {
          'background': 'var(--gradient-primary)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        // Card utilities
        '.card': {
          'background': 'var(--gradient-card)',
          'color': 'var(--text-primary)',
          'border-radius': '0.5rem',
          'padding': 'var(--spacing-lg)',
          'box-shadow': 'var(--shadow-card)',
        },
        '.card-hover': {
          'transition': 'all 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-2px)',
            'box-shadow': 'var(--shadow-hover)',
          },
        },
        // Button utilities
        '.btn': {
          'display': 'inline-flex',
          'align-items': 'center',
          'justify-content': 'center',
          'border-radius': '0.375rem',
          'font-size': '0.875rem',
          'font-weight': '500',
          'transition': 'all 0.3s ease',
          'cursor': 'pointer',
          'border': '1px solid transparent',
          'padding': 'var(--spacing-sm) var(--spacing-md)',
        },
        '.btn-primary': {
          'background': 'var(--gradient-primary)',
          'color': 'white',
          '&:hover': {
            'box-shadow': 'var(--shadow-glow)',
          },
        },
        '.btn-secondary': {
          'background': 'var(--bg-secondary)',
          'color': 'var(--text-primary)',
          '&:hover': {
            'background': 'var(--bg-tertiary)',
          },
        },
        '.btn-outline': {
          'background': 'transparent',
          'color': 'var(--primary-blue)',
          'border-color': 'var(--primary-blue)',
          '&:hover': {
            'background': 'var(--primary-blue)',
            'color': 'white',
          },
        },
        // Input utilities
        '.input': {
          'display': 'flex',
          'width': '100%',
          'border-radius': '0.375rem',
          'border': '1px solid var(--bg-tertiary)',
          'background-color': 'var(--bg-primary)',
          'color': 'var(--text-primary)',
          'padding': 'var(--spacing-sm) var(--spacing-md)',
          'font-size': '0.875rem',
          'transition': 'border-color 0.3s ease',
          '&:focus': {
            'outline': 'none',
            'border-color': 'var(--primary-cyan)',
            'box-shadow': '0 0 0 3px rgba(8, 145, 178, 0.3)',
          },
        },
        // Chart utilities
        '.chart-container': {
          'background': 'var(--gradient-card)',
          'border-radius': '0.5rem',
          'padding': 'var(--spacing-lg)',
          'color': 'var(--text-primary)',
          'box-shadow': 'var(--shadow-card)',
        },
        // Accessibility utilities
        '.sr-only': {
          'position': 'absolute',
          'width': '1px',
          'height': '1px',
          'padding': '0',
          'margin': '-1px',
          'overflow': 'hidden',
          'clip': 'rect(0, 0, 0, 0)',
          'white-space': 'nowrap',
          'border': '0',
        },
        '.skip-link': {
          'position': 'absolute',
          'top': '-40px',
          'left': '6px',
          'background': 'var(--primary-blue)',
          'color': 'white',
          'padding': '8px',
          'text-decoration': 'none',
          'border-radius': '4px',
          'z-index': '10000',
          '&:focus': {
            'top': '6px',
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
