import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import iView from "view-design";
import "view-design/dist/styles/iview.css";
import FullCalendar from 'vue-full-calendar'
import "./icons";
import "./components/public/common"; //挂载common下组件到全局
import moment from "moment";
import gobal from "./global";
import WebIM from './utils/WebIM';
import preventReClick from './store/modules/preventReClick' //防多次点击，重复提交
moment.updateLocale("zh-cn", {
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    longDateFormat: {
        LT: 'HH:mm'
    },
    week: {
        dow: 1, // 星期的第一天是星期一
        doy: 7 // 年份的第一周必须包含1月1日 (7 + 1 - 1)
    }
});
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
    WebIM,
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