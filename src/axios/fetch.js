import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import iView from 'view-design'
let url = '';
if (process.env.NODE_ENV == 'test') {
  url = process.env.VUE_APP_TEST_URL
} else if (process.env.NODE_ENV == 'production') {
  url = process.env.VUE_APP_URL
} else {
  url = '/api'
}
const service = axios.create({
  //baseURL: "/api",
  // headers: {
  // 'token_in_header': "123",//  token从全局变量那里传过来
  // },
  //判断是生产环境还是开发环境
  baseURL: url,
  timeout: 1000 * 30
})

service.interceptors.request.use(config => {
  //如果要加token的话，先要在登录后将token存入session：
  if (localStorage.token) config.headers['x-auth-token'] = `${localStorage.token}`
  if (config.method == 'post' && !config.isJson && config.headers['Content-Type'] !== 'application/json') {
    if (config.specialPost) {

    } else {
      config.data = qs.stringify({
        ...config.data
      })
    }

  }
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use(
  response => {
    if (response.status === 203) {
      iView.Notice.error({
        title: response.data.msg
      })
      return
    }

    var token
    if (response.data.accessToken) {
      token = response.data.accessToken
    } else {
      // //获取返回的TOKEN
      token = response.headers['x-auth-token'];
    }

    if (token) {
      //将续期的TOKEN存起来
      localStorage.setItem("token", token);
    }

    const res = response.data
    return res //后台如果规范可直接判断code后返回res.result
  }, error => {
    if (error.response.status === 401) {
      console.log(window.location.origin);
      localStorage.token = ""
      window.location.href = '/';
    }
    return Promise.reject(error)
  }
)

export default service