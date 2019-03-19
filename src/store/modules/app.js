

const store = {
  namespaced: true,
  state: {
    loading: false,
    token: null
  },
  mutations: {
    updateLoading (state, data) {
      state.loading = data
    },

  }
}

export default store
