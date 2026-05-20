/**
 * 获取当前设备类型
 * @returns {String} mobile 表示移动端，pc 表示桌面端
 */
export function getDeviceType() {
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        ua
    );
    return isMobile ? "mobile" : "pc";
}

/**
 * 获取当前屏幕方向
 * @returns {String} portrait 表示竖屏，landscape 表示横屏
 */
function getScreenOrientation() {
    if (screen.orientation?.type) {
        return screen.orientation.type.includes("landscape") ? "landscape" : "portrait";
    }

    if (window.orientation !== undefined) {
        return Math.abs(window.orientation) === 90 ? "landscape" : "portrait";
    }

    return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
}

/**
 * 获取业务布局方向，PC 端保持竖屏布局入口
 * @returns {String} portrait 表示竖屏布局，landscape 表示横屏布局
 */
export function getDirection() {
    if (getDeviceType() === "pc") {
        return "portrait";
    }

    return getScreenOrientation();
}
