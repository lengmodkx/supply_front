import Vue from "vue";
import App from "./App.vue";
import iView from "view-design";
import "view-design/dist/styles/iview.css";
import moment from "moment";
import router from './router'
moment.locale("zh-cn");

Vue.prototype.$moment = moment;

Vue.config.productionTip = false;
Vue.use(iView);
Vue.filter('timeFilter', function (value) {
    var time = new Date(value);
    var birthday = time.getFullYear() + "年" + (time.getMonth() * 1 + 1) + "月" + (time.getDate()) + "日";
    return birthday
})
new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
