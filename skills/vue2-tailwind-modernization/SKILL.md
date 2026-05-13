---
name: vue2-tailwind-modernization
description: 在 Vue2 + Vue CLI4 + Webpack4 项目中引入 Tailwind CSS 并完成 H5+PC 双端样式体系现代化改造。用于需要 Tailwind 与 ElementUI/Vant 共存、保留业务逻辑、渐进迁移 SCSS、兼容 postcss-pxtorem、支持暗黑模式、优化 CSS 体积与首屏性能的场景。
---

# Vue2 Tailwind Modernization

按以下流程在现有 Vue2 项目中落地 Tailwind 改造，强调可回滚、低风险、可渐进迁移。

## 1. 先做兼容性决策

- 锁定当前构建链路版本：`@vue/cli-service`、`webpack`、`postcss-loader`、`autoprefixer`。
- 若项目为 `Vue CLI4 + Webpack4 + postcss-loader@3 + autoprefixer@9`，优先使用 `@tailwindcss/postcss7-compat@2.2.17`。
- 不在当前链路直接上 Tailwind v4。
- 如需 Tailwind v3/v4，先升级到 PostCSS 8（通常伴随 CLI5 或构建升级）。

## 2. 安装与初始化

在项目根目录执行：

```bash
npm i -D tailwindcss@npm:@tailwindcss/postcss7-compat@2.2.17 @tailwindcss/postcss7-compat@2.2.17 postcss@^7 autoprefixer@^9
npx tailwindcss init
```

## 3. 目录结构落地

建立以下目录：

```text
src/
 ├── styles/
 │   ├── tailwind/
 │   │   └── index.css
 │   ├── themes/
 │   │   └── theme.css
 │   └── index.scss
```

约束：

- 旧样式继续保留在 `src/assets/styles/`。
- 新增原子化样式统一进入 `src/styles/tailwind/index.css`。
- 主题变量统一放 `src/styles/themes/theme.css`。

## 4. 核心配置模板

### 4.1 tailwind.config.js

```js
module.exports = {
    mode: "jit",
    purge: {
        content: ["./public/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
        options: {
            safelist: [
                /^tw-bg-/,
                /^tw-text-/,
                /^tw-border-/,
                /^tw-grid-cols-/,
                /^tw-col-span-/,
                "tw-hidden",
                "tw-block",
            ],
        },
    },
    darkMode: "class",
    prefix: "tw-",
    important: "#app",
    corePlugins: {
        preflight: false,
    },
    theme: {
        screens: {
            xs: "360px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
        extend: {
            colors: {
                game: {
                    bg: "#0B1020",
                    panel: "#111827",
                    primary: "#F6C445",
                    accent: "#06B6D4",
                    danger: "#EF4444",
                },
            },
            boxShadow: {
                neon: "0 0 0.5rem rgba(6, 182, 212, 0.45)",
                card: "0 12px 40px rgba(0, 0, 0, 0.35)",
            },
            zIndex: {
                bg: "0",
                video: "10",
                particle: "20",
                content: "40",
                nav: "60",
                popup: "1000",
                toast: "1100",
            },
        },
    },
    variants: {
        extend: {
            opacity: ["disabled"],
            cursor: ["disabled"],
        },
    },
    plugins: [],
};
```

### 4.2 postcss.config.js（兼容 pxtorem）

```js
const path = require("path");

/**
 * 判断是否为 Tailwind 入口文件，避免被 pxtorem 改写
 * @param {String} file 文件路径
 * @returns {Boolean}
 */
function isTailwindEntry(file) {
    if (!file) return false;
    const normalized = file.split(path.sep).join("/");
    return normalized.includes("src/styles/tailwind/");
}

module.exports = {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
        "postcss-pxtorem": {
            rootValue: ({ file }) => {
                const normalized = (file || "").replace(/\\/g, "/");
                if (normalized.includes("/src/pages/pc/")) {
                    return 100;
                }
                return 37.5;
            },
            propList: ["*"],
            selectorBlackList: [/^\.norem/, /^\.no-rem/],
            replace: true,
            mediaQuery: true,
            minPixelValue: 2,
            unitPrecision: 5,
            exclude: file => /node_modules/i.test(file || "") || isTailwindEntry(file),
        },
    },
};
```

### 4.3 样式入口

