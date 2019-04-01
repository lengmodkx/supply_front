import {} from "../../axios/api.js";

const store = {
    namespaced: true,
    state: {

    },
    getters: {

    },
    mutations: {
        //绑定标签
        bindingTag(state,data){

        }
    },
    actions: {
        //绑定标签
        bindingTag({commit},data){
            commit('bindingTag',data)
        }
    }
}

export default store