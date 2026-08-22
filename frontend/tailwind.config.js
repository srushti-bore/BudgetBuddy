/** @type {import('tailwindcss').Config}
 * Tailwind config aligned with design-system-standard.md
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Semantic tokens from design-system-standard.md §1.2
        bg:          'var(--color-bg)',
        surface:     'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        border:      'var(--color-border)',
        // Text
        'text-primary':   'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-disabled':  'var(--color-text-disabled)',
        // Brand
        primary:     'var(--color-primary)',
        success:     'var(--color-success)',
        danger:      'var(--color-danger)',
        warning:     'var(--color-warning)',
        info:        'var(--color-info)',
        // Legacy aliases used in existing components
        background:  'var(--color-bg)',
        foreground:  'var(--color-text-primary)',
        card:        { DEFAULT: 'var(--color-surface)', foreground: 'var(--color-text-primary)' },
        muted:       { DEFAULT: 'var(--color-surface-alt)', foreground: 'var(--color-text-secondary)' },
        accent:      { DEFAULT: 'var(--color-primary)', foreground: '#FFFFFF' },
        destructive: { DEFAULT: 'var(--color-danger)', foreground: '#FFFFFF' },
      },
      fontFamily: {
        // design-system-standard.md §2
        sans:  ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono:  ['Roboto Mono', 'ui-monospace', 'monospace'],
        // Legacy aliases
        sora:    ['Inter', 'system-ui', 'sans-serif'],
        manrope: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // design-system-standard.md §2.1
        xs:   ['12px', { lineHeight: '16px' }],
        sm:   ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg:   ['18px', { lineHeight: '28px', fontWeight: '500' }],
        xl:   ['20px', { lineHeight: '28px', fontWeight: '600' }],
        '2xl': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        '3xl': ['30px', { lineHeight: '36px', fontWeight: '700' }],
      },
      borderRadius: {
        // design-system-standard.md §4
        none: '0px',
        sm:   '4px',
        DEFAULT: '8px',
        md:   '8px',
        lg:   '12px',
        xl:   '16px',
        full: '9999px',
      },
      spacing: {
        // design-system-standard.md §3 — 4px base unit
        0:  '0px',
        1:  '4px',
        2:  '8px',
        3:  '12px',
        4:  '16px',
        5:  '20px',
        6:  '24px',
        8:  '32px',
        10: '40px',
        12: '48px',
        16: '64px',
      },
      boxShadow: {
        // design-system-standard.md §5
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        // Legacy
        card:   'var(--shadow-sm)',
        lifted: 'var(--shadow-lg)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '350ms',
      },
      screens: {
        // design-system-standard.md §8
        sm:  '640px',
        md:  '768px',
        lg:  '1024px',
        xl:  '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
