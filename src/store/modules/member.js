import {
    projectMembers,getMemRoles
} from "../../axios/api.js"
const store = {
    namespaced: true,
    state: {
        members: [], //项目成员（不包括参与者）
        users: [], //项目全部成员
        roles:[]
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
        },
        initRoles(state,data){
            state.roles = data
        },
        //搜索用户
        filterUser(state,data){            
            state.users=state.users.filter((item,index,self) =>{ return item.memberName.includes(data)})
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
        initUser({commit}, data) {
            projectMembers(data).then(res => {
                if (res.result === 1) {
                    commit('initUser', res.data);
                }
            })
        },
        //搜索用户
        filterUser({commit},data){
            commit('filterUser',data)
        },
        getRoles({commit},data){
            getMemRoles(data.projectId,data.userId).then(res=>{
                commit('initRoles', res.data)
            }) 
        }

    }
};

export default store;