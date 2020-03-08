

const store = {
    namespaced: true,
    state: {
       headerImg:localStorage.userImg
    },
    mutations: {
      
        initImg(state, data) {
            state.headerImg = data;
        
        },
    },
    actions: {
      
        changeImg({commit, }, data) {
            commit("initImg", data)
        },
      

    }
};

export default store;