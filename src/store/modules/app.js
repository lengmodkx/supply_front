

const store = {
  namespaced: true,
  state: {
    loading: false,
    token: null,
    view: '看板视图'
  },
  mutations: {
    updateLoading (state, data) {
      state.loading = data
    },
    updateView (state, data) {
      state.view=data
    },

  }
}

export default store
