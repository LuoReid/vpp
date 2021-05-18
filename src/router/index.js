import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'
import Login from '@/views/Login'
import NotFound from '@/views/NotFound'
import PlantLayout from '@/views/plant/Index'
import Dashboard from '@/views/plant/Dashboard'
import Control from '@/views/plant/RemoteControl'
import PowerTrading from '@/views/plant/PowerTrading'
import Report from '@/views/plant/Report'
import ReportDetail from '@/views/plant/ReportDetail'
Vue.use(Router)

// const load = (path) => {
//   return (resolve) => require([`@/views/${path}`], resolve)
// }

const load = view => () => import(/* webpackChunkName: "p-[request]" */ `../views/${view}.vue`)
const createRouter = [
  {
    path: '/', redirect: { name: 'plant' }, component: Layout, children: [
      {
        path: 'plant', name: 'plant', redirect: { name: 'plantDashboard' }, component: PlantLayout, children: [
          { path: 'dashboard', name: 'plantDashboard', component: () => import(/* webpackChunkName: "plantdashboard" */ '../views/plant/Dashboard.vue') },
          { path: 'remote', name: 'plantControl', component: () => import(/* webpackChunkName: "plantcontrol" */ '../views/plant/RemoteControl.vue') },
          { path: 'alert', name: 'plantAlert', component: () => import(/* webpackChunkName: "plantalert" */ '../views/plant/Alert.vue') },
          { path: 'report', name: 'plantReport', component: () => import(/* webpackChunkName: "plantreport" */ '../views/plant/Report.vue') },
          { path: 'report/:id', name: 'plantReportDetail', props: true, component: () => import(/* webpackChunkName: "reprotdetail" */ '../views/plant/ReportDetail.vue') },
          { path: ':id', name: 'plantDetail', props: true, component: () => import(/* webpackChunkName: "plantdetail" */ '../views/plant/Detail.vue') },
        ]
      },
      { path: 'plantMap', name: 'plantMap', component: () => import(/* webpackChunkName: "plantmap" */ '../views/plant/PlantMap.vue') },
      { path: 'data', name: 'data', component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/Index.vue') },
      { path: 'account', name: 'account', component: () => import(/* webpackChunkName: "account" */ '../views/account/Index.vue') },
      { path: 'account/:id', name: 'accountEdit', component: () => import(/* webpackChunkName: "account-detail" */ '../views/account/Edit.vue') },
      { path: 'log', name: 'log', component: () => import(/* webpackChunkName: "log" */ '../views/plant/Log.vue') },
    ]
  },
  // { path: '/task-report/:id', name: 'taskReport', component: load('plant/ReportDetail') },
  { path: '/task-report/:id', name: 'taskReport', props: true, component: () => import(/* webpackChunkName: "task-report" */ '../views/plant/ReportDetail.vue') },
  { path: '/login', name: 'login', component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue') },
  { path: '*', name: '404', component: () => import(/* webpackChunkName: "404" */ '../views/NotFound.vue') }
]

const r = () => new Router({ mode: 'history', routes: createRouter })

const router = r()
export default router