import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import iView from "iview";
import "iview/dist/styles/iview.css";
import "./icons";
import "./components/public/common"; //挂载common下组件到全局
import moment from "moment";
import gobal from "./global";
moment.locale("zh-cn");

import axios from 'axios'
import {get, post, put, deletes} from './axios/http'
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$put = put
Vue.prototype.$delete = deletes

Vue.prototype.$moment = moment;
Vue.prototype.$containStr = (text, str) => {
  if (!text || !str) return true;
  return (
    str.indexOf(text) >= 0 ||
    pinyin.convertToPinyin(str, "", true).indexOf(text.split(" ").join("")) >= 0
  );
};

import clickoutside from "@/directives/clickoutside";
Vue.directive("click-outside", clickoutside);
import transferdom from "@/directives/transfer-dom";
Vue.directive("transfer", transferdom);
Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(gobal);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
