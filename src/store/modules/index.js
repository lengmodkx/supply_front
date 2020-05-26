

const store = {
    namespaced: true,
    state: {
       headerImg:localStorage.userImg,
       header:false,//控制头部
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