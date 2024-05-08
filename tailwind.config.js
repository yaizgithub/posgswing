/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    important: true,
    theme: {
        container: {
            center: true,
            padding: "16px",
        },
        extend: {
            colors: {
                // primary: "#172858",
                primary: "#062E6F",
                secondary: "#7CACF8",
                dark: "#0f172a",
                background: "#00091C",
            },
            backgroundImage: {
                // bgLogin:
                //     "url('https://lh3.googleusercontent.com/p/AF1QipNq-Nf-szRbR4odUSeVsIfzz3hQJ2YpHPST3xkX=w1080-h608-p-no-v0')",
            },
        },
        fontFamily: {
            poppins: ["Poppins", "sans-serif"],
        },
    },
    plugins: [],
};
