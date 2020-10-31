
import request from './index'
const api = {
  login: payload => {
    return request.post("login", payload)
  },
}

export default api
