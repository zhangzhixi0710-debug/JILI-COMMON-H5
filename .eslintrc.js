module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "plugin:vue/essential",
        "eslint:recommended",
        "@vue/prettier",
    ],
    parserOptions: {
        parser: "@babel/eslint-parser",
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "indent": ["error", 4],
        "vue/html-indent": ["error", 4],
        "vue/script-indent": ["error", 4],
        "prettier/prettier": [
            "error",
            {
                tabWidth: 4,
                useTabs: false,
                semi: true,
                singleQuote: false,
                printWidth: 100,
                trailingComma: "es5",
                bracketSpacing: true,
                arrowParens: "avoid",
                endOfLine: "lf",
            },
        ],
    },
    overrides: [
        {
            files: ["*.vue"],
            rules: {
                indent: "off",
            },
        },
    ],
}; 