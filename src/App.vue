<template>
    <!-- 应用根布局 -->
    <div id="app" class="relative h-full w-full overflow-x-hidden">
        <DynamicLayout class="h-full" />
    </div>
</template>

<script>
import DynamicLayout from "@/layouts/DynamicLayout.vue";

export default {
    components: {
        DynamicLayout,
    },
};
</script>

<style lang="scss">
/* 全局基础样式用于统一根节点高度、字体和滚动条兼容，Tailwind Preflight 已关闭以避免影响既有组件 */
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
    font-family: "Microsoft JhengHei", "微軟正黑體", "PingFang SC", "Microsoft YaHei", sans-serif !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

#app {
}

/* 全局隐藏滚动条，兼容移动端嵌入 WebView 的历史页面滚动体验 */
::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent;
}

* {
    scrollbar-width: none;
    box-sizing: border-box;
}
</style>
