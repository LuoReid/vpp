import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'
Vue.use(Router)

const load = (path) => {
  return (resolve) => require([`@/views/${path}`], resolve)
}
const createRouter = [
  {
    path: '/', redirect: { name: 'plant' }, component: Layout, children: [
      {
        path: 'plant', name: 'plant', redirect: { name: 'plantDashboard' }, component: load('plant/Index'), children: [
          { path: 'dashboard', name: 'plantDashboard', component: load('plant/Dashboard') },
          { path: 'remote', name: 'plantControl', component: load('plant/RemoteControl') },
          { path: 'trading', name: 'plantTrading', component: load('plant/PowerTrading') },
          { path: 'report', name: 'plantReport', component: load('plant/Report') },
        ]
      }
    ]
  },
  { path: '/login', name: 'login', component: load('Login') },
  { path: '*', name: '404', component: load("NotFound") }
]

const r = () => new Router({ mode: 'history', routes: createRouter })

const router = r()
export default router