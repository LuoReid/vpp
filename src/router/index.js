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

const load = (path) => {
  return (resolve) => require([`@/views/${path}`], resolve)
}
const createRouter = [
  {
    path: '/', redirect: { name: 'plant' }, component: Layout, children: [
      {
        path: 'plant', name: 'plant', redirect: { name: 'plantDashboard' }, component: PlantLayout, children: [
          { path: 'dashboard', name: 'plantDashboard', component: Dashboard },
          { path: 'remote', name: 'plantControl', component: Control },
          { path: 'alert', name: 'plantAlert', component: load('plant/Alert') },
          { path: 'report', name: 'plantReport', component: Report },
          { path: 'report/:id', name: 'plantReportDetail', props: true, component: ReportDetail },
          { path: ':id', name: 'plantDetail', props: true, component: load('plant/Detail') },
        ]
      },
      { path: 'plantMap', name: 'plantMap', component: load('plant/PlantMap') },
      { path: 'data', name: 'data', component: load('dashboard/Index') },
      { path: 'account', name: 'account', component: load('account/Index') },
      { path: 'account/:id', name: 'accountEdit', component: load('account/Edit') },
      { path: 'log', name: 'log', component: load('plant/Log') },
    ]
  },
  { path: '/login', name: 'login', component: Login },
  { path: '*', name: '404', component: NotFound }
]

const r = () => new Router({ mode: 'history', routes: createRouter })

const router = r()
export default router