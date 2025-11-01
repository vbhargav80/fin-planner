// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // This line is the important one
    ],
    theme: {
        extend: {
            fontFamily: {
                // Adds the 'Inter' font family
                inter: ['"Inter"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
