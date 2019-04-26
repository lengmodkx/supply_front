import {getAllOrg} from '@/axios/companyApi'
const  store ={
    namespaced: true,
    state: {
        companyList: []
    },
    mutations: {
        initCompany(state, data){
            state.companyList=data
        }
    },
    actions: {
        initCompany({commit}){
            getAllOrg().then(res => {
                console.log(res)
                commit('initCompany', res.data)
            })
        }
    }
}

export default store