module.exports = {
    presets: [["@babel/preset-env", { modules: false }]],
    plugins: [
        [
            "import",
            {
                libraryName: "vant",
                libraryDirectory: "es",
                style: true, // 自动引入样式
            },
            "vant",
        ],
        [
            "component",
            {
                libraryName: "element-ui",
                styleLibraryName: "theme-chalk",
            },
        ],
        '@babel/plugin-proposal-optional-chaining'
    ],
};
