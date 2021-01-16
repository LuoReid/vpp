import api from '@/service/api'
export default {
  namespaced: true,
  state() {
    return {

    }
  },
  getters: {},
  mutations: {},
  actions: {
    saveUser: ({ }, param) => api.saveUser(param),
    delete:({},id) => api.delUser(id)
  }
}