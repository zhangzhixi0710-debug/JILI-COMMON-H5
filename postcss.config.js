const path = require("path");

/**
 * 判断是否为 Tailwind 入口文件，避免被 pxtorem 改写
 * @param {String} file 文件路径
 * @returns {Boolean}
 */
function isTailwindEntry(file) {
    if (!file) return false;
    const normalized = file.split(path.sep).join("/");
    return normalized.includes("src/styles/tailwind/");
}

module.exports = {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
        "postcss-pxtorem": {
            rootValue: ({ file }) => {
                const normalized = (file || "").replace(/\\/g, "/");
                if (normalized.includes("/src/pages/pc/")) {
                    return 100;
                }
                return 37.5;
            },
            propList: ["*"],
            selectorBlackList: [/^\.norem/, /^\.no-rem/],
            replace: true,
            mediaQuery: true,
            minPixelValue: 2,
            unitPrecision: 5,
            exclude: file => /node_modules/i.test(file || "") || isTailwindEntry(file),
        },
    },
};