import { getDeviceType, getDirection } from "@/utils/rem.js";

export default {
    data() {
        return {
            deviceType: getDeviceType(), // 当前设备类型，用于区分移动端和桌面端布局
            direction: getDirection(), // 当前屏幕方向，用于横竖屏布局切换
        };
    },
    mounted() {
        window.addEventListener("resize", this.updateScreenState);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.updateScreenState);
    },
    methods: {
        /**
         * 更新屏幕状态
         * @returns {void}
         */
        updateScreenState() {
            this.deviceType = getDeviceType();
            this.direction = getDirection();
        },
        /**
         * 判断是否为移动端
         * @returns {Boolean}
         */
        isMobile() {
            return this.deviceType === "mobile";
        },
        /**
         * 判断是否为桌面端
         * @returns {Boolean}
         */
        isPC() {
            return this.deviceType === "pc";
        },
        /**
         * 判断是否为竖屏
         * @returns {Boolean}
         */
        isPortrait() {
            return this.direction === "portrait";
        },
        /**
         * 判断是否为横屏
         * @returns {Boolean}
         */
        isLandscape() {
            return this.direction === "landscape";
        },
    },
};
