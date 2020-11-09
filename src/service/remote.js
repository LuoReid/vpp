
import request from './index'
const remote = {
  inverters: param => {
    return request.get('/web/inverters', { params: param })
  },
  control: param => {
    return request.post('/web/inverters', param)
  }
}
export default remote