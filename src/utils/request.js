import axios from "axios";
import { Toast } from "vant";

// 创建 axios 实例
const service = axios.create({
    // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    timeout: 5000, // 请求超时时间
    headers: {
        "Content-Type": "application/json;charset=utf-8",
    },
    withCredentials: true,
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 例如：添加 token
        config.headers["Token"] = localStorage.getItem("token");

        return config;
    },
    error => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;

        // 如果返回的状态码不是200，说明接口请求有误
        if (res.Code !== 0) {
            Toast.fail(res.message || "Error");
            return Promise.reject(new Error(res.message || "Error"));
        } else {
            return res;
        }
    },
    error => {
        console.error("Response error:", error);
        Toast.fail(error.message || "Request failed");
        return Promise.reject(error);
    }
);

export default service;
