<template>
    <div
        class="floating-menu"
        :style="{ top: position.y + 'px', left: position.x + 'px' }"
        ref="menu"
        @touchstart="startDrag"
        @touchmove="onDrag"
        @touchend="endDrag"
    >
        <!-- Avatar Toggle -->
        <div class="avatar-wrapper" @click="toggleMenu">
            <img src="@/assets/global/avatar.png" alt="avatar" class="avatar" />
        </div>

        <!-- Icons -->
        <div
            v-for="(item, index) in menuItems"
            :key="index"
            class="icon-wrapper"
            :ref="'icon' + index"
        >
            <img :src="item.img" alt="avatar" class="avatar" />
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
            menuOpen: false,
            dragging: false,
            startX: 0,
            startY: 0,
            position: { x: 15, y: 36 },
            menuItems: [{ img: F1 }, { img: F2 }, { img: F3 }, { img: F4 }, { img: F5 }],
        };
    },
    methods: {
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
            this.animateIcons();
            this.animateMenuWidth();
        },
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
        startDrag(e) {
            this.dragging = true;
            this.startX = e.touches[0].clientX - this.position.x;
            this.startY = e.touches[0].clientY - this.position.y;
        },
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

            // 限制范围（最小边界 10px）
            const minX = 10;
            const minY = 10;
            const maxX = screenWidth - menuWidth - 10;
            const maxY = screenHeight - menuHeight - 10;

            this.position.x = Math.min(Math.max(offsetX, minX), maxX);
            this.position.y = Math.min(Math.max(offsetY, minY), maxY);
        },
        endDrag() {
            this.dragging = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.floating-menu {
    background-color: rgba(0, 0, 0, 0.8);;
    border-radius: 65px;
    position: fixed;
    z-index: 9999;
    display: flex;
    align-items: center;
    height: 110px;
    width: 110px;
    touch-action: none;
}

.avatar-wrapper {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
}

.avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.icon-wrapper {
    margin-left: 8px;
    backdrop-filter: blur(6px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: translateX(0);
    color: white;
    font-size: 20px;

    img {
        width: 60px;
        height: 60px;
    }
}
</style>
