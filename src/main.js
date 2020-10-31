import Vue from "vue";
import App from "./App.vue";
import router from './router'
import store from "./store";
import api from './service/api'
import './util/permission'

Vue.config.productionTip = false;

import moment from 'moment'
import 'moment/locale/en-au'
moment.locale('en-au');

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);

Vue.prototype.$api = api

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
