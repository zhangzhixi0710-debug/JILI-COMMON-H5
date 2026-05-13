const fs = require("fs");
const path = require("path");
const https = require("https");

/**
 * 下载单张图片
 * @param {string} url 图片URL
 * @param {string} filePath 保存路径
 * @param {number} index 图片序号（用于日志）
 * @returns {Promise<void>}
 */
async function downloadSingleImage(url, filePath, index) {
    return new Promise((resolve, reject) => {
        console.log(`正在下载第 ${index} 张图片: ${url}`);

        const protocol = https;

        protocol
            .get(url, response => {
                if (response.statusCode !== 200) {
                    reject(new Error(`第 ${index} 张图片下载失败，状态码: ${response.statusCode}`));
                    return;
                }

                // 确保目录存在
                const dir = path.dirname(filePath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                const fileStream = fs.createWriteStream(filePath);
                response.pipe(fileStream);

                fileStream.on("finish", () => {
                    fileStream.close();
                    console.log(`第 ${index} 张图片下载完成: ${filePath}`);
                    resolve();
                });

                fileStream.on("error", err => {
                    fs.unlink(filePath, () => {});
                    reject(new Error(`第 ${index} 张图片保存失败: ${err.message}`));
                });
            })
            .on("error", err => {
                reject(new Error(`第 ${index} 张图片请求失败: ${err.message}`));
            });
    });
}

/**
 * 批量下载图片
 * @param {string[]} urls 图片URL数组
 * @param {string} outputDir 输出目录
 * @param {number} [concurrency=5] 并发下载数
 */
async function batchDownloadImages(urls, outputDir, concurrency = 5, prefix = "") {
    console.log(`开始批量下载 ${urls.length} 张图片到目录: ${outputDir}`);

    // 创建任务队列
    const tasks = urls.map((url, index) => ({
        url,
        filePath: path.join(outputDir, `${prefix}${index + 1}.webp`),
        index: index + 1,
    }));

    // 并发控制
    const executing = new Set();
    const results = [];

    for (const task of tasks) {
        const promise = downloadSingleImage(task.url, task.filePath, task.index, prefix)
            .then(() => ({ success: true, index: task.index }))
            .catch(err => ({ success: false, index: task.index, error: err.message }));

        executing.add(promise);
        results.push(promise);

        promise.finally(() => executing.delete(promise));

        if (executing.size >= concurrency) {
            await Promise.race(executing);
        }
    }

    // 等待所有任务完成
    const allResults = await Promise.all(results);

    // 统计结果
    const successCount = allResults.filter(r => r.success).length;
    const failCount = allResults.filter(r => !r.success).length;

    console.log(`\n下载完成! 成功: ${successCount}, 失败: ${failCount}`);

    if (failCount > 0) {
        console.log("\n失败的图片:");
        allResults
            .filter(r => !r.success)
            .forEach(r => console.log(`第 ${r.index} 张: ${r.error}`));
    }
}
/**
 * 批量下载图片
 * @param {string[]} urls 图片URL数组
 * @param {string} outputDir 输出目录
 * @param {number} [concurrency=5] 并发下载数
 */
async function batchDownloadImagesChat(urls, outputDir, concurrency = 5) {
    console.log(`开始批量下载 ${urls.length} 张图片到目录: ${outputDir}`);

    // 创建任务队列
    const tasks = urls.map((url, index) => ({
        url,
        filePath: path.join(outputDir, `${url.split("/").pop()}`),
        index: index + 1,
    }));

    // 并发控制
    const executing = new Set();
    const results = [];

    for (const task of tasks) {
        const promise = downloadSingleImage(task.url, task.filePath, task.index)
            .then(() => ({ success: true, index: task.index }))
            .catch(err => ({ success: false, index: task.index, error: err.message }));

        executing.add(promise);
        results.push(promise);

        promise.finally(() => executing.delete(promise));

        if (executing.size >= concurrency) {
            await Promise.race(executing);
        }
    }

    // 等待所有任务完成
    const allResults = await Promise.all(results);

    // 统计结果
    const successCount = allResults.filter(r => r.success).length;
    const failCount = allResults.filter(r => !r.success).length;

    console.log(`\n下载完成! 成功: ${successCount}, 失败: ${failCount}`);

    if (failCount > 0) {
        console.log("\n失败的图片:");
        allResults
            .filter(r => !r.success)
            .forEach(r => console.log(`第 ${r.index} 张: ${r.error}`));
    }
}

function get_number(url, suff = ".webp") {
    const result = [];
    const max = 30; // 最大值

    for (let j = 0; j <= max; j++) {
        result.push(`${url}${j}${suff}`);

        // // 后面的数字
        for (let i = 0; i <= max; i++) {
            // 前面的数字
            result.push(`${url}${i}_${j}${suff}`);
        }
    }

    return result;
}
function get_char(url, suff = ".webp") {
    const result = [];
    const maxNum = 30; // 数字最大到 30
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""); // 转成数组
    // const letters = [
    //     0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    //     25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    // ]; // 转成数组

    for (let j = 1; j <= maxNum; j++) {
        // 数字部分
        for (let i = 0; i < letters.length; i++) {
            // 字母部分
            result.push(`${url}${letters[i]}_${j}${suff}`);
        }
    }

    return result;
}