`src/styles/tailwind/index.css`：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
    .tw-game-panel {
        @apply tw-rounded-2xl tw-bg-white/10 tw-border tw-border-white/20 tw-backdrop-blur-md tw-shadow-card;
    }

    .tw-game-btn {
        @apply tw-inline-flex tw-items-center tw-justify-center tw-px-4 tw-py-2 tw-rounded-xl tw-font-semibold tw-transition;
    }

    .tw-game-btn-primary {
        @apply tw-game-btn tw-bg-game-primary tw-text-black hover:tw-opacity-90;
    }
}
```

`src/styles/themes/theme.css`：

```css
:root {
    --color-bg-page: #0b1020;
    --color-text-main: #f3f4f6;
    --color-panel: rgba(255, 255, 255, 0.12);
}

.dark {
    --color-bg-page: #030712;
    --color-text-main: #e5e7eb;
    --color-panel: rgba(255, 255, 255, 0.08);
}

.tw-bg-page {
    background-color: var(--color-bg-page);
}

.tw-text-main {
    color: var(--color-text-main);
}
```

`src/styles/index.scss`：

```scss
@import "./themes/theme.css";
@import "./tailwind/index.css";
@import "@/assets/styles/common.scss";
```

`src/main.js` 增加：

```js
import "vant/lib/index.css";
import "@/styles/index.scss";
```

## 5. ElementUI / Vant 共存规则

- 关闭 `preflight`，避免重置影响组件库。
- 使用 `prefix: "tw-"` 避免类名冲突。
- 使用 `important: "#app"` 提高原子类优先级，但不污染全局。
- 对 ElementUI/Vant 的深度定制继续采用 SCSS + `::v-deep`。
- 导入顺序遵循：组件库样式 -> Tailwind -> 旧业务样式。

## 6. H5 + PC 响应式规则

- 移动端优先，默认写 H5，再用 `md:/lg:` 增强 PC。
- 推荐断点：`xs 360`、`sm 640`、`md 768`、`lg 1024`、`xl 1280`、`2xl 1536`。
- 布局优先使用 `flex/grid`。
- Tailwind 入口文件必须排除 `pxtorem`，避免原子类尺寸被二次转换。

示例：

```html
<div class="tw-px-4 md:tw-px-8 lg:tw-px-12 tw-text-sm md:tw-text-base lg:tw-text-lg">
    双端响应式容器
</div>
```

## 7. 游戏项目样式分层规范

固定分层：

- `z-bg`：背景层
- `z-video`：视频层
- `z-particle`：粒子层
- `z-content`：内容交互层
- `z-nav`：导航层
- `z-popup`/`z-toast`：弹窗通知层

动画规范：

- 只动画 `transform/opacity`。
- 避免持续动画 `filter/box-shadow/width/height/top/left`。
- 非关键动画延迟启动，首屏优先保证可交互。

## 8. 渐进迁移策略

按页面分批，不做一次性全量重构：

1. 新页面优先用 Tailwind。
2. 旧页面先迁移布局层（容器、栅格、间距）。
3. 保留复杂动效和第三方覆盖在 SCSS。
4. 每迁移一个页面做视觉回归与交互回归。
5. 保留旧样式 1-2 个迭代窗口后清理。

迁移优先级建议：

- 活动页/展示页
- 静态信息页
- 复杂交互页
- 历史深度定制页

## 9. 性能优化清单

- 精准配置 `purge.content`。
- 对动态类名使用 `safelist`。
- 开启 `gzip` 与静态资源 CDN。
- 路由懒加载与重组件按需异步。
- 图片使用 WebP/AVIF 与懒加载。

## 10. 风险与升级路线

当前栈风险控制：

- 不动业务逻辑。
- 不一次性删除旧 SCSS。
- 每次改造限定模块范围。

中期升级建议：

1. 升级到 PostCSS 8。
2. 升级 Tailwind 到 v3 LTS。
3. 评估 Vue3/Nuxt3 升级路径（样式层已提前解耦，可复用）。

## 11. 执行检查项

每次改造完成后必须执行：

```bash
npm run lint
npm run build:test
```

并进行以下人工验证：

- H5 与 PC 断点显示正确
- ElementUI/Vant 关键组件样式未回归
- 首屏渲染、动画与交互流畅
- 暗黑模式切换正常（如已接入）

