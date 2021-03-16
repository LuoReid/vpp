import Vue from "vue";
import Vuex from "vuex";
import api from '../service/api'

Vue.use(Vuex);

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', false, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
const user1 = JSON.parse(localStorage.getItem("user") || '{"name":""}')
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state() {
    return {
      user: JSON.parse(localStorage.getItem("user") || '{"name":""}'),
      token: localStorage.getItem('token'),
      sideOpen: false,
      roles: []
    }
  },
  mutations: {
    user: (state, res) => {
      state.user = res.user
      state.token = res.token
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
    },
    sideOpen: (state, is) => {
      state.sideOpen = is
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  getters: {
    user: state => {
      console.log(' getters :', state.user, state.token)
      return state.user
    },
    hasToken: state => state.token != 'null' && !!state.token,
    sideOpen: state => state.sideOpen,
    roles: state => state.roles,
    token: state => state.token
  },
  actions: {
    setSideOpen({ commit }, value) {
      commit('sideOpen', value)
    },
    setUser({ commit }, user) {
      if (!user) {
        user = JSON.parse(localStorage.getItem("user") || '{"name":""}')
        commit('user', { user: user, token: '' })
      }
    },
    login({ commit }, user) {
      return api.login(user).then(res => {
        if (res.code == 200) {
          commit('user', res)
        }
        return res
      })
    },
    logout({ commit }) {
      //synchro
      // commit('user', { token: null, user: {} })
      //async
      return new Promise((resolve, reject) => {
        try {
          commit('user', { token: null, user: {} })
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    userInfo({ commit, getters }) {
      return api.getUser().then(res => {
        let role = 'guest'
        const user = res.user
        if (user.user_type === 0) {
          role = 'admin'
        } else if ([1, 3].includes(user.role)) {
          role = 'supplier'
        } else if (user.role === 5) {
          role = 'material'
        } else if (user.role === 9) {
          role = 'shop'
        }
        const data = {
          roles: [role], introduction: 'admin',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          name: getters.user.name
        }
        commit('SET_ROLES', data.roles)
        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        // commit('SET_INTRODUCTION', introduction)
        return data
      })
    }
  },
  modules: modules
});
