import {
    projectTag
} from "../../axios/api2.js";

const store = {
    namespaced: true,
    state: {
        tags: []
    },
    mutations: {
        init(state, data) {
            state.tags = data
        }
    },
    actions: {
        getTags({
            commit
        }, data) {
            projectTag(data).then(res => {
                if (res.result === 1) {
                    commit('init', res.data)
                }
            })
        }
    }
}

export default store