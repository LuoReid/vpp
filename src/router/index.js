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
          { path: 'trading', name: 'plantTrading', component:PowerTrading },
          { path: 'report', name: 'plantReport', component:Report },
          { path: 'report/:id', name: 'plantReportDetail', props: true, component: ReportDetail },
        ]
      }
    ]
  },
  { path: '/login', name: 'login',component: Login },
  { path: '*', name: '404', component: NotFound }
]

const r = () => new Router({ mode: 'history',base:'/vpp/', routes: createRouter })

const router = r()
export default router