async function main() {
    const currentGameType = "cashcoin";
    let urls = "";
    let bulletUrls = "";
    // https://jiligames.com/games?type=3

    // https://uat-web-cdn.zww6865z.com/static/images/intro/fb/symbol_06.webp

    // https://uat-web-cdn.ghs93hsajjt.com/static/images/gamehistory/sad/Symbol_5.png
    // urls = Array.from(
    //     { length: 300 },
    //     (_, i) =>
    //         `https://uat-web-cdn.ghs93hsajjt.com/static/images/gamehistory/${currentGameType}/number/${i}.webp`
    // );

    // bulletUrls = Array.from(
    //     { length: 100 },
    //     (_, i) =>
    //         `https://uat-web-cdn.ghs93hsajjt.com/static/images/gamehistory/${currentGameType}/${i}.webp`
    // );
    // bulletUrls = Array.from(
    //     { length: 100 },
    //     (_, i) =>
    //         `https://uat-web-cdn.ghs93hsajjt.com/static/images/gamehistory/${currentGameType}/${i}.webp`
    // );
    // bulletUrls = Array.from({length: 26}, (_, i) => `https://uat-web-cdn.ghs93hsajjt.com/static/images/gamehistory/${currentGameType}/Symbol_${String.fromCharCode(65 + i)}.webp`);

    // bulletUrls = get_char(
    //     `https://uat-web-cdn.ghs93hsajjt.com/static/images/gamehistory/${currentGameType}/Symbol`
    // );
    // bulletUrls = get_number(
    //     `https://uat-web-cdn.ghs93hsajjt.com/static/images/gamehistory/${currentGameType}/`
    // );
    // https://uat-web-cdn.ghs93hsajjt.com/static/images/gamehistory/slotshare/loe_num/1.webp
    const outputDir = path.join(__dirname, "src", "assets", "images", "intro", currentGameType);

    try {
        // await batchDownloadImages(urls, outputDir, 1)
        // urls && (await batchDownloadImages(urls, outputDir, 1, "Symbol_"));

        // bulletUrls && (await batchDownloadImages(bulletUrls, outputDir, 1, "symbol_"));

        const Symbol_ = "symbol_";
        
        bulletUrls = Array.from(
            { length: 50 },
            (_, i) =>
                `https://web-cdn.ca7rxkmi.com/static/images/gamehistory/${currentGameType}/Wild_Num/${i}.webp`
        );
        // bulletUrls = get_char(
        //     `https://web-cdn.ca7rxkmi.com/static/images/gamehistory/${currentGameType}/symbol_`
        // );

        // bulletUrls && (await batchDownloadImagesChat(bulletUrls, outputDir, 5));

        // bulletUrls = Array.from(
        //     { length: 26 },
        //     (_, i) =>
        //         `https://web-cdn.ca7rxkmi.com/static/images/gamehistory/${currentGameType}/Symbol_${String.fromCharCode(
        //             65 + i
        //         )}.webp`
        // );

        // bulletUrls = get_number(
        //     `https://web-cdn.ca7rxkmi.com/static/images/gamehistory/${currentGameType}/symbol_`
        // );
        // bulletUrls = get_char(
        //     `https://web-cdn.ca7rxkmi.com/static/images/gamehistory/${currentGameType}/symbol_`
        // );

        bulletUrls && (await batchDownloadImagesChat(bulletUrls, outputDir, 5));

        console.log("所有下载任务已完成!");
    } catch (error) {
        console.error("批量下载出错:", error);
    }
}

main();
// https://uat-web-cdn.ghs93hsajjt.com/static/images/gamehistory/sad/Symbol_C.webp
