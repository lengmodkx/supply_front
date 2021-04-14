import {
    projectMembers,
    getMemRoles,
    projectMembersSerach
} from "../../axios/api.js"
const store = {
    namespaced: true,
    state: {
        members: [], //项目成员（不包括参与者）
        users: [], //项目全部成员
        roles: [],
        symbolData:[],//@中项目成员
        roleKey:''
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
        initroleKey(state,data){
            state.roleKey=data
        },
        initSymbol(state, data) {
            

            data.filter(v => v.memberId != localStorage.userId);

            state.symbolData.push(...data)
            const alluser={
                memberName:'所有人'
            }
            state.symbolData.unshift(alluser)
            console.log(state.symbolData,localStorage.userId)

        },
        initRoles(state, data) {
            state.roles = data
        },
        //搜索用户
        filterUser(state, data) {
            state.users = state.users.filter((item, index, self) => {
                return item.memberName.includes(data)
            })
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
                    commit('initUser', res.data);
                    commit('initSymbol', res.data);
                    commit('initroleKey', res.roleKey);

                }
            })
        },
        //搜索用户
        filterUser({
            commit
        }, data) {
            

            projectMembersSerach(data.id,data.key).then(res => {
                
                
                if (res.result === 1) {
                    commit('initUser', res.data)
                }
            })
           
            // commit('filterUser', data)
        },
        getRoles({
            commit
        }, data) {
            getMemRoles(data).then(res => {
                commit('initRoles', res.data)
            })
        }

    }
};

export default store;