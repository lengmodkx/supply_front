let userData;

try{
   userData = JSON.parse(sessionStorage.userInfo)
}catch(err){
  userData = sessionStorage.userInfo
}

const store = {
  namespaced: true,
  state: {
    userInfo:userData,
    users:{},
    mineRouter:'',
    projectRouter:''
  },
  mutations: {
    updateUserInfo(state, data) {
      // state.userInfo = data
      // sessionStorage.userInfo = JSON.stringify(data)
      state.userInfo = data
    },
    updateUserId(state, data) {
      console.log('我是ueserinfo啊',data)
      state.users = data
    },
    // 更改我的路由路径
    changeMineRouter(state, data){
      state.mineRouter=data
    },
    // 更改项目路由路径
    changeProjectRouter(state, data){
      state.projectRouter=data
    }
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
    }

  }
}

export default store
