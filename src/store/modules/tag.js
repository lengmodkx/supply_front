import {getAllTag} from "@/axios/setAndTag";

const store = {
    namespaced: true,
    state: {
        tags: []
    },
    mutations: {
        init(state, data) {
            data.forEach(i => {
                i.showOpearte=false
            })
            state.tags = data
            console.log(2222222, state.tags)
        },
        // 关闭 标签菜单框
        closeMenu (state, data) {
            state.tags[data].showOpearte=false
        },
        // 创建新标签
        addNewTag (state, data) {
            data.showOpearte=false
            state.tags.unshift(data)
        },
        // 修改标签
        changeTag(state, data) {
            data.showOpearte=false
            state.tags.forEach((i,n) => {
                if (i.tagId===data.tagId){
                    state.tags[n]=data
                }
            })
        },
        // 标签移到回收站
        removeTagBin (state, data) {
            state.tags.forEach((i,n) => {
                if (i.tagId===data){
                    state.tags.splice(n,1)
                }
            })
        }
    },
    actions: {
        getTags({commit}, data) {
            getAllTag(data).then(res => {
                if (res.result === 1) {
                    commit('init', res.data.tags)
                }
            })
        }
    }
}

export default store