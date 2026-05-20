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

