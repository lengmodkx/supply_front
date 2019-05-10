

const store = {
  namespaced: true,
  state: {
    loading: false,
    token: null,
    view: '看板视图',
    activeHeaderTag: -1
  },
  mutations: {
    updateLoading (state, data) {
      state.loading = data
    },
    updateView (state, data) {
      state.view=data
    },
    changeHeaderTag (state, data) {
      state.activeHeaderTag=data
    }

  }
}

export default store
