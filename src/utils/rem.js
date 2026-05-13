// rem自适应工具
(function flexible(window, document) {
    const docEl = document.documentElement;
    const dpr = window.devicePixelRatio || 1;

    // 设置body字体大小
    function setBodyFontSize() {
        if (document.body) {
            document.body.style.fontSize = 12 * dpr + "px";
        } else {
            document.addEventListener("DOMContentLoaded", setBodyFontSize);
        }
    }
    setBodyFontSize();

    // 设置1rem = viewWidth / 10
    function setRemUnit() {
        const rem = docEl.clientWidth / 10;
        docEl.style.fontSize = rem + "px";
    }

    setRemUnit();

    // 监听resize事件
    window.addEventListener("resize", setRemUnit);
    window.addEventListener("pageshow", function (e) {
        if (e.persisted) {
            setRemUnit();
        }
    });

    // 设置viewport
    if (dpr >= 2) {
        const fakeBody = document.createElement("body");
        const testElement = document.createElement("div");
        testElement.style.border = ".5px solid transparent";
        fakeBody.appendChild(testElement);
        docEl.appendChild(fakeBody);
        if (testElement.offsetHeight === 1) {
            docEl.classList.add("hairlines");
        }
        docEl.removeChild(fakeBody);
    }
})(window, document);

// 导出rem计算函数
export function rem(px) {
    return px / 37.5 + "rem"; // 基于375px设计稿
}

// 导出PC端rem计算函数
export function remPC(px) {
    return px / 100 + "rem"; // 基于1000px设计稿
}

// 获取当前设备类型
export function getDeviceType() {
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    return isMobile ? "mobile" : "pc";
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
export function getDirection() {
    const orientation = getScreenOrientation();

    if (getDeviceType() === "pc") {
        return "portrait";
    }
    return orientation;
}
