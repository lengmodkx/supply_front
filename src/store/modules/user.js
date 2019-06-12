
import {findUserInfo} from '@/axios/api';
let userData;

try{
   userData = JSON.parse(sessionStorage.userInfo)
}catch(err){
  userData = sessionStorage.userInfo
}

console.log(localStorage.userImg)

const store = {
  namespaced: true,
  state: {
    userInfo:userData,
    users:{},
    mineRouter:'/mine/nearThing',
    projectRouter:'/home',
    defaultImage:localStorage.userImg,
  },
  mutations: {
    updateUserInfo(state, data) {
      // state.userInfo = data
      // sessionStorage.userInfo = JSON.stringify(data)
      state.userInfo = data
    },
    updateUserId(state, data) {
      state.users = data
    },
    // 更改我的路由路径
    changeMineRouter(state, data){
      state.mineRouter=data
    },
    // 更改项目路由路径
    changeProjectRouter(state, data){
      state.projectRouter=data
    },
    initSrc(state, data) {
      state.defaultImage = data
    },
  },
  actions: {
    updateUserInfo({
      commit
    }, data) {
      commit('updateUserInfo', data)
    },
    updateUserId({
      commit
    }, data) {
      commit('updateUserId', data)
    },
    initSrc({commit},data){
      findUserInfo(localStorage.userId).then(res=>{
         commit('initSrc',res.data.defaultImage)
      })
     
    }

  }
}

export default store
