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
    @apply tw-u-671d1f8c39;
}

#app {
    @apply tw-u-ce6ecb6b6f;
}

::-webkit-scrollbar {
    @apply tw-u-5c8e655a90;
}

* {
    @apply tw-u-fad84dfc30;
}

</style>
