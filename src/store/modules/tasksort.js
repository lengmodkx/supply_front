

const store = {
  namespaced: true,
  state: {
    sort:'1'
  },
  mutations: {
    updateSort(state, data) {
      state.sort = data
    }
  },
  actions: {
    updateSort({
      commit
    }, data) {
      commit('updateSort', data)
    }

  }
}

export default store
