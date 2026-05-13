import Vue from "vue";
import VueI18n from "vue-i18n";
import enUS from "./locales/en-US";
import zhCN from "./locales/zh-CN";
import zhTW from "./locales/zh-TW";
import viVN from "./locales/vi-VN";
import { langMap, $locale } from "@/utils/language";

Vue.use(VueI18n);

const defaultLocal = "en-US";

const messages = {
    "en-US": enUS,
    "zh-CN": zhCN,
    "zh-TW": zhTW,
    "vi-VN": viVN,
};

const overLocal = {
    "en-US": "en",
    "zh-CN": "cn",
    "zh-TW": "tw",
    "vi-VN": "🇻🇳",
};

const resultLocal = {
    en: "en-US",
    cn: "zh-CN",
    tw: "zh-TW",
    "🇻🇳": "vi-VN",
};

export function getLanguage() {
    // 检查 localStorage 中是否有保存的语言设置
    const savedLang = localStorage.getItem("lang");
    if (savedLang && savedLang !== "undefined") {
        // 同步 Element-UI 语言
        if (langMap[resultLocal[savedLang]]) {
            $locale.use(langMap[resultLocal[savedLang]]);
        }
        return resultLocal[savedLang];
    }

    // 获取浏览器语言
    const browserLang = navigator.language || navigator.userLanguage;
    const shortLang = browserLang.split("-")[0].toLowerCase();

    let result = "";
    if (shortLang === "zh") {
        result = browserLang.includes("TW") || browserLang.includes("HK") ? "zh-TW" : "zh-CN";
    } else if (resultLocal[shortLang]) {
        result = resultLocal[shortLang];
    } else {
        result = "en-US";
    }

    // 同步 Element-UI 语言
    if (langMap[result]) {
        $locale.use(langMap[result]);
    }
    localStorage.setItem("lang", overLocal[result] || overLocal[defaultLocal]);

    return result;
}

export function getLanguageValue() {
    // 检查 localStorage 中是否有保存的语言设置
    let lang = localStorage.getItem("lang");
    if (lang && lang !== "undefined") {
        return resultLocal[lang];
    }

    return getLanguage();
}

export const i18n = new VueI18n({
    locale: getLanguage(),
    messages,
});

// 切换语言的方法
export const setLanguage = lang => {
    // 同步 Element-UI 语言
    lang = overLocal[lang] ? lang : defaultLocal;

    $locale.use(langMap[lang]);
    i18n.locale = lang;
    localStorage.setItem("lang", overLocal[lang]);
};

export default i18n;
