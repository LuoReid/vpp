import remote from '@/service/remote'
export default {
  namespaced: true,
  state() {
    return {
      retailers: []
    }
  },
  getters: {
    retailers: state => state.retailers,
  },
  mutations: {
    retailers: (state, val) => state.retailers = val
  },
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
    getPlant: ({ }, id) => remote.getPlant(id),
    getPlantPowers: ({ }, param) => remote.getPlantPowers(param),
    reports({ }, param) {
      return remote.reports(param)
    },
    reportById: ({ }, id) => remote.reportById(id),
    inverterAlert: ({ }, param) => remote.inverterAlert(param),
    syncDevice: ({ }) => remote.syncDevice(),
    syncLogs: ({ }, param) => remote.syncLogs(param),
    getPlantRetailers: ({ commit}, param) => {
      return remote.getPlantRetailers().then(res => {
        commit('retailers', res.data)
        return res
      }) 
    },
  }
}