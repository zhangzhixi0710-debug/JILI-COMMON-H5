<template>
    <div class="single-images-list">
        <div class="single-images-title">
            {{ $t("i18_BaseGame") }}
        </div>

        <template v-if="item.PlateSymbolExtend">
            <div class="single-images-contain">
                <!-- 盘面展示 -->
                <div
                    class="single-images-middle single-images-middle-free"
                    v-if="item.PlateSymbolExtend?.length"
                >
                    <div
                        class="single-images-middle-div-new"
                        v-for="(images, i) in item.PlateSymbolExtend"
                        :key="i"
                    >
                        <div
                            v-for="(img, imgIndex) in images"
                            :key="imgIndex"
                            class="single-images-back-div"
                            :class="{
                                'single-images-back-active': isAwardActive(i, imgIndex),
                            }"
                        >
                            <img
                                :data-img="img"
                                :class="{
                                    'single-images-active': isAwardActive(i, imgIndex),
                                }"
                                :src="img"
                            />
                            <div
                                class="single-images-back"
                                v-if="isAwardBackActive(i, imgIndex)"
                            ></div>
                        </div>
                    </div>

                    <div class="single-images-active-header" v-if="showHeader">
                        <span v-if="changeList.Win">{{ formatNumber(changeList.Win) }}</span>
                        <span>→</span>
                    </div>
                </div>

                <!-- 下方中奖符号选项按钮 -->
                <div class="single-images-footer" v-if="item.AwardDataVec?.length">
                    <div
                        v-for="(opt, i) in item.AwardDataVec"
                        :key="i"
                        :class="{ 'single-footer-active': isFooterActive(opt) }"
                        @click.stop="handleClick(opt)"
                    >
                        <img :src="opt.img" alt="" />
                        <span>{{ formatNumber(opt.Win) }}</span>
                    </div>
                </div>
            </div>
        </template>

        <div class="single-images-footer-tip">
            <!-- 一般游戏赢分 -->
            <div v-if="item.TotalWin" class="single-images-event">
                <span>{{ $t("MainGameWin") }}</span>
                <span>{{ formatNumber(item.TotalWin) || 0 }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { isAwardActive as checkAward } from "@/calculate/fgp";

export default {
    name: "ImageDetail",
    props: {
        uuid: { type: String, required: false },
        item: { type: Object, required: true },
    },
    data() {
        return {
            changeList: {},
        };
    },
    computed: {
        showHeader() {
            return !!this.changeList?.list;
        },
    },
    methods: {
        handleClick(opt) {
            this.changeList = opt;
        },
        isAwardActive(colIndex, rowIndex) {
            // 当前选中的奖项才高亮
            if (!this.changeList?.list) return false;
            return !!this.changeList.list[colIndex]?.includes(rowIndex);
        },
        isAwardBackActive(colIndex, rowIndex) {
            // 背景高亮：当前奖项范围之外的格子
            return this.changeList?.list
                ? !this.changeList.list[colIndex]?.includes(rowIndex)
                : false;
        },
        isFooterActive(opt) {
            return this.item.uuid === this.uuid && opt.uuid === this.changeList.uuid;
        },
        formatNumber(val) {
            return Number(val).toFixed(2) * 1;
        },
    },
};
</script>

