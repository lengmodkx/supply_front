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
    users:{}
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
