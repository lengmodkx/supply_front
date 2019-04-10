import {
    projectMembers
} from "../../axios/api.js"
const store = {
    namespaced: true,
    state: {
        members: [], //项目成员（不包括参与者）
        users: [] //项目全部成员
    },
    mutations: {
        init(state, data) {
            // 创建一个新的对象，将data,state.members对象复制到新对象中
            let info = Object.assign({}, state.members, data);
            // 将state.personInfo指向新对象的引用地址
            state.members = info;
        },
        //初始化项目成员列表
        initUser(state, data) {
            state.users = data
        }
    },
    actions: {
        init({
            commit
        }, data) {
            commit('init', data.map(v => {
                v.isActive = true;
                return v
            }))
        },
        change({
            commit
        }, data) {
            commit('init', data)
        },
        initUser({
            commit
        }, data) {
            projectMembers(data).then(res => {
                if (res.result === 1) {
                    commit('initUser', res.data)
                }
            })
        }


    }
};

export default store;