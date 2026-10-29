// Las vistas arman clases con el color de tema elegido (`bg-theme-${themeColor}-600`)
// y con el color de urgencia (`text-${redColorClass}-800`). Tailwind no puede ver
// esas plantillas, así que antes de escanear expandimos cada variable a sus valores.
const THEME_COLORS = ['purple', 'blue', 'green', 'rose', 'orange'];
const URGENCY_COLORS = ['rose', 'amber'];

function expandDynamicClasses(content) {
    const themed = THEME_COLORS.map((c) => content.split('${themeColor}').join(c));
    const urgent = URGENCY_COLORS.map((c) => content.split('${redColorClass}').join(c));
    return [...themed, ...urgent].join('\n');
}

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: {
        files: ['./public/**/*.html', './public/js/**/*.js'],
        transform: { html: expandDynamicClasses, js: expandDynamicClasses },
    },
    theme: {
        extend: {
            colors: {
                theme: {
                    purple: {
                        50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe',
                        400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce',
                        800: '#6b21a8', 900: '#581c87', 950: '#3b0764'
                    },
                    blue: {
                        50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc',
                        400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1',
                        800: '#075985', 900: '#0c4a6e', 950: '#082f49'
                    },
                    green: {
                        50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac',
                        400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d',
                        800: '#166534', 900: '#14532d', 950: '#052e16'
                    },
                    rose: {
                        50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af',
                        400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c',
                        800: '#9f1239', 900: '#881337', 950: '#4c0519'
                    },
                    orange: {
                        50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdbb74',
                        400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c',
                        800: '#9a3412', 900: '#7c2d12', 950: '#431407'
                    }
                }
            }
        }
    },
};
