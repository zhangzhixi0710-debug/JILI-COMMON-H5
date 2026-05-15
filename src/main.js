import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from './i18n'
import "./permission";
// 引入rem自适应工具
import '@/utils/rem.js'
import '@/assets/styles/common.scss'
import BorderImage  from '@assets/images/list/jili.webp'

import { Tabbar, TabbarItem, Loading, Button, List } from 'vant'

Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Loading)
Vue.use(Button)
Vue.use(List)

import "vant/lib/index.css";

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

Vue.use(VueAwesomeSwiper)

Vue.prototype.$jili = BorderImage

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
}).$mount("#app");
