<template>
    <!-- 页面顶部导航栏 -->
    <div
        class="header fixed z-[100] flex h-[68px] w-full items-center justify-between bg-jili-dark text-white"
        :class="{ [`${config.name}-header`]: true }"
    >
        <img
            class="header-img header-left-img ml-4 w-[45px] md:w-10"
            src="@/assets/svg/back.svg"
            @click="closeWebview"
        />

        <!-- 用户信息区域 -->
        <div class="header-title flex items-center justify-center text-base">
            <div
                class="header-right flex flex-col items-end justify-center pr-3 leading-[18px] md:leading-4"
            >
                <span>Welcome</span>
                <span class="font-semibold text-jili-gold">{{ nickname }}</span>
            </div>

            <img class="header-img header-right-img mr-5 w-[45px] md:w-10" src="@/assets/svg/people.svg" />
        </div>
    </div>
</template>

<script>
import { getNickname } from "@/api/game.js";

export default {
    name: "Header",
    props: {
        config: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            nickname: "", // 用户昵称
        };
    },
    /**
     * 页面顶部初始化用户昵称
     */
    mounted() {
        this.initData();
    },
    methods: {
        /**
         * 获取用户昵称并展示在顶部栏
         */
        initData() {
            getNickname().then(res => {
                this.nickname = res?.Data || "";
            });
        },
        /**
         * 通知宿主容器关闭当前 WebView
         */
        closeWebview() {
            try {
                if (window.location !== window.parent.location) {
                    let uParams = new URLSearchParams(window.location.search);
                    let posthost = uParams.get("posthost");
                    window.parent.postMessage("CloseWebView", "https://" + posthost);
                    window.parent.postMessage("CloseWebView", "file:///");
                }
            } catch (i) {
                console.error("CloseWebView 錯誤：", i);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
/* 第三方或游戏主题可能依赖 header 子类名，这里仅保留文字颜色的层级覆盖 */
.header-right span {
    color: #7e7e7e;
}

.header-right span:last-child {
    color: #fcc40d;
}
</style>
