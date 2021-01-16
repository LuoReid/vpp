
import request from './index'
const api = {
  login: payload => {
    return request.post("login", payload)
  },
  getPlant: id => request.get('/web'),
  getUsers: param => request.get('/web/users', { params: param }),
  saveUser: param => request.post('/web/users', param),
  delUser: id => request.delete(`/web/users/${id}`),
}

export default api
