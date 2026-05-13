const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
    publicPath: "/",
    // publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
    outputDir: "dist",
    assetsDir: "static",
    productionSourceMap: false, // 关闭sourceMap减少体积
    configureWebpack: config => {
        if (isProduction) {
            config.optimization = {
                minimize: true,
                minimizer: [
                    new TerserPlugin({
                        terserOptions: {
                            // compress: {
                            //     drop_console: true,
                            //     drop_debugger: true,
                            //     pure_funcs: ['console.log'], // 移除console.log
                            // },
                            output: {
                                comments: false, // 去除注释
                            },
                        },
                        extractComments: false, // 不生成LICENSE.txt
                        parallel: true,
                    }),
                ],
                splitChunks: {
                    chunks: "all",
                    minSize: 20000,
                    maxSize: 0,
                    minChunks: 1,
                    maxAsyncRequests: 30,
                    maxInitialRequests: 30,
                    automaticNameDelimiter: "~",
                    enforceSizeThreshold: 50000,
                    cacheGroups: {
                        vendors: {
                            test: /[\\/]node_modules[\\/]/,
                            priority: -10,
                            name: "chunk-vendors",
                            reuseExistingChunk: true,
                        },
                        common: {
                            minChunks: 2,
                            priority: -20,
                            name: "chunk-common",
                            reuseExistingChunk: true,
                        },
                    },
                },
            };
            config.plugins.push(
                new CompressionPlugin({
                    filename: "[path][base].gz",
                    algorithm: "gzip",
                    test: /\.(js|css|html|svg)$/,
                    threshold: 10240,
                    minRatio: 0.8,
                })
            );
        }
    },
    chainWebpack: config => {
        // 设置别名
        config.resolve.alias
            .set("@", path.resolve(__dirname, "src"))
            .set("@mock", path.resolve(__dirname, "src/mock"))
            .set("@components", path.resolve(__dirname, "src/components"))
            .set("@pages", path.resolve(__dirname, "src/pages"))
            .set("@assets", path.resolve(__dirname, "src/assets"))
            .set("@utils", path.resolve(__dirname, "src/utils"));

        config.module
            .rule("images")
            .use("url-loader")
            .loader("url-loader")
            .tap(options => {
                options.limit = 1;
                return options;
            });
    },
    css: {
        extract: isProduction, // 生产环境提取 CSS
        sourceMap: false,
        loaderOptions: {
            sass: {
                additionalData: `@use "@/assets/styles/variables.scss" as *;`,
            },
        },
    },
    devServer: {
        port: 8080,
        open: true,
        inline: true, // 改为 true
        overlay: {
            warnings: false,
            errors: true,
        },
        proxy: {
            "/api": {
                target: "https://uat-history.mt7pp.com",
                changeOrigin: true, // 修改 origin 头为目标地址
                secure: false, // 如果是自签名证书，设为 false
                // pathRewrite: { '^/api': '' } // 去掉 /api 前缀（可选）
            },
        },
    },
    lintOnSave: false,
};
