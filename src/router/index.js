import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'
Vue.use(Router)

const load = (path) => {
  return () => import(`@/views/${path}`)
}
const createRouter = [
  {
    path: '/', redirect: { name: 'index' }, component: Layout, children: [
      { path: '', name: 'index', component: load('Index') }
    ]
  },
  { path: '/login', name: 'login', component: load('Login') },
  { path: '*', name: '404', component: load("NotFound") }
]

const r = () => new Router({mode:'history',routes:createRouter})

const router = r()
export default router