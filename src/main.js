import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

import moment from 'moment'
import 'moment/locale/en-au'
moment.locale('en-au');

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);

new Vue({
  render: h => h(App)
}).$mount("#app");
