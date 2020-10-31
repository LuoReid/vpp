/*
File Name: api.js
Created Date: 2020-03-10 17:15:35
Author: yeyong
Last modified: 2020-06-22 17:05:10
*/
import request from './index'
const api = {
  login: payload => {
    return request.post("/api/login", payload)
  },
}

export default api
