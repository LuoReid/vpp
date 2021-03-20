import api from '@/service/api'
export default {
  namespaced: true,
  state() {
    return {
      user: JSON.parse(localStorage.getItem("user") || '{"name":""}'),
      token: localStorage.getItem('token'),
    }
  },
  getters: {
    user: state => state.user,
    token: state => state.token,
  },
  mutations: {
    user: (state, res) => {
      state.user = res.user
      state.token = res.token
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
    },
    roles: state => state.roles,
    hasToken: state => state.token != 'null' && !!state.token,
  },
  actions: {
    saveUser: ({ }, param) => api.saveUser(param),
    delete: ({ }, id) => api.delUser(id),
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
  }
}