

const store = {
  namespaced: true,
  state: {
    loading: false,
    token: null,
    view: '看板视图',
    activeHeaderTag: -1,
    header:true,
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
    },
    changeHeader(state, data) {
      state.header = data;
    },

  }
}

export default store
