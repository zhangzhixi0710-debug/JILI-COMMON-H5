const projectUtilities = require("./src/styles/tailwind/projectUtilities");

module.exports = {
    prefix: "tw-",
    purge: {
        enabled: true,
        content: ["./src/**/*.{vue,js,scss,css}"],
    },
    corePlugins: {
        preflight: false,
    },
    theme: {
        screens: {
            mobile: { max: "767px" },
            pc: "768px",
            wide: "1200px",
        },
        extend: {
            maxWidth: {
                pc: "1200px",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities(projectUtilities, {
                variants: ["responsive", "hover", "focus"],
                respectPrefix: false,
            });
        },
    ],
};
