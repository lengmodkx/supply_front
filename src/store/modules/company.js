import {getAllOrg} from '@/axios/companyApi'
import {getDepartmentTree} from "../../axios/companyApi";
const  store ={
    namespaced: true,
    state: {
        companyList: [],
        branchId: '',
        companyId: '',
        departmentTree:[]
    },
    mutations: {
        initCompany(state, data){
            state.companyList=data
        },
        setBranchId (state, data) {
            state.branchId=data
        },
        getDepartmentTree(state, data){
            state.departmentTree = data
        }
    },
    actions: {
        initCompany({commit}){
            getAllOrg().then(res => {
                commit('initCompany', res.data)
            })
        },

        getDepartmentTree({commit}, data){
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>");
            console.log(data)
            getDepartmentTree(data.orgId, data.departmentId).then(res => {
                commit('getDepartmentTree', res.data)
            })
        }
    }
}

export default store