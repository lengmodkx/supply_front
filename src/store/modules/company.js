import {getAllOrg} from '@/axios/companyApi'
const  store ={
    namespaced: true,
    state: {
        companyList: []
    },
    mutations: {
        initCompany(state, data){
            state.companyList=data
            if (data[0]){
                state.companyList=data
            } else {
                state.companyList=[]
            }
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