<template>
    <div :class="[isPc ? 'main-pc' : '', isPhone ? 'main-mobile' : '']">
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
            initGameId: "",
            isPhone: false,
            isPc: false,
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
    mounted() {
        this.updateScreenInfo();
        window.addEventListener("resize", this.updateScreenInfo);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.updateScreenInfo);
    },
    methods: {
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
.main-pc {
    @apply tw-u-2d30943fe6;

    .header {
        @apply tw-u-79eb92eb56;
        .header-left-img {
            @apply tw-u-274c99d445;
        }
        .header-right-img {
            @apply tw-u-e6a72398c2;
        }
        .header-right {
            @apply tw-u-deadd5b07f;
        }
        .header-right span {
            @apply tw-u-1c639f0d4c;
        }
        .header-img {
            @apply tw-u-91859afed2;
        }
    }

    .content {
        @apply tw-u-2c7c7d5fef;
    }

    .main {
        @apply tw-u-044687af44;
    }

    .history-container {
        @apply tw-u-4d6ad78989;
    }

    .banner-swiper {
        @apply tw-u-fb5a49005f;
    }

    .swiper-button-next {
        @apply tw-u-3289aa76ae;
    }
    .swiper-button-prev {
        @apply tw-u-3289aa76ae;
    }

    .swiper-container {
        @apply tw-u-ab7825c746;
    }

    .van-tabbar {
        @apply tw-u-9ecfe153fb;
    }

    .image-item {
        @apply tw-u-7fda3031f8; /* 两个间距共40px */
        // min-height: 160px !important;
    }

    .image-item:nth-child(5n) {
        @apply tw-u-68ad83dced;
    }

    .single-images {
        @apply tw-u-f5767e4d31;
    }

    .text-main {
        @apply tw-u-f65525757d;

        .vertical-text {
            @apply tw-u-170b3d5eba;
        }

        .vertical-swiper {
            @apply tw-u-a7710472af;
        }
    }

    ::v-deep(.vertical-text .swiper-container-vertical) {
        @apply tw-u-0dc08e8c23;
    }

    ::v-deep(.vertical-text .swiper-slide) {
        @apply tw-u-f32a783bfd;
    }

    .notice-item {
        @apply tw-u-1b22a12179;
    }

    .van-tabbar-item__text {
        @apply tw-u-8ced3aadb7;
    }

    .van-tabbar-item img {
        @apply tw-u-1f51dbd5ee;
    }

    .tabbar-font {
        @apply tw-u-9efe9252d4;
    }

    .footer {
        @apply tw-u-5fdba5823f;
    }

    .footer-search {
        @apply tw-u-44fd6743be;
    }

    .footer-data {
        @apply tw-u-348512b955;
    }

    .search-title-div {
        @apply tw-u-1b279c8450;

        span {
            @apply tw-u-276eb226e0;
        }

        span:last-child {
            @apply tw-u-ec94adf6e2;
        }
    }
    .search-input {
        @apply tw-u-a6f658cf29;
    }
    .search-input::placeholder {
        @apply tw-u-ec94adf6e2;
    }
    .search-icon {
        @apply tw-u-d3340657de;
    }
    .footer-search-input {
        @apply tw-u-8aefe035c3;
    }
    .footer-data-title {
        @apply tw-u-c444971b54;
    }
}
.main-mobile {
    @apply tw-u-2d30943fe6;
}
</style>
