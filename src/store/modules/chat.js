import {getChat} from '@/axios/api'
const  store ={
    namespaced: true,
    state: {
        chatData: []
    },
    mutations: {
        initChat(state, data){
            state.chatData=data
        },
        pushMsg(state,data){
            if(data.userId === data.chat.memberId){
                data.chat.isOwn = 1
            } else{
                data.chat.isOwn = 0
            }
            state.chatData.push(data.chat)
        }
    },
    actions: {
        initChat({commit}, data){
            return new Promise((resolve, reject) => {
                getChat(data).then(res => {
                    if (res.result === 1){
                        commit('initChat', res.data)
                        resolve()
                    }
                })
            })
        },
        pushMsg({commit},data){
            commit('pushMsg',data)
        }
    }
}

export default store