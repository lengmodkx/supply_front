
const store = {
    namespaced: true,
    state: {
        vxproject: [123456789]
    },
    mutations: {
        updateProject (state, data) {
            state.vxproject = data
        }
    }
    // action: {
    //     updateProject ({commit}, data) {
    //         commit('updateProject', data)
    //     }
    // }
}

export default store