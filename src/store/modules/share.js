import {shares} from '@/axios/api2'
const store={
    namespaced: true,
    state: {
        shareList:[],
        share: []
    },
    mutations: {
        init(state, data){
            state.shareList=data
            if (data){
                state.share=data[0]
                console.log(state.share)
            }
        },
        changeShare(state, data){
            state.share=state.shareList[data]
        },
    },
    actions: {
        init({commit},data){
            return new Promise((resolve, reject) => {
                shares(data).then(res => {
                    commit('init', res.data)
                    resolve()
                })
            })
        }
    }
}

export default store