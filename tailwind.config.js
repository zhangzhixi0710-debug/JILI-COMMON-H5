module.exports = {
    mode: "jit",
    purge: {
        content: ["./public/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
        options: {
            safelist: [
                /^tw-bg-/, 
                /^tw-text-/, 
                /^tw-border-/, 
                /^tw-grid-cols-/, 
                /^tw-col-span-/, 
                "tw-hidden", 
                "tw-block"
            ]
        }
    },
    darkMode: "class",
    prefix: "tw-",
    important: "#app",
    corePlugins: {
        preflight: false
    },
    theme: {
        screens: {
            xs: "360px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px"
        },
        extend: {
            colors: {
                game: {
                    bg: "#0B1020",
                    panel: "#111827",
                    primary: "#F6C445",
                    accent: "#06B6D4",
                    danger: "#EF4444"
                }
            },
            boxShadow: {
                neon: "0 0 0.5rem rgba(6, 182, 212, 0.45)",
                card: "0 12px 40px rgba(0, 0, 0, 0.35)"
            },
            zIndex: {
                bg: "0",
                video: "10",
                particle: "20",
                content: "40",
                nav: "60",
                popup: "1000",
                toast: "1100"
            }
        }
    },
    variants: {
        extend: {
            opacity: ["disabled"],
            cursor: ["disabled"]
        }
    },
    plugins: []
};