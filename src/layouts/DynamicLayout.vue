<template>
    <!-- 根据屏幕方向切换移动端和电脑端布局容器 -->
    <div class="h-full w-full overflow-x-hidden" :class="[isPc ? 'main-pc' : '', isPhone ? 'main-mobile' : '']">
        <Index v-bind="layoutProps" :initGameId="initGameId">
            <router-view />
        </Index>
    </div>
</template>
<script>
import remMixin from "@/mixins/remMixin.js";
import Index from "@/pages/index/index.vue";

export default {
    mixins: [remMixin],
    provide() {
        return {
            isPcMaxVal: () => this.isPc,
        };
    },
    components: {
        Index,
    },
    data() {
        return {
            initGameId: "", // 初始游戏 ID
            isPhone: false, // 是否为竖屏移动端布局
            isPc: false, // 是否为横屏电脑端布局
        };
    },
    watch: {
        $route(to, from) {
            if (to.query.game && to.params.prefix) {
                if (!isNaN(to.query.game) && !isNaN(parseFloat(to.query.game))) {
                    this.initGameId = to.query.game * 1;
                } else {
                    this.initGameId = to.query.game;
                }
            }
        },
    },
    computed: {
        layoutProps() {
            return {};
        },
    },
    /**
     * 页面初始化时计算屏幕方向并监听窗口变化
     */
    mounted() {
        this.updateScreenInfo();
        window.addEventListener("resize", this.updateScreenInfo);
    },
    /**
     * 组件销毁时移除窗口监听，避免重复绑定
     */
    beforeDestroy() {
        window.removeEventListener("resize", this.updateScreenInfo);
    },
    methods: {
        /**
         * 根据窗口宽高判断当前使用移动端或电脑端布局
         */
        async updateScreenInfo() {
            if (window.innerWidth <= window.innerHeight) {
                this.isPhone = true;
                this.isPc = false;
            } else {
                this.isPhone = false;
                this.isPc = true;
            }
        },
    },
};
</script>

<style lang="scss">
/* 横屏电脑端需要覆盖多个子组件和 Vant 内部结构，保留全局选择器以维持跨组件布局联动 */
.main-pc {
    height: 100%;

    .header {
        height: 68px;
        .header-left-img {
            width: 40px;
        }
        .header-right-img {
            width: 40px;
            margin-left: 0 !important;
        }
        .header-right {
            line-height: 16px;
        }
        .header-right span {
            font-size: 14px;
        }
        .header-img {
            margin-left: 30px;
        }
    }

    .content {
        width: calc(100% - 32px);
        margin: 0 auto;
    }

    .main {
        height: calc(100% - 68px);
        width: calc(100% - 110px);
        margin-left: 110px;
        margin-top: 125px;
    }

    .history-container {
        height: inherit !important;
    }

    .banner-swiper {
        border-radius: 5px;
        height: 300px !important;
        margin-bottom: 15px !important;
    }

    .swiper-button-next {
        height: 50px;
        width: 50px;
    }
    .swiper-button-prev {
        height: 50px;
        width: 50px;
    }

    .swiper-container {
        border-radius: 7px;
    }

    .van-tabbar {
        position: absolute;
        bottom: inherit;
        left: 0;
        top: 82px;
        right: inherit;
        height: calc(100% - 82px);
        width: 110px;
        border-top-right-radius: 7px;
    }

    .image-item {
        width: calc((100% - 82px) / 5) !important; /* 两个间距共40px */
        // min-height: 160px !important;
        margin-right: 20px !important;
        margin-bottom: 10px !important;
    }

    .image-item:nth-child(5n) {
        margin-right: 0 !important;
    }

    .single-images {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }

    .text-main {
        width: calc(100% - 130px) !important;
        top: 82px !important;
        height: 30px !important;
        left: 120px;

        .vertical-text {
            width: calc(100% - 10px) !important;
            height: 30px !important;
            border-radius: 7px !important;
        }

        .vertical-swiper {
            height: 30px !important;
            overflow: hidden;
            position: relative;
        }
    }

    ::v-deep(.vertical-text .swiper-container-vertical) {
        height: 30px;
    }

    ::v-deep(.vertical-text .swiper-slide) {
        height: 30px;
        line-height: 30px;
    }

    .notice-item {
        text-align: left !important;
        padding-left: 10px;
        color: #fff;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        height: 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .van-tabbar-item__text {
        margin-top: 10px;
    }

    .van-tabbar-item img {
        width: 45px !important;
        height: 45px;
    }

    .tabbar-font {
        font-size: 22px !important;
    }

    .footer {
        padding: 15px 0 20px 0 !important;
    }

    .footer-search {
        margin: 0 20px !important;
    }

    .footer-data {
        padding: 0 20px !important;
    }

    .search-title-div {
        height: 40px !important;
        line-height: 40px !important;
        padding-left: 15px !important;

        span {
            font-size: 18px;
        }

        span:last-child {
            font-size: 18px !important;
        }
    }
    .search-input {
        height: 40px !important;
        line-height: 40px !important;
        font-size: 18px !important;
    }
    .search-input::placeholder {
        font-size: 18px !important;
    }
    .search-icon {
        height: 40px !important;
        line-height: 40px !important;
        border-radius: 7px !important;
        padding: 6px !important;
    }
    .footer-search-input {
        border-radius: 7px !important;
        margin-right: 15px !important;
    }
    .footer-data-title {
        height: 70px !important;
        line-height: 70px !important;
        font-size: 26px !important;
    }
}
.main-mobile {
    height: 100%;
}
</style>
