function isDesktop() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ["android", "iphone", "windows phone", "mobile"];
    const tabletKeywords = ["ipad", "tablet"];

    // 排除平板（iPad/Android 平板）
    const isTablet = tabletKeywords.some(keyword => userAgent.includes(keyword));
    const isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword));

    // 屏幕宽度阈值（可根据需求调整）
    const isLargeScreen = window.innerWidth >= 1314 || true; // 通常桌面端 >= 1024px

    // 逻辑优先级：平板 > 移动设备 > 桌面
    if (isTablet) {
        return false; // 平板视为移动端
    } else if (isMobile) {
        return false; // 手机等小屏设备
    } else {
        return isLargeScreen; // 大屏且非移动设备 UA
    }
}

/**
 * portrait: 竖屏
 * landscape: 横屏
 * @returns
 */
function getScreenOrientation() {
    // 方法 1: screen.orientation（现代浏览器）
    if (screen.orientation?.type) {
        return screen.orientation.type.includes("landscape") ? "landscape" : "portrait";
    }
    // 方法 2: window.orientation（旧设备）
    else if (window.orientation !== undefined) {
        return Math.abs(window.orientation) === 90 ? "landscape" : "portrait";
    }
    // 方法 3: innerWidth/innerHeight（备用）
    else {
        return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
    }
}

// 监听屏幕旋转
function handleOrientationChange() {
    const orientation = getScreenOrientation();

    if (isDesktop()) {
        console.log("竖屏");
        return "portrait";
    }
    return orientation;
}

function decodeProto(gameId, data, Proto, gtTranMap) {
    const gt = gtTranMap[gameId]?.toLowerCase();
    if (!gt || !Proto[gt]) return null;
    const binaryStr = atob(data.sp);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }

    if (!Proto[gt].AllPlate) {
        return Proto[gt].SpinAck.decode(bytes);
    }
    return Proto[gt].AllPlate.decode(bytes);
}

/**
 * 格式化时间戳为 GMT+8 字符串
 * @param {number|string} timestamp
 * @param {boolean} multiline
 * @returns {string}
 */
function formatTimeGmt8(timestamp, multiline = false) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const timezoneOffset = 8 * 60 * 60 * 1000;
    const gmt8Time = new Date(date.getTime() + timezoneOffset);

    const year = gmt8Time.getUTCFullYear();
    const month = String(gmt8Time.getUTCMonth() + 1).padStart(2, "0");
    const day = String(gmt8Time.getUTCDate()).padStart(2, "0");
    const hours = String(gmt8Time.getUTCHours()).padStart(2, "0");
    const minutes = String(gmt8Time.getUTCMinutes()).padStart(2, "0");
    const seconds = String(gmt8Time.getUTCSeconds()).padStart(2, "0");

    if (multiline === true) {
        return `${year}/${month}/${day}<br />${hours}:${minutes}:${seconds}(GMT+8)`;
    } else if (multiline === 1) {
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}<br />(GMT+8)`;
    } else {
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}(GMT+8)`;
    }
}

export { isDesktop, handleOrientationChange, decodeProto, formatTimeGmt8 };
