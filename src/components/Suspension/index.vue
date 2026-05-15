<template>
    <!-- 可拖拽悬浮菜单 -->
    <div
        class="floating-menu fixed z-[9999] flex h-[110px] w-[110px] touch-none items-center rounded-[65px] bg-black bg-opacity-80"
        :style="{ top: position.y + 'px', left: position.x + 'px' }"
        ref="menu"
        @touchstart="startDrag"
        @touchmove="onDrag"
        @touchend="endDrag"
    >
        <!-- 悬浮菜单开关头像 -->
        <div class="h-[110px] w-[110px] flex-shrink-0 overflow-hidden rounded-full" @click="toggleMenu">
            <img src="@/assets/global/avatar.png" alt="avatar" class="h-full w-full object-cover" />
        </div>

        <!-- 展开后的快捷入口图标 -->
        <div
            v-for="(item, index) in menuItems"
            :key="index"
            class="icon-wrapper ml-2 flex items-center justify-center rounded-full text-xl text-white opacity-0"
            :ref="'icon' + index"
        >
            <img :src="item.img" alt="avatar" class="h-[60px] w-[60px] object-cover" />
        </div>
    </div>
</template>

<script>
import { gsap } from "gsap";
import F1 from "@/assets/global/1.png";
import F2 from "@/assets/global/2.png";
import F3 from "@/assets/global/3.png";
import F4 from "@/assets/global/4.png";
import F5 from "@/assets/global/5.png";
export default {
    name: "Suspension",
    data() {
        return {
            menuOpen: false, // 菜单是否展开
            dragging: false, // 是否正在拖拽悬浮菜单
            startX: 0, // 触摸点与菜单左侧的横向距离
            startY: 0, // 触摸点与菜单顶部的纵向距离
            position: { x: 15, y: 36 }, // 悬浮菜单当前位置
            menuItems: [{ img: F1 }, { img: F2 }, { img: F3 }, { img: F4 }, { img: F5 }], // 快捷入口图标
        };
    },
    methods: {
        /**
         * 切换悬浮菜单展开状态
         */
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
            this.animateIcons();
            this.animateMenuWidth();
        },
        /**
         * 根据展开状态播放快捷入口位移动画
         */
        animateIcons() {
            this.menuItems.forEach((_, index) => {
                const el = this.$refs["icon" + index][0];
                const offsetX = window.px2rem(15 + index * 36);

                if (this.menuOpen) {
                    gsap.to(el, {
                        x: offsetX,
                        opacity: 1,
                        scale: 1,
                        duration: 0,
                        ease: "back.out(1.7)",
                        delay: index * 0.05,
                    });
                } else {
                    gsap.to(el, {
                        x: 0,
                        opacity: 0,
                        scale: 0.5,
                        duration: 0,
                        ease: "back.in(1.7)",
                        delay: (this.menuItems.length - index) * 0.03,
                    });
                }
            });
        },
        /**
         * 根据快捷入口数量调整悬浮菜单宽度
         */
        animateMenuWidth() {
            const iconCount = this.menuItems.length;
            const iconWidth = 110;
            const spacing = 0;
            const avatarWidth = 110;

            const totalWidth = this.menuOpen
                ? avatarWidth + iconCount * (iconWidth + spacing)
                : avatarWidth;

            gsap.to(this.$refs.menu, {
                width: window.px2rem(totalWidth),
                duration: 0.4,
                ease: "power2.out",
            });
        },
        /**
         * 开始拖拽时记录触摸点与菜单位置的偏移量
         * @param {TouchEvent} e 触摸事件
         */
        startDrag(e) {
            this.dragging = true;
            this.startX = e.touches[0].clientX - this.position.x;
            this.startY = e.touches[0].clientY - this.position.y;
        },
        /**
         * 拖拽过程中限制菜单始终停留在可视区域内
         * @param {TouchEvent} e 触摸事件
         */
        onDrag(e) {
            if (!this.dragging) return;

            const touch = e.touches[0];
            const menu = this.$refs.menu;

            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            const menuRect = menu.getBoundingClientRect();
            const menuWidth = menuRect.width;
            const menuHeight = menuRect.height;

            const offsetX = touch.clientX - this.startX;
            const offsetY = touch.clientY - this.startY;

            // 限制拖拽范围，避免悬浮菜单被拖出屏幕后无法点击
            const minX = 10;
            const minY = 10;
            const maxX = screenWidth - menuWidth - 10;
            const maxY = screenHeight - menuHeight - 10;

            this.position.x = Math.min(Math.max(offsetX, minX), maxX);
            this.position.y = Math.min(Math.max(offsetY, minY), maxY);
        },
        /**
         * 结束拖拽并恢复点击状态
         */
        endDrag() {
            this.dragging = false;
        },
    },
};
</script>

<style lang="scss" scoped>
/* 悬浮菜单展开动画需要 GSAP 写入 transform，保留初始变换避免动画起点抖动 */
.icon-wrapper {
    backdrop-filter: blur(6px);
    transform: translateX(0);
}
</style>
