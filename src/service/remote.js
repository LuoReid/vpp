
import request from './index'
const remote = {
  inverters: param => {
    return request.get('/web/inverters', { params: param })
  },
  control: param => {
    return request.post('/web/inverters', param)
  },
  plants: param => {
    return request.get('/web/plants', { params: param })
  },
  getPlant: id => request.get(`/web/plants/${id}`),
  getPlantPowers: param => request.get(`/web/plants`, { params: { ...param } }),
  reports: param => request.get(`/web/remotes`, { params: param }),
  reportById: id => request.get(`/web/remotes/${id}`),
  inverterAlert: param => request.get(`/web/inverters`, { params: param }),
  syncDevice: () => request.post('/web/devices', { kind: 'sync' }),
  syncLogs: (param) => request.get('/web/sync_logs', { params: param }),
  getPlantRetailers: () => request.get(`/web/plant/retailers`),
}
export default remote