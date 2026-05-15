module.exports = {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
        // 'postcss-pxtorem': {
        //     rootValue: ({ file }) => {
        //         // 根据文件路径判断是移动端还是PC端
        //         // 如果是PC端相关文件，使用100作为基准值
        //         // 如果是移动端相关文件，使用37.5作为基准值
        //         if (file && file.dirname && file.dirname.includes('pc')) {
        //             return 100; // PC端基准值
        //         }
        //         return 100; // 移动端基准值
        //     },
        //     filter: (node, value) => {
        //         // 如果该规则包含 mode: pc，则不转换
        //         console.log(node.parent && node.parent.some(n => n.prop === 'mode' && n.value === 'pc'))
        //         if (node.parent && node.parent.some(n => n.prop === 'mode' && n.value === 'pc')) {
        //             return false;
        //         }
        //         return true;
        //     },        
        //     propList: ['*'], // 需要转换的属性，这里表示全部都进行转换
        //     selectorBlackList: ['.norem', '.no-rem'], // 过滤掉.norem和.no-rem开头的class，不进行rem转换
        //     exclude: /node_modules/i,
        //     minPixelValue: 2, // 小于或等于1px不转换为rem
        //     maxPixelValue: 750, // 大于或等于750px不转换为rem
        //     mediaQuery: true, // 允许在媒体查询中转换px
        //     unitPrecision: 5, // rem保留几位小数点
        //     replace: true,
        //     // 媒体查询配置
        //     mediaQueryMinWidth: 320,
        //     mediaQueryMaxWidth: 1920
        // },
        // 'autoprefixer': {
        //     overrideBrowserslist: [
        //         'Android 4.1',
        //         'iOS 7.1',
        //         'Chrome >= 31',
        //         'ff >= 31',
        //         'ie >= 8',
        //         'last 2 versions'
        //     ]
        // }
    }
}; 
