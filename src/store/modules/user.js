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
    user:{}
  },
  mutations: {
    updateUserInfo(state, data) {
      state.userInfo = data
      sessionStorage.userInfo = JSON.stringify(data)
    },
    updateUserId(state, data) {
      // console.log(data)
      state.user = data
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
