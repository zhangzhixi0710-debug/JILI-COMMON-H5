module.exports = {
    mode: "jit",
    purge: ["./public/index.html", "./src/**/*.{vue,js}"],
    darkMode: false,
    corePlugins: {
        preflight: false,
    },
    theme: {
        extend: {
            colors: {
                "jili-dark": "#24263a",
                "jili-panel": "#14142b",
                "jili-muted": "#7e7e7e",
                "jili-gold": "#fcc40d",
            },
            screens: {
                xs: "320px",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
