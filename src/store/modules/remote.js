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
    },
    plants({ }, param) {
      return remote.plants(param)
    },
    reports({ }, param) {
      return remote.reports(param)
    },
    reportById: ({ }, id) => remote.reportById(id)
  }
}