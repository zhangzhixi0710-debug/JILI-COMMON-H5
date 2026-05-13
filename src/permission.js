import router from "./router";
import { setLanguage } from "@/i18n";

// 全局前置守卫
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || location.href; // 设置title

    let lang = to.query.lang;

    if (!lang) {
        lang = to.params && to.params.prefix ? to.params.prefix : "en-US";
    }

    if (lang) {
        setLanguage(lang);
    }

    const token = to.query.token;
    if (token) {
        localStorage.setItem("token", token);
    }

    // 设置页面标题
    if (to.meta.title) {
        document.title = to.meta.title;
    }

    next();
});
