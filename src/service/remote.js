
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
  reports: param => request.get(`/web/remotes`, { params: param })
}
export default remote