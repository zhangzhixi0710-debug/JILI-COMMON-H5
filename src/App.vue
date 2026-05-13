<template>
    <div id="app">
        <DynamicLayout style="height: 100%" />
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
    width: 100%;
    height: 100%;
    position: relative;
    overflow-x: hidden;
}

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
