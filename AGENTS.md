# 全局 AGENTS.md

## 输出语言
- 默认使用中文回答。

## 编码规范（强制）
- 所有文件必须使用 UTF-8 无 BOM。
- 禁止使用 GBK / ANSI。
- 禁止出现乱码。

## 代码要求
- 返回完整可运行代码。
- 不省略关键逻辑。

## Vue2 注释规范（强制）

### 一、JS 注释规范

#### 1. 方法注释（必须）
- 每个 `methods` 方法必须有注释。
- 使用 `/** */` 格式。

示例：
```js
/**
 * 获取用户列表
 * @param {Number} page 当前页码
 * @param {Number} size 每页数量
 * @returns {Promise}
 */
getUserList(page, size) {

}
```

#### 2. 关键逻辑注释（必须）
- 复杂逻辑必须写清楚“做什么 + 为什么”。

示例：
```js
// 根据状态过滤数据（后端未提供过滤）
const activeList = list.filter(item => item.status === 1);
```

#### 3. data 字段注释
- 每个重要字段必须说明用途。

示例：
```js
data() {
    return {
        userList: [], // 用户列表数据
        loading: false, // 加载状态
        total: 0, // 总条数
    };
}
```

#### 4. 生命周期注释

示例：
```js
/**
 * 页面初始化加载数据
 */
mounted() {
    this.getUserList();
}
```

### 二、DOM（template）注释规范

#### 1. 模块注释（必须）

示例：
```vue
<!-- 用户列表 -->
<div class="user-list">
</div>
```

#### 2. 条件渲染说明

示例：
```vue
<!-- 无数据时显示 -->
<div v-if="!userList.length">
    暂无数据
</div>
```

#### 3. 关键结构说明

示例：
```vue
<!-- 用户信息卡片 -->
<div v-for="item in userList" :key="item.id">
</div>
```

### 三、CSS 注释规范

#### 1. 模块注释（必须）

示例：
```css
/* 用户列表区域 */
.user-list {
}
```

#### 2. 特殊样式说明

示例：
```css
/* 高亮选中状态 */
.active {
    color: red;
}
```

#### 3. 避免无意义注释（强制）
- 禁止只重复代码含义，例如：
```css
/* 红色 */
color: red;
```

### 四、通用规则（重要）
- 注释必须使用中文。
- 注释要说明“用途”，不是重复代码。
- 不写无意义注释。
- 复杂逻辑必须解释原因。
- 模板结构必须有模块说明。

### 五、输出要求
- 生成 Vue2 代码时必须包含完整注释。
- 不允许省略注释。

## Project Structure & Module Organization
This repository is a Vue 2 + Vue CLI H5 project. Main code lives in `src/`.
- `src/pages/`: page-level views.
- `src/components/`: reusable UI components.
- `src/api/`: API request wrappers.
- `src/router/`, `src/store/`, `src/i18n/`: routing, state, and localization.
- `src/utils/`, `src/mixins/`, `src/constants/`: shared helpers and constants.
- `src/assets/`: static assets imported by source code.
- `public/index.html`: HTML template entry.

Keep feature changes localized: page logic in `pages`, shared logic in `components`/`utils`, and network access in `api`.

## Build, Test, and Development Commands
Install dependencies:
```bash
npm install
```

Run local dev server (hot reload):
```bash
npm run serve
```

Build bundles:
```bash
npm run build
npm run build:dev
npm run build:test
npm run build:prod
```

Quality and formatting:
```bash
npm run lint
npm run format
```

Use `build:test` before QA deployments and `build:prod` for release artifacts.

## Coding Style & Naming Conventions
- Use UTF-8 (no BOM) for all files.
- Use 4 spaces (no tabs), semicolons, double quotes, max line length 100.
- Follow ESLint + Prettier config in `.eslintrc.js` and `.prettierrc`.
- Vue SFC naming: components in PascalCase (e.g., `UserCard.vue`), route pages by feature path (e.g., `pages/order/List.vue`).
- JS identifiers: `camelCase`; constants: `UPPER_SNAKE_CASE`.

## Testing Guidelines
There is currently no dedicated `npm test` script in this snapshot. Minimum validation for each change:
- `npm run lint`
- `npm run build:test` (or `npm run build`)
- Manual verification on affected pages and flows.

If adding tests, place unit tests under `tests/unit/` with `*.spec.js` naming.

## Commit & Pull Request Guidelines
Git history metadata is not available in this workspace snapshot, so follow Conventional Commits:
- `feat: ...`, `fix: ...`, `refactor: ...`, `chore: ...`

PRs should include:
- Scope and purpose.
- Linked issue/task ID.
- Screenshots or screen recordings for UI changes.
- Validation evidence (lint/build/manual test notes).

## Agent-Specific Notes
- Keep changes minimal and module-scoped.
- Do not mix refactors with business fixes in one PR.
- Update related docs/config when behavior or scripts change.
