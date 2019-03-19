import axios from 'axios'
import qs from 'qs'
import store from '@/store'

const service = axios.create({
  baseURL: "/api",
  // headers: {
  // 'token_in_header': "123",//  token从全局变量那里传过来
  // },
  //判断是生产环境还是开发环境
  // baseURL: process.env.NODE_ENV == 'development' ? "/api/" : "", 
  timeout: 1000 * 30
})

service.interceptors.request.use(config => {
  store.commit('app/updateLoading', true) //加loding
  //如果要加token的话，先要在登录后将token存入session：
  if (sessionStorage.token) config.headers['Authorization'] = `${sessionStorage.token}`
  if (config.method == 'post' && !config.isJson) {
    config.data = qs.stringify({
      ...config.data
    })
  }
  // console.log("请求参数========", config.data)
  return config
}, error => {
  store.commit('app/updateLoading', false)
  return Promise.reject(error)
})

service.interceptors.response.use(
  response => {
    store.commit('app/updateLoading', false)
    const res = response.data
    return res //后台如果规范可直接判断code后返回res.result
  }, error => {
    store.commit('app/updateLoading', false)
    return Promise.reject(error)
  }
)

export default service
