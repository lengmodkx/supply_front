import {
    shares
} from '@/axios/api2'
const store = {
    namespaced: true,
    state: {
        shareList: [],
        share: null
    },
    mutations: {
        init(state, data) {
            state.shareList = data
            if (data.length > 0) {
                state.share = data[0]
            }
        },
        changeShare(state, data) {
            state.share = state.shareList[data]
        },
    },
    actions: {
        init({
            commit
        }, data) {
            return new Promise((resolve, reject) => {
                shares(data).then(res => {
                    if (res.result === 1) {
                        commit('init', res.data)
                        resolve()
                    }
                })
            })
        }
    }
}

export default store