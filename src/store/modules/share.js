import {shares} from '@/axios/api2'
import {getShareDetail} from '@/axios/api'
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
            }else{
                state.share =null
            }
        },
        changeShare(state, data) {
            state.share = data
        },
        // 编辑分享 推送
        editShare (state, data) {
            state.share=data
        },
        // 发消息 推送
        sendMsg (state, data) {
            state.share.logs.unshift(data)
        },
        // 清空分享详情、
        removeShare ( ) {
            console.log("removeShare>>>>>>>>>>>>>>>>>>>")
            state.share=null
        },
    },
    actions: {
        init({commit}, data) {
            return new Promise((resolve, reject) => {
                shares(data).then(res => {
                    if (res.result === 1) {
                        commit('init', res.data)
                        resolve()
                    }
                })
            })
        },

        // 点击左侧分享,改变数据
        changeShares ({commit}, data) {
            getShareDetail(data).then(res => {
                commit('changeShare',res.data)
            })
        },
        
        // 移动分享 推送
        removeShare ({commit}, data) {   
            shares(data).then(res => {
                if (res.result === 1) {
                    commit('init', res.data)
                    if (res.data.length){
                        getShareDetail(res.data[0].id).then(res => {
                            commit('changeShare',res.data)
                        })
                    }else {
                        commit('removeShare','')
                    }
                }
            })
        }
    }
}

export default store