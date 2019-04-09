import {getChat} from '@/axios/api'
const  store ={
    namespaced: true,
    state: {
        chatData: []
    },
    mutations: {
        initChat(state, data){
            state.chatData=data
        }
    },
    actions: {
        initChat({commit}, data){
            getChat(data).then(res => {
                if (res.result){
                    commit('initChat', res.data)
                }
            })
        }
    }
}

export default store