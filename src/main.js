import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import iView from "iview";
import "iview/dist/styles/iview.css";
import FullCalendar from 'vue-full-calendar'
import "./icons";
import "./components/public/common"; //挂载common下组件到全局
import moment from "moment";
import gobal from "./global";
moment.locale("zh-cn");
import './assets/iconfont/iconfont.css'
import {
    get,
    post,
    put,
    deletes
} from './axios/http'
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$put = put
Vue.prototype.$delete = deletes

Vue.prototype.$moment = moment;
// Vue.prototype.$containStr = (text, str) => {
// //     if (!text || !str) return true;
// //     return (
// //         str.indexOf(text) >= 0 ||
// //         pinyin.convertToPinyin(str, "", true).indexOf(text.split(" ").join("")) >= 0
// //     );
// // };

import clickoutside from "@/directives/clickoutside";
Vue.directive("click-outside", clickoutside);
import transferdom from "@/directives/transfer-dom";
Vue.directive("transfer", transferdom);
Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(gobal);
Vue.use(FullCalendar)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
Vue.filter('timeFilter', function (value) {
    var time = new Date(value);
    var birthday = time.getFullYear() + "年" + (time.getMonth() * 1 + 1) + "月" + (time.getDate()) + "日";
    return birthday
})

Vue.filter('timeFilter1', function (value) {
    var time = new Date(value);
    var birthday = (time.getMonth() * 1 + 1) + "月" + (time.getDate()) + "日";
    return birthday
})
Vue.filter('timeFilter2', function (value) {
    var time = new Date(value);
    var birthday = time.getFullYear() + "-" + (time.getMonth() * 1 + 1) + "-" + (time.getDate());
    return birthday
})
Vue.filter('timeFilter3', function (value) {
    var time = new Date(value);
    var birthday = (time.getMonth() * 1 + 1) + "月" + (time.getDate()) + "日" + time.getHours() + "点" + time.getMinutes() + '分';
    return birthday
})
Date.prototype.Format = function (fmt) {
    //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
    return fmt;
};