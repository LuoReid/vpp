
import request from './index'
const api = {
  login: payload => {
    return request.post("login", payload)
  },
  getPlant:id => request.get('/web')
}

export default api
