import {getAllOrg} from '@/axios/companyApi'
const  store ={
    namespaced: true,
    state: {
        companyList: [],
        branchId: '',
        companyId: ''
    },
    mutations: {
        initCompany(state, data){
            state.companyList=data
        },
        setBranchId (state, data) {
            state.branchId=data
        }
    },
    actions: {
        initCompany({commit}){
            getAllOrg().then(res => {
                commit('initCompany', res.data)
            })
        }
    }
}

export default store