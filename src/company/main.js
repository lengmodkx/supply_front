import Vue from "vue";
import App from "./App.vue";
import iView from "iview";
import "iview/dist/styles/iview.css";
import moment from "moment";
import router from './router'
moment.locale("zh-cn");

Vue.prototype.$moment = moment;

Vue.config.productionTip = false;
Vue.use(iView);

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
