<template>
    <!-- 底部/侧边报表入口导航 -->
    <van-tabbar
        v-model="currentActive"
        class="tabbar absolute inset-x-0 bottom-0 box-border h-[78px] w-full overflow-hidden"
        @change="changeTabbar"
        :border="false"
    >
        <van-tabbar-item @click="handleTabClick">
            <template #icon="props">
                <img class="h-8 w-8 max-w-full" :src="tab4" :class="{ active: props.active }" />
            </template>
            <span class="tabbar-font truncate text-xl text-jili-dark">{{ $t("i18_Report") }}</span>
        </van-tabbar-item>
    </van-tabbar>
</template>

<script>
import tab1 from "@/assets/svg/tab1.svg";
import tab2 from "@/assets/svg/tab2.svg";
import tab3 from "@/assets/svg/tab3.svg";
import tab4 from "@/assets/svg/tab4.svg";

export default {
    name: "Tabbar",
    props: {
        value: {
            type: [Number, String],
            default: 0,
        },
        config: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            tab1, // 预留的导航图标资源
            tab2, // 预留的导航图标资源
            tab3, // 预留的导航图标资源
            tab4, // 当前报表导航图标
            currentActive: this.value, // 当前选中的导航项
            isDirection: "", // 当前屏幕方向
        };
    },
    watch: {
        value(val) {
            this.currentActive = val;
        },
        "$store.getters.direction": {
            handler(newVal, oldVal) {
                this.isDirection = newVal;
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        /**
         * 点击导航项时通知父组件打开报表页
         */
        handleTabClick() {
            this.$emit("update:click");
        },
        /**
         * 同步 Vant Tabbar 当前选中值
         * @param {Number|String} val 当前选中项
         */
        changeTabbar(val) {
            this.$emit("input", val);
        },
    },
};
</script>

<style lang="scss" scoped>
/* Vant Tabbar 内部结构需要深度选择器覆盖，Tailwind 无法直接作用到第三方内部节点 */
::v-deep .van-tabbar-item__text {
    @apply truncate;
}

/* Vant 激活态由组件内部 class 控制，需要保留深度覆盖以维持原有渐变和图标滤镜 */
::v-deep .van-tabbar-item {
    @apply relative min-w-0 flex-1 box-border border border-solid bg-black;
    border-color: rgba(228, 195, 144, 0.2);
    color: #d6a357;
    background-image: linear-gradient(to bottom, rgba(66, 46, 16, 1), rgba(255, 255, 255, 0));
}

::v-deep .van-tabbar-item img {
    filter: brightness(0) saturate(100%) invert(67%) sepia(31%) saturate(1012%)
        hue-rotate(358deg) brightness(91%) contrast(50%);
}

::v-deep .van-tabbar-item--active {
    @apply text-jili-dark;
    border-color: #000 !important;
    background-image: linear-gradient(to bottom, rgba(253, 224, 71, 1), rgba(234, 179, 8, 1)) !important;
}

::v-deep .van-tabbar-item--active img {
    filter: inherit !important;
}
</style>
