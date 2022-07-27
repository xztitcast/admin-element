import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import { clearLoginInfo } from '@/utils'

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {}
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  config.headers['token'] = Vue.cookie.get('token')
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token失效
    clearLoginInfo()
    router.push({ name: 'login' })
  }
  return response
}, error => {
  return Promise.reject(error)
})

/**
 * POST请求json数据格式化
 * @param {*} data 
 * @returns 
 */
http.JSON = (data = {}) => {
  http.defaults.headers['Content-Type'] = 'application/json; charset=utf-8'
  return  JSON.stringify(data)
}

/**
 * POST请求formData数据格式化
 * @param {*} data 
 * @returns 
 */
http.FORM = (data = {}) => {
  let form = new FormData()
  for(var i = 0;i < data.length; i++){
    form.append(data[i].key, data[i].value)
  }
  http.defaults.headers['Content-Type'] = 'multipart/form-data'
  return form
}

/**
 * POST请求urlencoded数据格式化
 * @param {*} data 
 * @returns 
 */
http.URL = (data = {}) => {
    http.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    return qs.stringify(data)
}

/**
 * GET请求参数格式化
 * @param {*} data 
 * @returns 
 */
http.params = (data = {}) => {
  var defaults = {
    't': new Date().getTime()
  }
  http.defaults.headers['Content-Type'] = 'application/json; charset=utf-8'
  return merge(defaults, data)
}

export default http
