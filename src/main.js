import Vue from "vue";
import App from "./App.vue";
import router from './router'
import store from "./store";
import api from './service/api'
import './util/permission'

Vue.config.productionTip = false;

import moment from 'moment'
import 'moment/locale/en-au'
// moment.tz.setDefault("Australia/Adelaide")
moment.locale('en-au');

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);

Vue.prototype.$api = api

// import * as VueGoogleMaps from 'vue2-google-maps'
// Vue.use(VueGoogleMaps,{load:{key:'AIzaSyBTAHJaBcMaESWwHLgdqGSJt4JCBM2WA6o',libraries:'places'}})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
