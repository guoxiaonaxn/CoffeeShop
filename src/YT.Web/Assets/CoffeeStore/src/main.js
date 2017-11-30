// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue"
import FastClick from "fastclick"
import router from "./router"
import App from "./App"
import BaiduMap from "vue-baidu-map"
import store from "./store"
// 微信支持
import {
    WechatPlugin,
    AjaxPlugin,
    AlertModule,
    querystring
} from "vux"
Vue.use(AjaxPlugin)
Vue.use(WechatPlugin)
Vue.use(AlertModule)
Vue.use(BaiduMap, {
    ak: "pYjoSR2GThuatLt06MlaKzRgSWy4Zztq"
})
Vue.use(router)
    // 点击延迟
FastClick.attach(document.body)
    // 输出日志
Vue.config.productionTip = false
Vue.prototype.showBox = function(title, content) {
    AlertModule.show({
        title: title,
        content: content
            //  onShow() {},
            // onHide() {}
    })
}
Vue.prototype.wxConfig = function(url) {
    const service = "http://103.45.102.47:8888/api/wechat/config";
    Vue.http.post(service + "?url=" + url).then(r => {
        if (r && r.data) {
            Vue.wechat.config({
                debug: false,
                appId: r.data.result.appId, // 必填，公众号的唯一标识   由接口返回
                timestamp: r.data.result.timestamp, // 必填，生成签名的时间戳 由接口返回
                nonceStr: r.data.result.nonceStr, // 必填，生成签名的随机串 由接口返回
                signature: r.data.result.signature, // 必填，签名 由接口返回
                jsApiList: ["chooseImage", "previewImage", "getLocation", "openLocation", "uploadImage"]
            });
        }
    })
}
Vue.prototype.callTitle = function(value) {
    this.$store.commit("calltitle", value)
}
Vue.prototype.toRight = function() {
    const paths = window.location.href.split("?");
    const params = querystring.parse(paths[1].split("&")[0]);
    const url = `http://coffee.leftins.com/#/author?code=${params.code}`
    window.location.href = url
}

router.afterEach(() => {
    store.commit("updateLoading", false)
})
router.beforeEach((to, from, next) => {
        store.commit("updateLoading", true)
        const userId = sessionStorage.getItem("userId");
        if (window.location.href.indexOf("code") >= 0 && !userId) {
            Vue.prototype.toRight();
        }
        if (to.path === "/author" && userId) {
            next("/coffee");
            return false;
        }
        if (!userId && to.path !== "/author") {
            next("/author");
            return false;
        }
        next();
    })
    /* eslint-disable no-new */
new Vue({
    store,
    router,
    render: h => h(App)
}).$mount("#app-box")