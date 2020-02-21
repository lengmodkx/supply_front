import {
    getChat
} from '@/axios/api'
const store = {
    namespaced: true,
    state: {
        chatData: [],
        images: []
    },
    mutations: {
        initChat(state, data) {
            state.chatData = data.data
            state.images = data.images
        },
        pushMsg(state, data) {
            if (data.userId === data.chat.memberId) {
                data.chat.isOwn = 1
            } else {
                data.chat.isOwn = 0
            }
            state.chatData.push(data.chat)
        },
        revoke(state, data) {
            state.chatData.forEach(item => {
                if (item.chatId === data) {
                    item.chatDel = 1
                }
            })
        }
    },
    actions: {
        initChat({
            commit
        }, data) {
            getChat(data).then(res => {
                if (res.result === 1) {
                    commit('initChat', res)
                }
            })
        },
        pushMsg({
            commit
        }, data) {
            commit('pushMsg', data)
        }
    }
}

export default store