

const store = {
    namespaced: true,
    state: {
      viewId: null,
    },
    mutations: {
      updateView (state, data) {
        state.viewId=data
      },
    }
  }
  
  export default store
  