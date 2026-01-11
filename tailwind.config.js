/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './entrypoints/**/*.{js,jsx,ts,tsx,html}',
        './components/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                background: '#1E1E1E',
                foreground: '#E8E8E8',
                card: '#2A2A2A',
                'card-foreground': '#F5F5F5',
                primary: '#8AB4F8',
                'primary-foreground': '#1E1E1E',
                secondary: '#3C4043',
                'secondary-foreground': '#E8E8E8',
                muted: '#3C4043',
                'muted-foreground': '#9AA0A6',
                accent: '#8AB4F8',
                'accent-foreground': '#1E1E1E',
                destructive: '#F28B82',
                'destructive-foreground': '#1E1E1E',
                border: '#3C4043',
                input: '#3C4043',
                ring: '#8AB4F8',
            },
            borderRadius: {
                lg: '12px',
                md: '8px',
                sm: '6px',
            },
        },
    },
    plugins: [],
}
