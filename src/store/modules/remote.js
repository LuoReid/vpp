import remote from '@/service/remote'
export default {
  namespaced: true,
  state() {
    return {

    }
  },
  getters: {},
  mutations: {},
  actions: {
    inverters({ }, param) {
      return remote.inverters(param)
    },
    control({ }, param) {
      return remote.control(param)
    }
  }
}