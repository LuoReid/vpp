
import axios from 'axios'
// create an axios instance
import router from '../router'
import store from '../store'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 * 60 * 3, // request timeout
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  transformRequest: [(data) => {
    // console.log('axios param:', data)
    if (data) {
      return Object.entries(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    } else {
      return data
    }
  }],
  transformReponses: [(data) => {
    return data
  }]
})

service.interceptors.request.use(
  config => {
    config.headers['Authorization'] = localStorage.getItem("token")
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      if (res.code === 419) {
        // console.log('log store:',store)
        store.dispatch('logout').then(() => {
          router.push({ name: "login", })
        })

        return res
      }
      if ([422].includes(res.code)) {
        return res
      }
      return Promise.reject()
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
