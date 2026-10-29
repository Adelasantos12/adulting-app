// Colores semánticos de la Biblia (docs/bible/tokens.css). Los valores viven como variables
// en src/tailwind.css, así que cambian solos con el modo oscuro y con el acento elegido.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./public/**/*.html', './public/js/**/*.js'],
    theme: {
        extend: {
            colors: {
                ground: token('ground'),
                card: token('card'),
                'surface-1': token('surface-1'),
                'surface-2': token('surface-2'),
                line: token('line'),
                edge: token('edge'),
                ink: token('ink'),
                'ink-soft': token('ink-soft'),
                'ink-faint': token('ink-faint'),
                attention: token('attention'),
                'attention-soft': token('attention-soft'),
                'attention-fill': token('attention-fill'),
                accent: token('accent'),
                'accent-fill': token('accent-fill'),
                'accent-fill-strong': token('accent-fill-strong'),
                'accent-soft': token('accent-soft'),
            },
            fontFamily: {
                sans: ['Nunito', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
                serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
                atkinson: ['Atkinson Hyperlegible', 'system-ui', 'sans-serif'],
            },
            // `border` sin color usa la línea decorativa del tema, también en modo oscuro
            borderColor: { DEFAULT: token('line') },
            minHeight: { target: 'var(--target-min)' },
        },
        // Escala de tokens.css: el cuerpo es 18px y nada baja de 14px (CORE 4.3, QA gate 9)
        fontSize: {
            xs: ['0.875rem', { lineHeight: '1.5' }],
            sm: ['1rem', { lineHeight: '1.55' }],
            base: ['1.125rem', { lineHeight: '1.6' }],
            lg: ['1.375rem', { lineHeight: '1.4' }],
            xl: ['1.75rem', { lineHeight: '1.3' }],
            '2xl': ['2.25rem', { lineHeight: '1.25' }],
            '3xl': ['2.25rem', { lineHeight: '1.25' }],
            '4xl': ['2.25rem', { lineHeight: '1.25' }],
        },
    },
};
