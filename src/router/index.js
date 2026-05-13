import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routes = [
    {
        path: "/",
        name: "home",
        redirect: "/:prefix/ingame",
    },
    {
        path: "/:prefix/ingame",
        name: "DynamicLayout",
        component: () => import(/* webpackChunkName: "DynamicLayout" */ "@/layouts/DynamicLayout.vue"),
    },
];

const createRouter = () => {
    return new Router({
        mode: "history",
        base: process.env.BASE_URL,
        scrollBehavior: () => ({
            y: 0,
        }),
        routes: routes,
    });
};

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => {
        if (err && err.name != "NavigationDuplicated") this.replace("/404");
    });
};

const router = createRouter();

export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

export default router;
