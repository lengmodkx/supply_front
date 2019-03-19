import { files } from "../../axios/api.js";
const store = {
  namespaced: true,
  state: {
    files: [],
    loading: true
  },
  mutations: {
    initFile(state, data) {
      state.files = data;
    }
  },
  actions: {
    initFile({ commit, state }, data) {
      files(data).then(res => {
        if (res.result == 1) {
          state.loading = false;
          commit("initFile", res.data);
        }
      });
    }
  }
};

export default store;
