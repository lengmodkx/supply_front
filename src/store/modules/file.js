import { files } from "../../axios/api.js";
const store = {
  namespaced: true,
  state: {
    files: [],
    file: {},
    joinInfoIds: []
  },
  mutations: {
    initFile(state, data) {
      state.files = data;
        console.log('filesaaaaaa',state.files)
    },
      // 文件详情 赋值
    putOneFile(state, data){
        state.file=data
        state.joinInfoIds=data.data.joinInfo.map(v => {
            return v.userId
        });
        console.log(state.file)
    }
  },
  actions: {
    initFile({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            files(data).then(res => {
                if (res.result == 1) {
                    commit("initFile", res.data);
                    resolve()
                }
            });
        })

    }
  }
};

export default store;
